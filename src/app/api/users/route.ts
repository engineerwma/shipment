import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const isAvailable = searchParams.get('isAvailable')

    const where: any = {
      isActive: true,
    }

    if (role) {
      where.role = role
    }

    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true'
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyName: true,
        vehicleNumber: true,
        isAvailable: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}