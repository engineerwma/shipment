import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get single warehouse by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        // Remove phone, email, managerName since they don't exist in schema
        latitude: true,
        longitude: true,
        capacity: true,
        currentLoad: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Get shipment statistics
        shipments: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            trackingNumber: true,
            customerName: true,
            customerCity: true,
            status: true,
            shippingCost: true,
            weight: true,
            createdAt: true,
            updatedAt: true,
            merchant: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
          },
        },
        _count: {
          select: {
            shipments: true,
          },
        },
      },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // Calculate utilization and statistics
    const utilization = warehouse.capacity > 0 
      ? Math.round((warehouse.currentLoad / warehouse.capacity) * 100)
      : 0;

    // Categorize shipments by status
    const shipmentStats = {
      total: warehouse._count.shipments,
      inWarehouse: warehouse.shipments.filter(s => s.status === 'IN_WAREHOUSE').length,
      withDriver: warehouse.shipments.filter(s => s.status === 'WITH_DRIVER').length,
      delivered: warehouse.shipments.filter(s => s.status === 'DELIVERED').length,
      pending: warehouse.shipments.filter(s => 
        ['NEW', 'IN_RECEIPT'].includes(s.status)
      ).length,
    };

    // Calculate total value
    const totalValue = warehouse.shipments.reduce(
      (sum, shipment) => sum + (shipment.shippingCost || 0),
      0
    );

    return NextResponse.json({
      warehouse: {
        ...warehouse,
        utilization,
        availableSpace: warehouse.capacity - warehouse.currentLoad,
        shipmentStats,
        totalValue,
        status: warehouse.isActive ? 'active' : 'inactive',
        statusColor: utilization >= 90 ? 'red' : utilization >= 75 ? 'yellow' : 'green',
        shipmentCount: warehouse._count.shipments,
        recentShipments: warehouse.shipments,
      },
    });
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse' },
      { status: 500 }
    );
  }
}

// PUT - Update warehouse
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      name,
      code,
      address,
      city,
      latitude,
      longitude,
      capacity,
      currentLoad,
      isActive,
    } = body;

    // Check if warehouse exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // Validate capacity
    if (capacity !== undefined && currentLoad !== undefined && currentLoad > capacity) {
      return NextResponse.json(
        { error: 'Current load cannot exceed capacity' },
        { status: 400 }
      );
    }

    // Check if code is being changed
    if (code && code !== existingWarehouse.code) {
      // Check if new code already exists
      const codeExists = await prisma.warehouse.findUnique({
        where: { code },
      });

      if (codeExists && codeExists.id !== id) {
        return NextResponse.json(
          { error: 'Warehouse code already exists' },
          { status: 400 }
        );
      }
    }

    // Update warehouse
    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        name,
        code,
        address,
        city,
        latitude,
        longitude,
        capacity,
        currentLoad,
        isActive,
      },
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        capacity: true,
        currentLoad: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Warehouse updated successfully',
      warehouse: updatedWarehouse,
    });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to update warehouse' },
      { status: 500 }
    );
  }
}

// DELETE - Delete warehouse
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if warehouse exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // Check if warehouse has shipments
    const shipmentCount = await prisma.shipment.count({
      where: {
        warehouseId: id,
        status: { not: 'DELIVERED' },
      },
    });

    if (shipmentCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete warehouse with active shipments. Please transfer shipments first.' 
        },
        { status: 400 }
      );
    }

    // Delete warehouse
    await prisma.warehouse.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Warehouse deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to delete warehouse' },
      { status: 500 }
    );
  }
}