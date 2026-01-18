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

    // Calculate overall utilization
    const totalUtilization = totalCapacity._sum.capacity && totalCurrentLoad._sum.currentLoad
      ? Math.round((totalCurrentLoad._sum.currentLoad / totalCapacity._sum.capacity) * 100)
      : 0;

    // Format warehouses by city
    const formattedCities = warehousesByCity.map((city) => ({
      city: city.city,
      count: city._count.id,
      capacity: city._sum.capacity || 0,
      currentLoad: city._sum.currentLoad || 0,
      utilization: city._sum.capacity 
        ? Math.round((city._sum.currentLoad / city._sum.capacity) * 100)
        : 0,
    }));

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
      totalCapacity: totalCapacity._sum.capacity || 0,
      totalCurrentLoad: totalCurrentLoad._sum.currentLoad || 0,
      totalUtilization,
      cities: formattedCities,
      topUtilized: formattedTopWarehouses,
      availableSpace: (totalCapacity._sum.capacity || 0) - (totalCurrentLoad._sum.currentLoad || 0),
    });
  } catch (error) {
    console.error('Error fetching warehouse statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse statistics' },
      { status: 500 }
    );
  }
}