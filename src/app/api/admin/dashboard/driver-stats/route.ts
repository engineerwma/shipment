import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get today's date for calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get driver statistics
    const drivers = await prisma.user.findMany({
      where: {
        role: 'DRIVER',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        vehicleNumber: true,
        isAvailable: true,
        shipmentsDelivered: {
          where: {
            status: 'DELIVERED',
            deliveryDate: {
              gte: today,
              lt: tomorrow,
            },
          },
          select: {
            id: true,
            shippingCost: true,
          },
        },
        _count: {
          select: {
            shipmentsDelivered: {
              where: {
                status: 'DELIVERED',
              },
            },
          },
        },
      },
      take: 10,
    });

    // Calculate today's deliveries and earnings
    const driversWithStats = drivers.map(driver => {
      const todayDeliveries = driver.shipmentsDelivered.length;
      const todayEarnings = driver.shipmentsDelivered.reduce(
        (sum, shipment) => sum + (shipment.shippingCost || 0),
        0
      );

      return {
        ...driver,
        todayDeliveries,
        todayEarnings,
        totalDeliveries: driver._count.shipmentsDelivered,
      };
    });

    // Sort by today's earnings
    const topPerformers = driversWithStats
      .filter(d => d.todayDeliveries > 0)
      .sort((a, b) => b.todayDeliveries - a.todayDeliveries)
      .slice(0, 5);

    // Get unavailable drivers
    const unavailableDrivers = drivers.filter(d => !d.isAvailable).length;

    return NextResponse.json({
      drivers: driversWithStats,
      topPerformers,
      totalDrivers: drivers.length,
      availableDrivers: drivers.filter(d => d.isAvailable).length,
      unavailableDrivers,
    });
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver statistics' },
      { status: 500 }
    );
  }
}