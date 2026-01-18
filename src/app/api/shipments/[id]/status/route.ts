import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, notes, location, latitude, longitude } = await request.json()

    // Update shipment status
    const shipment = await prisma.shipment.update({
      where: { id: params.id },
      data: { 
        status: status as ShipmentStatus,
        ...(status === 'DELIVERED' && { deliveryDate: new Date() }),
        ...(status === 'WITH_DRIVER' && { pickupDate: new Date() }),
      },
    })

    // Create status history
    const statusHistory = await prisma.shipmentHistory.create({
      data: {
        shipmentId: params.id,
        status: status as ShipmentStatus,
        notes,
        location,
        latitude,
        longitude,
      },
    })

    // Create notification for merchant
    await prisma.notification.create({
      data: {
        userId: shipment.merchantId,
        title: 'Shipment Status Updated',
        message: `Your shipment ${shipment.trackingNumber} status changed to ${status}`,
        type: 'INFO',
        link: `/merchant/shipments/${shipment.id}`,
      },
    })

    return NextResponse.json({ shipment, statusHistory })
  } catch (error) {
    console.error('Error updating shipment status:', error)
    return NextResponse.json(
      { error: 'Failed to update shipment status' },
      { status: 500 }
    )
  }
}