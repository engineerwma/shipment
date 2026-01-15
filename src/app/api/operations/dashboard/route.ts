import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify operations token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get operations stats
    const [
      inWarehouse,
      toDispatch,
      dispatchedToday,
      activeDrivers,
      warehouseCapacity,
      alerts,
    ] = await Promise.all([
      prisma.shipment.count({ where: { status: 'IN_WAREHOUSE' } }),
      prisma.shipment.count({ where: { status: 'IN_RECEIPT' } }),
      prisma.shipment.count({
        where: {
          status: 'WITH_DRIVER',
          updatedAt: { gte: today },
        },
      }),
      prisma.user.count({
        where: { role: 'DRIVER', isActive: true, isAvailable: true },
      }),
      prisma.warehouse.aggregate({
        _avg: {
          currentLoad: true,
          capacity: true,
        },
      }),
      prisma.shipment.count({
        where: {
          status: 'DELIVERY_FAILED',
          updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    // Warehouses with shipments count
    const warehouses = await prisma.warehouse.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { shipments: true },
        },
      },
    });

    // Shipments to dispatch
    const shipmentsToDispatch = await prisma.shipment.findMany({
      where: { status: 'IN_RECEIPT' },
      take: 5,
      select: {
        id: true,
        trackingNumber: true,
        customerAddress: true,
        customerCity: true,
        shippingCost: true,
      },
    });

    return NextResponse.json({
      stats: {
        inWarehouse,
        toDispatch,
        dispatchedToday,
        activeDrivers,
        warehouseCapacity: Math.round(
          ((warehouseCapacity._avg.currentLoad || 0) /
            (warehouseCapacity._avg.capacity || 1)) *
            100
        ),
        alerts,
      },
      warehouses: warehouses.map((w) => ({
        ...w,
        shipmentsCount: w._count.shipments,
      })),
      shipmentsToDispatch,
    });
  } catch (error) {
    console.error('Operations dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}