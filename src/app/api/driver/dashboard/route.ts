import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify driver token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const driverId = decoded.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get driver-specific stats
    const [
      todaysShipments,
      deliveredToday,
      pendingDelivery,
      earningsToday,
      totalEarnings,
    ] = await Promise.all([
      prisma.shipment.count({
        where: {
          driverId,
          createdAt: { gte: today },
        },
      }),
      prisma.shipment.count({
        where: {
          driverId,
          status: 'DELIVERED',
          deliveryDate: { gte: today },
        },
      }),
      prisma.shipment.count({
        where: { driverId, status: 'WITH_DRIVER' },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: driverId,
          type: 'COMMISSION',
          createdAt: { gte: today },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: driverId,
          type: 'COMMISSION',
        },
        _sum: { amount: true },
      }),
    ]);

    // Current shipments
    const currentShipments = await prisma.shipment.findMany({
      where: { driverId, status: 'WITH_DRIVER' },
      select: {
        id: true,
        trackingNumber: true,
        customerName: true,
        customerPhone: true,
        customerAddress: true,
        customerCity: true,
        customerZone: true,
        status: true,
        shippingCost: true,
        codAmount: true,
      },
    });

    return NextResponse.json({
      stats: {
        todaysShipments,
        deliveredToday,
        pendingDelivery,
        earningsToday: earningsToday._sum.amount || 0,
        totalEarnings: totalEarnings._sum.amount || 0,
        rating: 4.8,
      },
      currentShipments,
    });
  } catch (error) {
    console.error('Driver dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}