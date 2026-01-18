import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const merchantId = searchParams.get('merchantId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'ALL') {
      where.status = status as ShipmentStatus
    }

    if (merchantId) {
      where.merchantId = merchantId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Get shipments with relations
    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              companyName: true,
              email: true,
            },
          },
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.shipment.count({ where }),
    ])

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate tracking number
    const trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`
    const barcode = `BAR${Date.now()}${Math.floor(Math.random() * 1000)}`

    const shipment = await prisma.shipment.create({
      data: {
        ...data,
        trackingNumber,
        barcode,
      },
      include: {
        merchant: true,
        driver: true,
      },
    })

    // Create initial status history
    await prisma.shipmentHistory.create({
      data: {
        shipmentId: shipment.id,
        status: shipment.status,
        notes: 'Shipment created',
      },
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    )
  }
}