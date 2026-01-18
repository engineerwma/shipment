import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')
    const city = searchParams.get('city')

    const where: any = {}

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (city) {
      where.city = city
    }

    const warehouses = await prisma.warehouse.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        phone: true,
        email: true,
        managerName: true,
        capacity: true,
        currentLoad: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(warehouses)
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch warehouses' },
      { status: 500 }
    )
  }
}