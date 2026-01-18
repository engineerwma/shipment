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
    const { isActive, isAvailable } = body;

    // Check if driver exists
    const existingDriver = await prisma.user.findUnique({
      where: { 
        id,
        role: 'DRIVER',
      },
    });

    if (!existingDriver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Update status
    const updatedDriver = await prisma.user.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        isAvailable: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Driver status updated successfully',
      driver: updatedDriver,
    });
  } catch (error) {
    console.error('Error updating driver status:', error);
    return NextResponse.json(
      { error: 'Failed to update driver status' },
      { status: 500 }
    );
  }
}