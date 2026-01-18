import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ShipmentStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

interface UpdateDriverData {
  name?: string;
  email?: string;
  phone?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  currentLat?: number;
  currentLng?: number;
  password?: string;
}

// GET - Get single driver by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const driver = await prisma.user.findUnique({
      where: { 
        id,
        role: 'DRIVER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        vehicleNumber: true,
        licenseNumber: true,
        isActive: true,
        isAvailable: true,
        currentLat: true,
        currentLng: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        shipmentsDelivered: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            trackingNumber: true,
            customerName: true,
            customerAddress: true,
            status: true,
            shippingCost: true,
            deliveryDate: true,
            createdAt: true,
          },
        },
        // Count only
        _count: {
          select: {
            shipmentsDelivered: true,
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Calculate statistics from shipments
    const allShipments = await prisma.shipment.findMany({
      where: {
        driverId: id,
      },
      select: {
        status: true,
        shippingCost: true,
      },
    });

    // Calculate statistics
    const deliveredShipments = allShipments.filter(s => s.status === 'DELIVERED');
    const failedShipments = allShipments.filter(s => 
      s.status === 'DELIVERY_FAILED' || 
      s.status === 'RETURNED' || 
      s.status === 'PARTIAL_RETURNED'
    );
    
    const totalDeliveries = deliveredShipments.length;
    const failedDeliveries = failedShipments.length;
    const totalShipments = allShipments.length;
    const successRate = totalShipments > 0 
      ? Math.round((totalDeliveries / totalShipments) * 100) 
      : 0;

    // Calculate earnings
    const totalEarnings = deliveredShipments.reduce(
      (sum, shipment) => sum + (shipment.shippingCost || 0),
      0
    );

    // Calculate rating based on performance
    const baseRating = 4.0;
    const ratingBonus = successRate >= 95 ? 0.8 : 
                       successRate >= 90 ? 0.5 : 
                       successRate >= 85 ? 0.3 : 
                       successRate >= 80 ? 0.1 : 0;
    
    const rating = Math.min(5.0, baseRating + ratingBonus);

    return NextResponse.json({
      driver: {
        ...driver,
        statistics: {
          totalDeliveries,
          failedDeliveries,
          totalShipments,
          successRate,
          totalEarnings,
          rating: parseFloat(rating.toFixed(1)),
        },
        recentShipments: driver.shipmentsDelivered,
      },
    });
  } catch (error) {
    console.error('Error fetching driver:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver' },
      { status: 500 }
    );
  }
}

// PUT - Update driver
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      vehicleNumber, 
      licenseNumber,
      isActive,
      isAvailable,
      currentLat,
      currentLng,
      password
    } = body;

    // Check if driver exists
    const existingDriver = await prisma.user.findUnique({
      where: { 
        id,
        role: 'DRIVER',
      },
    });

    if (!existingDriver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: UpdateDriverData = {
      name,
      phone,
      vehicleNumber,
      licenseNumber,
      isActive,
      isAvailable,
      currentLat,
      currentLng,
    };

    // Check if email is being changed
    if (email && email !== existingDriver.email) {
      // Check if new email already exists
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists && emailExists.id !== id) {
        return NextResponse.json(
          { error: 'Email already in use by another user' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    // Update password if provided
    if (password && password.trim() !== '') {
      const hashedPassword = await hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update driver
    const updatedDriver = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        vehicleNumber: true,
        licenseNumber: true,
        isActive: true,
        isAvailable: true,
        currentLat: true,
        currentLng: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Driver updated successfully',
      driver: updatedDriver,
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}

// DELETE - Delete driver
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if driver exists
    const existingDriver = await prisma.user.findUnique({
      where: { 
        id,
        role: 'DRIVER',
      },
    });

    if (!existingDriver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Check if driver has active shipments (not delivered)
    const activeShipments = await prisma.shipment.count({
      where: {
        driverId: id,
        status: { 
          notIn: ['DELIVERED', 'RETURNED', 'PARTIAL_RETURNED', 'DELIVERY_FAILED'] 
        },
      },
    });

    if (activeShipments > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete driver with active shipments. Please reassign shipments first.' 
        },
        { status: 400 }
      );
    }

    // Delete driver
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Driver deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    );
  }
}