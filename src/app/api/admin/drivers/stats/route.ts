import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DriverPerformance {
  id: string;
  name: string;
  successRate: number;
  earnings: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get driver statistics
    const [
      totalDrivers,
      activeDrivers,
      availableDrivers,
      earningsResult,
      locationsData,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'DRIVER' } }),
      prisma.user.count({ where: { role: 'DRIVER', isActive: true } }),
      prisma.user.count({ where: { role: 'DRIVER', isActive: true, isAvailable: true } }),
      prisma.shipment.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { shippingCost: true },
      }),
      prisma.user.findMany({
        where: { role: 'DRIVER', isActive: true },
        select: { id: true, name: true, currentLat: true, currentLng: true, vehicleNumber: true },
        take: 20,
      }),
    ]);

    // Get driver IDs
    const driverIds = locationsData.slice(0, 10).map(d => d.id);

    // Get aggregated shipment data for these drivers
    const shipmentAggregates = await prisma.shipment.groupBy({
      by: ['driverId', 'status'],
      where: {
        driverId: { in: driverIds },
        status: { in: ['DELIVERED', 'DELIVERY_FAILED', 'RETURNED'] },
      },
      _count: { _all: true },
      _sum: { shippingCost: true },
    });

    // Calculate performance for each driver
    const performance: DriverPerformance[] = [];

    for (const driver of locationsData.slice(0, 10)) {
      const driverShipments = shipmentAggregates.filter(s => s.driverId === driver.id);
      
      const deliveredData = driverShipments.find(s => s.status === 'DELIVERED');
      const failedData = driverShipments.filter(s => 
        s.status === 'DELIVERY_FAILED' || s.status === 'RETURNED'
      );

      const successfulDeliveries = deliveredData?._count?._all || 0;
      const failedDeliveries = failedData.reduce((sum, item) => sum + (item._count?._all || 0), 0);
      const earnings = deliveredData?._sum?.shippingCost || 0;

      const totalShipments = successfulDeliveries + failedDeliveries;
      const successRate = totalShipments > 0 
        ? Math.round((successfulDeliveries / totalShipments) * 100) 
        : 0;

      performance.push({
        id: driver.id,
        name: driver.name,
        successRate,
        earnings,
      });
    }

    return NextResponse.json({
      totalDrivers,
      activeDrivers,
      availableDrivers,
      totalEarnings: earningsResult._sum.shippingCost || 0,
      locations: locationsData.filter(d => d.currentLat && d.currentLng),
      topPerformers: performance
        .sort((a, b) => b.successRate - a.successRate)
        .slice(0, 5),
      topEarners: performance
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching driver statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver statistics' },
      { status: 500 }
    );
  }
}