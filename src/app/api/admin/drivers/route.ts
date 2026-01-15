import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, vehicleNumber, licenseNumber } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Driver with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create driver
    const driver = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'DRIVER',
        vehicleNumber,
        licenseNumber,
        isAvailable: true,
      },
    });

    // Remove password from response
    const { password: _, ...driverWithoutPassword } = driver;

    return NextResponse.json(
      { message: 'Driver created successfully', driver: driverWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where = {
      role: 'DRIVER',
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { vehicleNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [drivers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          vehicleNumber: true,
          licenseNumber: true,
          isAvailable: true,
          currentLat: true,
          currentLng: true,
          createdAt: true,
          _count: {
            select: {
              shipmentsDelivered: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      drivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}