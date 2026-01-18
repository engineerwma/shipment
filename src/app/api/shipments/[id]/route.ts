import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ShipmentStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            phone: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleNumber: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
            email: true,
            managerName: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { status, ...updateData } = data

    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        merchant: true,
        driver: true,
        warehouse: true,
      },
    })

    // If status changed, create history record
    if (status && status !== shipment.status) {
      await prisma.shipmentHistory.create({
        data: {
          shipmentId: params.id,
          status: status as ShipmentStatus,
          notes: data.statusNotes || 'Status updated',
        },
      })
    }

    return NextResponse.json(updatedShipment)
  } catch (error) {
    console.error('Error updating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to update shipment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if shipment exists
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Check if shipment can be deleted (only in NEW status)
    if (shipment.status !== 'NEW') {
      return NextResponse.json(
        { error: 'Only shipments with NEW status can be deleted' },
        { status: 400 }
      )
    }

    await prisma.shipment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Shipment deleted successfully' })
  } catch (error) {
    console.error('Error deleting shipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete shipment' },
      { status: 500 }
    )
  }
}