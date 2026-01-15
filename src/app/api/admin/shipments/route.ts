import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const merchantId = searchParams.get('merchantId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (merchantId) {
      where.merchantId = merchantId;
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              companyName: true,
            },
          },
          driver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.shipment.count({ where }),
    ]);

    return NextResponse.json({
      shipments,
      pagination: {
        total,
        page,
        limit,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generateTrackingNumber, generateBarcode } = await import('@/lib/utils');

    const shipment = await prisma.shipment.create({
      data: {
        ...body,
        trackingNumber: generateTrackingNumber(),
        barcode: generateBarcode(),
      },
    });

    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}