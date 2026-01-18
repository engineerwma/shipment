import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const recentShipments = await prisma.shipment.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        trackingNumber: true,
        customerName: true,
        customerCity: true,
        customerPhone: true,
        status: true,
        shippingCost: true,
        codAmount: true,
        createdAt: true,
        updatedAt: true,
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
            vehicleNumber: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json({
      shipments: recentShipments,
    });
  } catch (error) {
    console.error('Error fetching recent shipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent shipments' },
      { status: 500 }
    );
  }
}