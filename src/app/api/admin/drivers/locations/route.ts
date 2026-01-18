import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const drivers = await prisma.user.findMany({
      where: { 
        role: 'DRIVER',
        isActive: true,
        AND: [
          { currentLat: { not: null } },
          { currentLng: { not: null } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        vehicleNumber: true,
        isAvailable: true,
        currentLat: true,
        currentLng: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      drivers,
    });
  } catch (error) {
    console.error('Error fetching driver locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver locations' },
      { status: 500 }
    );
  }
}