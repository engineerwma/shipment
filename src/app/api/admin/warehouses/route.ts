import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all warehouses with pagination and filtering
// GET - List all warehouses with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add city filter
    if (city && city !== 'ALL') {
      where.city = city;
    }

    // Add status filter
    if (status && status !== 'ALL') {
      where.isActive = status === 'active';
    }

    // Get warehouses with statistics
    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        where,
        select: {
          id: true,
          name: true,
          code: true,
          address: true,
          city: true,
          // Remove phone, email, managerName
          latitude: true,
          longitude: true,
          capacity: true,
          currentLoad: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          // Include shipment counts
          _count: {
            select: {
              shipments: true,
            },
          },
          // Get recent shipments
          shipments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              trackingNumber: true,
              status: true,
              createdAt: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.warehouse.count({ where }),
    ]);

    // Calculate utilization percentage and format data
    const formattedWarehouses = warehouses.map((warehouse) => {
      const utilization = warehouse.capacity > 0 
        ? Math.round((warehouse.currentLoad / warehouse.capacity) * 100)
        : 0;

      const status = warehouse.isActive ? 'active' : 'inactive';
      
      // Determine status color based on utilization
      let statusColor = 'green';
      if (utilization >= 90) statusColor = 'red';
      else if (utilization >= 75) statusColor = 'yellow';

      return {
        ...warehouse,
        utilization,
        status,
        statusColor,
        availableSpace: warehouse.capacity - warehouse.currentLoad,
        shipmentCount: warehouse._count.shipments,
        recentShipments: warehouse.shipments,
      };
    });

    return NextResponse.json({
      warehouses: formattedWarehouses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouses' },
      { status: 500 }
    );
  }
}

// POST - Create new warehouse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name,
      code,
      address,
      city,
      latitude,
      longitude,
      capacity,
      currentLoad = 0,
      isActive = true,
    } = body;

    // Validate required fields
    if (!name || !code || !address || !city || !latitude || !longitude || !capacity) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if warehouse code already exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { code },
    });

    if (existingWarehouse) {
      return NextResponse.json(
        { error: 'Warehouse with this code already exists' },
        { status: 400 }
      );
    }

    // Create warehouse
    const warehouse = await prisma.warehouse.create({
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
        createdAt: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Warehouse created successfully', 
        warehouse 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to create warehouse' },
      { status: 500 }
    );
  }
}
// POST - Create new warehouse
