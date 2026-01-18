import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get warehouse utilization stats
    const warehouses = await prisma.warehouse.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        capacity: true,
        currentLoad: true,
        city: true,
        shipments: {
          where: {
            status: 'IN_WAREHOUSE',
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Calculate utilization
    const warehousesWithStats = warehouses.map(warehouse => {
      const utilization = warehouse.capacity > 0 
        ? Math.round((warehouse.currentLoad / warehouse.capacity) * 100)
        : 0;
      
      return {
        ...warehouse,
        utilization,
        availableSpace: warehouse.capacity - warehouse.currentLoad,
        shipmentCount: warehouse.shipments.length,
        status: utilization >= 90 ? 'critical' : utilization >= 75 ? 'warning' : 'good',
      };
    });

    // Find warehouses with high utilization (>= 85%)
    const highUtilizationWarehouses = warehousesWithStats
      .filter(w => w.utilization >= 85)
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 3);

    // Calculate overall stats
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const totalCurrentLoad = warehouses.reduce((sum, w) => sum + w.currentLoad, 0);
    const overallUtilization = totalCapacity > 0 
      ? Math.round((totalCurrentLoad / totalCapacity) * 100)
      : 0;

    return NextResponse.json({
      warehouses: warehousesWithStats,
      highUtilizationWarehouses,
      overallUtilization,
      totalCapacity,
      totalCurrentLoad,
      availableSpace: totalCapacity - totalCurrentLoad,
    });
  } catch (error) {
    console.error('Error fetching warehouse stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse statistics' },
      { status: 500 }
    );
  }
}