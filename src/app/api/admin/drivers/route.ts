import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// GET - List all drivers with pagination, filtering, and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      role: 'DRIVER',
    };

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { vehicleNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add status filter
    if (status && status !== 'ALL') {
      where.isActive = status === 'active';
    }

    // Add location filter (based on shipments or can be city field if added)
    if (location) {
      // If you add city to User model, use:
      // where.city = location;
      // For now, we'll skip location filter or implement differently
    }

    // Get drivers with their statistics
    const [drivers, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
          // Include aggregated data
          _count: {
            select: {
              shipmentsDelivered: {
                where: { status: 'DELIVERED' },
              },
            },
          },
          shipmentsDelivered: {
            where: { status: 'DELIVERED' },
            select: {
              shippingCost: true,
              deliveryDate: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Transform data to include calculated fields
    const formattedDrivers = drivers.map((driver) => {
      const totalEarnings = driver.shipmentsDelivered.reduce(
        (sum, shipment) => sum + (shipment.shippingCost || 0),
        0
      );

      // Mock performance metrics (you can implement real calculations based on your business logic)
      const successRate = Math.floor(Math.random() * 10) + 90; // 90-99%
      const rating = 4 + Math.random(); // 4.0-5.0

      return {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        vehicleNumber: driver.vehicleNumber,
        licenseNumber: driver.licenseNumber,
        status: driver.isActive ? 'active' : 'inactive',
        isAvailable: driver.isAvailable,
        currentLocation: driver.currentLat && driver.currentLng 
          ? 'On Route' 
          : 'Not Available',
        totalDeliveries: driver._count.shipmentsDelivered,
        successRate,
        rating: parseFloat(rating.toFixed(1)),
        earnings: totalEarnings,
        joinedDate: driver.createdAt.toISOString().split('T')[0],
        lastActive: driver.updatedAt.toISOString(),
        avatar: driver.avatar,
      };
    });

    return NextResponse.json({
      drivers: formattedDrivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

// POST - Create new driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      name, 
      phone, 
      vehicleNumber, 
      licenseNumber,
      isActive = true,
      isAvailable = true 
    } = body;

    // Validate required fields
    if (!email || !password || !name || !phone || !vehicleNumber || !licenseNumber) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Driver with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create driver
    const driver = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'DRIVER',
        vehicleNumber,
        licenseNumber,
        isActive,
        isAvailable,
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
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Driver created successfully', 
        driver 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}