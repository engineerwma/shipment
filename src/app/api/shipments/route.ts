import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate tracking number and barcode
    const trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const barcode = `BC${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    const shipment = await prisma.shipment.create({
      data: {
        ...body,
        trackingNumber,
        barcode,
      },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleNumber: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
          },
        },
      },
    });

    // Create initial status history
    await prisma.shipmentHistory.create({
      data: {
        shipmentId: shipment.id,
        status: shipment.status,
        notes: 'Shipment created',
      },
    });

    return NextResponse.json(
      { message: 'Shipment created successfully', shipment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const merchantId = searchParams.get('merchantId');
    const driverId = searchParams.get('driverId');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(merchantId && { merchantId }),
      ...(driverId && { driverId }),
      ...(search && {
        OR: [
          { trackingNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerPhone: { contains: search, mode: 'insensitive' } },
          { customerCity: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
              vehicleNumber: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
              city: true,
            },
          },
          statusHistory: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shipment.count({ where }),
    ]);

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}