import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify merchant token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const merchantId = decoded.id;

    // Get merchant-specific stats
    const [
      totalShipments,
      delivered,
      inTransit,
      pending,
      returns,
      revenue,
      pendingWithdrawal,
    ] = await Promise.all([
      prisma.shipment.count({ where: { merchantId } }),
      prisma.shipment.count({
        where: { merchantId, status: 'DELIVERED' },
      }),
      prisma.shipment.count({
        where: {
          merchantId,
          status: { in: ['IN_RECEIPT', 'IN_WAREHOUSE', 'WITH_DRIVER'] },
        },
      }),
      prisma.shipment.count({ where: { merchantId, status: 'NEW' } }),
      prisma.shipment.count({
        where: {
          merchantId,
          OR: [{ status: 'RETURNED' }, { status: 'PARTIAL_RETURNED' }],
        },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: merchantId,
          status: 'PAID',
          type: 'PAYMENT',
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: merchantId,
          status: 'PENDING',
          type: 'WITHDRAWAL',
        },
        _sum: { amount: true },
      }),
    ]);

    // Recent shipments
    const recentShipments = await prisma.shipment.findMany({
      where: { merchantId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        trackingNumber: true,
        customerName: true,
        customerPhone: true,
        customerCity: true,
        status: true,
        shippingCost: true,
        codAmount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalShipments,
        delivered,
        inTransit,
        pending,
        returns,
        revenue: revenue._sum.amount || 0,
        pendingWithdrawal: pendingWithdrawal._sum.amount || 0,
      },
      recentShipments,
    });
  } catch (error) {
    console.error('Merchant dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}