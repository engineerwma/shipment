import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all statistics in parallel
    const [
      totalDrivers,
      activeDrivers,
      availableDrivers,
      earningsResult,
      locationsData,
      // Remove the problematic query and replace with simpler approach
    ] = await Promise.all([
      // Total drivers
      prisma.user.count({
        where: { role: 'DRIVER' },
      }),

      // Active drivers
      prisma.user.count({
        where: { 
          role: 'DRIVER',
          isActive: true,
        },
      }),

      // Available drivers
      prisma.user.count({
        where: { 
          role: 'DRIVER',
          isActive: true,
          isAvailable: true,
        },
      }),

      // Total earnings from delivered shipments
      prisma.shipment.aggregate({
        where: {
          status: 'DELIVERED',
          driver: {
            isActive: true,
          },
        },
        _sum: {
          shippingCost: true,
        },
      }),

      // Get driver locations
      prisma.user.findMany({
        where: { 
          role: 'DRIVER',
          isActive: true,
        },
        select: {
          currentLat: true,
          currentLng: true,
          name: true,
          vehicleNumber: true,
        },
        take: 20,
      }),

      // Get driver shipments data separately
      prisma.user.findMany({
        where: { 
          role: 'DRIVER',
          isActive: true,
        },
        select: {
          id: true,
          name: true,
        },
        take: 10,
      }),
    ]);

    // Get performance data for each driver
    const performance = await Promise.all(
      locationsData.slice(0, 10).map(async (driver) => {
        // Get successful deliveries
        const successfulDeliveries = await prisma.shipment.count({
          where: {
            driverId: driver.id,
            status: 'DELIVERED',
          },
        });

        // Get failed deliveries
        const failedDeliveries = await prisma.shipment.count({
          where: {
            driverId: driver.id,
            status: { in: ['DELIVERY_FAILED', 'RETURNED'] },
          },
        });

        // Get earnings
        const earningsResult = await prisma.shipment.aggregate({
          where: {
            driverId: driver.id,
            status: 'DELIVERED',
          },
          _sum: {
            shippingCost: true,
          },
        });

        const totalShipments = successfulDeliveries + failedDeliveries;
        const successRate = totalShipments > 0 
          ? Math.round((successfulDeliveries / totalShipments) * 100) 
          : 0;
      
        const earnings = earningsResult._sum.shippingCost || 0;

        return {
          id: driver.id,
          name: driver.name,
          successRate,
          earnings,
        };
      })
    );

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