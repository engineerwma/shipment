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
      performanceData,
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

      // Get driver locations (mock for now)
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

      // Performance data
      prisma.user.findMany({
        where: { 
          role: 'DRIVER',
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              shipmentsDelivered: {
                where: { status: 'DELIVERED' },
              },
              shipmentsDeliveredFailed: {
                where: { status: { in: ['DELIVERY_FAILED', 'RETURNED'] } },
              },
            },
          },
          shipmentsDelivered: {
            take: 50,
            select: {
              shippingCost: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    // Calculate performance metrics
    const performance = performanceData.map((driver) => {
      const totalDeliveries = driver._count.shipmentsDelivered;
      const failedDeliveries = driver._count.shipmentsDeliveredFailed;
      const totalShipments = totalDeliveries + failedDeliveries;
      const successRate = totalShipments > 0 
        ? Math.round((totalDeliveries / totalShipments) * 100) 
        : 0;
      
      const earnings = driver.shipmentsDelivered.reduce(
        (sum, shipment) => sum + (shipment.shippingCost || 0),
        0
      );

      return {
        id: driver.id,
        name: driver.name,
        successRate,
        earnings,
      };
    });

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