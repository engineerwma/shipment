import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts
    const [
      totalShipments,
      activeDrivers,
      totalMerchants,
      warehouses,
      revenue,
      pendingShipments,
      deliveredToday,
      returns,
    ] = await Promise.all([
      prisma.shipment.count(),
      prisma.user.count({
        where: { role: 'DRIVER', isActive: true, isAvailable: true },
      }),
      prisma.user.count({ where: { role: 'MERCHANT', isActive: true } }),
      prisma.warehouse.count({ where: { isActive: true } }),
      prisma.transaction.aggregate({
        where: { status: 'PAID', type: 'PAYMENT' },
        _sum: { amount: true },
      }),
      prisma.shipment.count({ where: { status: 'NEW' } }),
      prisma.shipment.count({
        where: {
          status: 'DELIVERED',
          deliveryDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.shipment.count({
        where: { OR: [{ status: 'RETURNED' }, { status: 'PARTIAL_RETURNED' }] },
      }),
    ]);

    // Recent shipments
    const recentShipments = await prisma.shipment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalShipments,
        activeDrivers,
        totalMerchants,
        warehouses,
        revenue: revenue._sum.amount || 0,
        pendingShipments,
        deliveredToday,
        returns,
      },
      recentShipments,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}