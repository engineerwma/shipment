import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isActive, currentLoad } = body;

    // Check if warehouse exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // Validate current load doesn't exceed capacity
    if (currentLoad !== undefined && currentLoad > existingWarehouse.capacity) {
      return NextResponse.json(
        { error: 'Current load cannot exceed capacity' },
        { status: 400 }
      );
    }

    // Update status/load
    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(currentLoad !== undefined && { currentLoad }),
      },
      select: {
        id: true,
        name: true,
        code: true,
        isActive: true,
        currentLoad: true,
        capacity: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Warehouse updated successfully',
      warehouse: updatedWarehouse,
    });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to update warehouse' },
      { status: 500 }
    );
  }
}