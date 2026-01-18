import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all statistics in parallel
    const [
      totalWarehouses,
      activeWarehouses,
      totalCapacity,
      totalCurrentLoad,
      warehousesByCity,
      topUtilizedWarehouses,
    ] = await Promise.all([
      // Total warehouses
      prisma.warehouse.count(),

      // Active warehouses
      prisma.warehouse.count({
        where: { isActive: true },
      }),

      // Total capacity
      prisma.warehouse.aggregate({
        _sum: { capacity: true },
      }),

      // Total current load
      prisma.warehouse.aggregate({
        _sum: { currentLoad: true },
      }),

      // Warehouses by city
      prisma.warehouse.groupBy({
        by: ['city'],
        where: { isActive: true },
        _count: { id: true },
        _sum: { capacity: true, currentLoad: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Top utilized warehouses
      prisma.warehouse.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
          city: true,
          capacity: true,
          currentLoad: true,
          _count: {
            select: { shipments: true },
          },
        },
        orderBy: { currentLoad: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate overall utilization with null checks
    const capacitySum = totalCapacity._sum.capacity ?? 0;
    const currentLoadSum = totalCurrentLoad._sum.currentLoad ?? 0;
    const totalUtilization = capacitySum > 0
      ? Math.round((currentLoadSum / capacitySum) * 100)
      : 0;

    // Format warehouses by city with null checks
    const formattedCities = warehousesByCity.map((city) => {
      const cityCapacity = city._sum.capacity ?? 0;
      const cityCurrentLoad = city._sum.currentLoad ?? 0;
      
      return {
        city: city.city,
        count: city._count.id,
        capacity: cityCapacity,
        currentLoad: cityCurrentLoad,
        utilization: cityCapacity > 0
          ? Math.round((cityCurrentLoad / cityCapacity) * 100)
          : 0,
      };
    });

    // Format top utilized warehouses
    const formattedTopWarehouses = topUtilizedWarehouses.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
      city: warehouse.city,
      capacity: warehouse.capacity,
      currentLoad: warehouse.currentLoad,
      utilization: warehouse.capacity > 0
        ? Math.round((warehouse.currentLoad / warehouse.capacity) * 100)
        : 0,
      shipmentCount: warehouse._count.shipments,
    }));

    return NextResponse.json({
      totalWarehouses,
      activeWarehouses,
      totalCapacity: capacitySum,
      totalCurrentLoad: currentLoadSum,
      totalUtilization,
      cities: formattedCities,
      topUtilized: formattedTopWarehouses,
      availableSpace: capacitySum - currentLoadSum,
    });
  } catch (error) {
    console.error('Error fetching warehouse statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse statistics' },
      { status: 500 }
    );
  }
}