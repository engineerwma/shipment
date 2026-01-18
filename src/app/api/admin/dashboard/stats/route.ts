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
    
    // Get start of current month for monthly revenue
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get all statistics in parallel for better performance
    const [
      totalShipments,
      activeDrivers,
      totalMerchants,
      warehouses,
      revenueResult,
      pendingShipments,
      deliveredToday,
      returns,
      // New: Get merchants count and warehouses count
      merchantsCount,
      warehousesCount,
    ] = await Promise.all([
      // Total shipments
      prisma.shipment.count(),

      // Active drivers (available and active)
      prisma.user.count({
        where: {
          role: 'DRIVER',
          isActive: true,
          isAvailable: true,
        },
      }),

      // Total merchants (active merchants)
      prisma.user.count({
        where: {
          role: 'MERCHANT',
          isActive: true,
        },
      }),

      // Active warehouses
      prisma.warehouse.count({
        where: {
          isActive: true,
        },
      }),

      // Revenue (sum of shipping costs from delivered shipments this month)
      prisma.shipment.aggregate({
        where: {
          status: 'DELIVERED',
          deliveryDate: {
            gte: startOfMonth,
          },
        },
        _sum: {
          shippingCost: true,
        },
      }),

      // Pending shipments (not delivered, not returned)
      prisma.shipment.count({
        where: {
          status: {
            notIn: ['DELIVERED', 'RETURNED', 'PARTIAL_RETURNED', 'DELIVERY_FAILED'],
          },
        },
      }),

      // Delivered today
      prisma.shipment.count({
        where: {
          status: 'DELIVERED',
          deliveryDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Returns (returned and partial returned)
      prisma.shipment.count({
        where: {
          status: {
            in: ['RETURNED', 'PARTIAL_RETURNED'],
          },
        },
      }),

      // Total merchants count (all merchants)
      prisma.user.count({
        where: {
          role: 'MERCHANT',
        },
      }),

      // Total warehouses count (all warehouses)
      prisma.warehouse.count(),
    ]);

    return NextResponse.json({
      totalShipments,
      activeDrivers,
      totalMerchants: merchantsCount, // Use total merchants count
      warehouses: warehousesCount, // Use total warehouses count
      revenue: revenueResult._sum.shippingCost || 0,
      pendingShipments,
      deliveredToday,
      returns,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}