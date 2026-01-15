// prisma/seed.ts
import { PrismaClient, UserRole, ShipmentStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in reverse order due to foreign key constraints)
  console.log('🧹 Clearing existing data...')
  await prisma.transaction.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.shipmentHistory.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.warehouse.deleteMany()
  await prisma.user.deleteMany()
  await prisma.systemSettings.deleteMany()

  // Create System Settings
  console.log('⚙️ Creating system settings...')
  const settings = [
    {
      key: 'SYSTEM_NAME',
      value: 'Logistics Management System',
      description: 'Name of the logistics system'
    },
    {
      key: 'DEFAULT_COMMISSION_RATE',
      value: '10',
      description: 'Default commission rate for merchants (%)'
    },
    {
      key: 'MIN_SHIPPING_COST',
      value: '50',
      description: 'Minimum shipping cost in EGP'
    },
    {
      key: 'MAX_WEIGHT_PER_SHIPMENT',
      value: '30',
      description: 'Maximum allowed weight per shipment (kg)'
    },
    {
      key: 'NOTIFICATION_ENABLED',
      value: 'true',
      description: 'Enable system notifications'
    }
  ]

  for (const setting of settings) {
    await prisma.systemSettings.create({
      data: setting
    })
  }

  // Create Admin User
  console.log('👑 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@logistics.com',
      password: hashedPassword,
      name: 'System Administrator',
      phone: '+201000000000',
      role: UserRole.ADMIN,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
    }
  })

  // Create Operations Users
  console.log('👥 Creating operations users...')
  const operationsUsers = []
  const operationsData = [
    {
      email: 'ops1@logistics.com',
      name: 'Operations Manager',
      phone: '+201011111111',
      avatar: 'https://ui-avatars.com/api/?name=Ops+Manager&background=10B981&color=fff'
    },
    {
      email: 'ops2@logistics.com',
      name: 'Operations Coordinator',
      phone: '+201022222222',
      avatar: 'https://ui-avatars.com/api/?name=Ops+Coord&background=3B82F6&color=fff'
    }
  ]

  for (const ops of operationsData) {
    const opsUser = await prisma.user.create({
      data: {
        ...ops,
        password: await bcrypt.hash('ops123', 10),
        role: UserRole.OPERATIONS,
        isActive: true
      }
    })
    operationsUsers.push(opsUser)
  }

  // Create Merchants
  console.log('🏪 Creating merchants...')
  const merchants = []
  const merchantData = [
    {
      email: 'techstore@example.com',
      name: 'Ahmed Mohamed',
      phone: '+201033333333',
      companyName: 'Tech Store Egypt',
      commissionRate: 8.5,
      avatar: 'https://ui-avatars.com/api/?name=Tech+Store&background=8B5CF6&color=fff'
    },
    {
      email: 'fashionhub@example.com',
      name: 'Mona Ali',
      phone: '+201044444444',
      companyName: 'Fashion Hub',
      commissionRate: 9.0,
      avatar: 'https://ui-avatars.com/api/?name=Fashion+Hub&background=EC4899&color=fff'
    },
    {
      email: 'bookworld@example.com',
      name: 'Omar Hassan',
      phone: '+201055555555',
      companyName: 'Book World',
      commissionRate: 7.5,
      avatar: 'https://ui-avatars.com/api/?name=Book+World&background=F59E0B&color=fff'
    }
  ]

  for (const merchant of merchantData) {
    const merchantUser = await prisma.user.create({
      data: {
        ...merchant,
        password: await bcrypt.hash('merchant123', 10),
        role: UserRole.MERCHANT,
        isActive: true
      }
    })
    merchants.push(merchantUser)
  }

  // Create Drivers
  console.log('🚚 Creating drivers...')
  const drivers = []
  const driverData = [
    {
      email: 'driver1@logistics.com',
      name: 'Mahmoud Samir',
      phone: '+201066666666',
      vehicleNumber: 'ABC-123',
      licenseNumber: 'DRV-001',
      currentLat: 30.0444,
      currentLng: 31.2357,
      isAvailable: true,
      avatar: 'https://ui-avatars.com/api/?name=Mahmoud+Samir&background=EF4444&color=fff'
    },
    {
      email: 'driver2@logistics.com',
      name: 'Hassan Ibrahim',
      phone: '+201077777777',
      vehicleNumber: 'DEF-456',
      licenseNumber: 'DRV-002',
      currentLat: 30.0275,
      currentLng: 31.2101,
      isAvailable: false,
      avatar: 'https://ui-avatars.com/api/?name=Hassan+Ibrahim&background=14B8A6&color=fff'
    },
    {
      email: 'driver3@logistics.com',
      name: 'Karim Adel',
      phone: '+201088888888',
      vehicleNumber: 'GHI-789',
      licenseNumber: 'DRV-003',
      currentLat: 30.0626,
      currentLng: 31.2497,
      isAvailable: true,
      avatar: 'https://ui-avatars.com/api/?name=Karim+Adel&background=F97316&color=fff'
    }
  ]

  for (const driver of driverData) {
    const driverUser = await prisma.user.create({
      data: {
        ...driver,
        password: await bcrypt.hash('driver123', 10),
        role: UserRole.DRIVER,
        isActive: true
      }
    })
    drivers.push(driverUser)
  }

  // Create Warehouses
  console.log('🏭 Creating warehouses...')
  const warehouses = []
  const warehouseData = [
    {
      name: 'Cairo Main Warehouse',
      code: 'CAI-001',
      address: 'Industrial Zone, Nasr City, Cairo',
      city: 'Cairo',
      latitude: 30.0626,
      longitude: 31.2497,
      capacity: 5000,
      currentLoad: 1250,
      isActive: true
    },
    {
      name: 'Giza Distribution Center',
      code: 'GIZ-001',
      address: '6th of October City, Giza',
      city: 'Giza',
      latitude: 30.0330,
      longitude: 31.0000,
      capacity: 3000,
      currentLoad: 800,
      isActive: true
    },
    {
      name: 'Alexandria Warehouse',
      code: 'ALX-001',
      address: 'Borg El Arab, Alexandria',
      city: 'Alexandria',
      latitude: 31.2001,
      longitude: 29.9187,
      capacity: 2000,
      currentLoad: 450,
      isActive: true
    }
  ]

  for (const warehouse of warehouseData) {
    const wh = await prisma.warehouse.create({
      data: warehouse
    })
    warehouses.push(wh)
  }

  // Helper function to generate random tracking number and barcode
  function generateTrackingNumber(): string {
    return 'LMS-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  function generateBarcode(): string {
    return 'BRC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()
  }

  // Helper functions for status checks
  function isInWarehouseOrLater(status: ShipmentStatus): boolean {
    return status === ShipmentStatus.IN_WAREHOUSE ||
           status === ShipmentStatus.WITH_DRIVER ||
           status === ShipmentStatus.DELIVERED ||
           status === ShipmentStatus.DELIVERY_FAILED
  }

  function isWithDriverOrLater(status: ShipmentStatus): boolean {
    return status === ShipmentStatus.WITH_DRIVER ||
           status === ShipmentStatus.DELIVERED ||
           status === ShipmentStatus.DELIVERY_FAILED
  }

  // Create Shipments with different statuses
  console.log('📦 Creating shipments...')
  const shipments = []
  const shipmentData = [
    // NEW shipments
    {
      customerName: 'Mohamed Ali',
      customerPhone: '+201012345678',
      customerAddress: '123 Street, Maadi',
      customerCity: 'Cairo',
      customerZone: 'Maadi',
      description: 'Laptop and accessories',
      weight: 2.5,
      dimensions: '40x30x20 cm',
      declaredValue: 25000,
      shippingCost: 75,
      codAmount: 0,
      status: ShipmentStatus.NEW,
      notes: 'Handle with care - fragile',
      merchantId: merchants[0].id,
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    },
    {
      customerName: 'Sarah Johnson',
      customerPhone: '+201098765432',
      customerAddress: '456 Avenue, Zamalek',
      customerCity: 'Cairo',
      customerZone: 'Zamalek',
      description: 'Winter clothes collection',
      weight: 8.0,
      dimensions: '60x40x30 cm',
      declaredValue: 5000,
      shippingCost: 120,
      codAmount: 1500,
      status: ShipmentStatus.NEW,
      merchantId: merchants[1].id,
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    },

    // IN_RECEIPT shipments
    {
      customerName: 'Ahmed Hassan',
      customerPhone: '+201011223344',
      customerAddress: '789 Road, Heliopolis',
      customerCity: 'Cairo',
      customerZone: 'Heliopolis',
      description: 'Books and stationery',
      weight: 5.0,
      dimensions: '50x40x30 cm',
      declaredValue: 3000,
      shippingCost: 90,
      codAmount: 500,
      status: ShipmentStatus.IN_RECEIPT,
      merchantId: merchants[2].id,
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    },

    // IN_WAREHOUSE shipments
    {
      customerName: 'Fatima Mahmoud',
      customerPhone: '+201055667788',
      customerAddress: '321 Blvd, Mohandessin',
      customerCity: 'Cairo',
      customerZone: 'Mohandessin',
      description: 'Electronics package',
      weight: 3.2,
      dimensions: '45x35x25 cm',
      declaredValue: 18000,
      shippingCost: 85,
      codAmount: 0,
      status: ShipmentStatus.IN_WAREHOUSE,
      warehouseId: warehouses[0].id,
      merchantId: merchants[0].id,
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    },

    // WITH_DRIVER shipments
    {
      customerName: 'John Smith',
      customerPhone: '+201099887766',
      customerAddress: '654 Circle, New Cairo',
      customerCity: 'Cairo',
      customerZone: 'New Cairo',
      description: 'Office furniture',
      weight: 15.0,
      dimensions: '120x80x60 cm',
      declaredValue: 8000,
      shippingCost: 200,
      codAmount: 2500,
      status: ShipmentStatus.WITH_DRIVER,
      driverId: drivers[0].id,
      merchantId: merchants[1].id,
      pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    },

    // DELIVERED shipments
    {
      customerName: 'Layla Mohamed',
      customerPhone: '+201033221100',
      customerAddress: '987 Square, Giza',
      customerCity: 'Giza',
      customerZone: 'Dokki',
      description: 'Mobile phones',
      weight: 1.8,
      dimensions: '30x25x15 cm',
      declaredValue: 35000,
      shippingCost: 65,
      codAmount: 0,
      status: ShipmentStatus.DELIVERED,
      driverId: drivers[1].id,
      merchantId: merchants[0].id,
      pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    },

    // DELIVERY_FAILED shipments
    {
      customerName: 'Omar Khaled',
      customerPhone: '+201044556677',
      customerAddress: '147 Road, Alexandria',
      customerCity: 'Alexandria',
      customerZone: 'Smouha',
      description: 'Gaming console',
      weight: 4.5,
      dimensions: '55x40x30 cm',
      declaredValue: 12000,
      shippingCost: 110,
      codAmount: 12000,
      status: ShipmentStatus.DELIVERY_FAILED,
      driverId: drivers[2].id,
      merchantId: merchants[2].id,
      notes: 'Customer not available - will try again tomorrow',
      pickupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      trackingNumber: generateTrackingNumber(),
      barcode: generateBarcode()
    }
  ]

  for (const shipment of shipmentData) {
    const createdShipment = await prisma.shipment.create({
      data: shipment
    })
    shipments.push(createdShipment)

    // Create status history for each shipment
    const statusHistory = []
    
    // Always start with NEW status
    statusHistory.push({
      status: ShipmentStatus.NEW,
      notes: 'Shipment created by merchant',
      location: shipment.customerCity,
      createdBy: shipment.merchantId,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    })

    // Add additional statuses based on current status
    if (shipment.status !== ShipmentStatus.NEW) {
      statusHistory.push({
        status: ShipmentStatus.IN_RECEIPT,
        notes: 'Shipment received at collection point',
        location: shipment.customerCity,
        createdBy: operationsUsers[0].id,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      })
    }

    if (isInWarehouseOrLater(shipment.status)) {
      statusHistory.push({
        status: ShipmentStatus.IN_WAREHOUSE,
        notes: 'Shipment arrived at warehouse',
        location: 'Warehouse',
        latitude: warehouses[0].latitude,
        longitude: warehouses[0].longitude,
        createdBy: operationsUsers[1].id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      })
    }

    if (isWithDriverOrLater(shipment.status)) {
      statusHistory.push({
        status: ShipmentStatus.WITH_DRIVER,
        notes: 'Assigned to driver for delivery',
        location: 'On route',
        createdBy: operationsUsers[0].id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      })
    }

    if (shipment.status === ShipmentStatus.DELIVERED) {
      statusHistory.push({
        status: ShipmentStatus.DELIVERED,
        notes: 'Successfully delivered to customer',
        location: shipment.customerAddress,
        createdBy: shipment.driverId,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      })
    } else if (shipment.status === ShipmentStatus.DELIVERY_FAILED) {
      statusHistory.push({
        status: ShipmentStatus.DELIVERY_FAILED,
        notes: shipment.notes || 'Delivery attempt failed',
        location: shipment.customerAddress,
        createdBy: shipment.driverId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      })
    }

    // Create status history records
    for (const history of statusHistory) {
      await prisma.shipmentHistory.create({
        data: {
          ...history,
          shipmentId: createdShipment.id
        }
      })
    }
  }

  // Create Transactions
  console.log('💰 Creating transactions...')
  
  // Create some transactions for each merchant
  for (const merchant of merchants) {
    // Merchant payments
    await prisma.transaction.createMany({
      data: [
        {
          userId: merchant.id,
          shipmentId: shipments[0].id,
          type: 'PAYMENT',
          amount: shipments[0].shippingCost,
          currency: 'EGP',
          status: PaymentStatus.PAID,
          description: 'Shipping cost payment',
          reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          paymentMethod: 'BANK_TRANSFER'
        },
        {
          userId: merchant.id,
          type: 'WITHDRAWAL',
          amount: 5000,
          currency: 'EGP',
          status: PaymentStatus.PENDING,
          description: 'Withdrawal request',
          reference: `WDL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          paymentMethod: 'CASH'
        }
      ]
    })
  }

  // Create transactions for drivers
  for (const driver of drivers) {
    await prisma.transaction.create({
      data: {
        userId: driver.id,
        shipmentId: shipments[4].id,
        type: 'COMMISSION',
        amount: shipments[4].shippingCost * 0.3, // 30% commission
        currency: 'EGP',
        status: PaymentStatus.PENDING,
        description: 'Delivery commission',
        reference: `COM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
      }
    })
  }

  // Create Notifications
  console.log('🔔 Creating notifications...')
  const notifications = [
    {
      userId: admin.id,
      title: 'System Update',
      titleAr: 'تحديث النظام',
      message: 'New features have been deployed to the system.',
      messageAr: 'تم نشر ميزات جديدة في النظام.',
      type: 'INFO',
      isRead: true,
      link: '/system-updates'
    },
    {
      userId: merchants[0].id,
      title: 'Shipment Created',
      titleAr: 'تم إنشاء الشحنة',
      message: `Your shipment ${shipments[0].trackingNumber} has been created successfully.`,
      messageAr: `تم إنشاء شحنتك ${shipments[0].trackingNumber} بنجاح.`,
      type: 'SUCCESS',
      isRead: false,
      link: `/shipments/${shipments[0].id}`
    },
    {
      userId: drivers[0].id,
      title: 'New Delivery Assignment',
      titleAr: 'تسليم جديد مخصص لك',
      message: 'You have been assigned a new delivery. Please check your route.',
      messageAr: 'تم تكليفك بتسليم جديد. يرجى التحقق من مسارك.',
      type: 'INFO',
      isRead: false,
      link: '/driver/deliveries'
    },
    {
      userId: operationsUsers[0].id,
      title: 'Warehouse Capacity Alert',
      titleAr: 'تنبيه سعة المستودع',
      message: 'Cairo warehouse is reaching 80% capacity.',
      messageAr: 'مستودع القاهرة يصل إلى 80٪ من السعة.',
      type: 'WARNING',
      isRead: false,
      link: '/warehouses'
    },
    {
      userId: merchants[1].id,
      title: 'Payment Failed',
      titleAr: 'فشل الدفع',
      message: 'Your recent payment transaction failed. Please try again.',
      messageAr: 'فشلت معاملة الدفع الأخيرة. يرجى المحاولة مرة أخرى.',
      type: 'ERROR',
      isRead: true,
      link: '/transactions'
    }
  ]

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created: 
    - ${await prisma.user.count()} users
    - ${await prisma.warehouse.count()} warehouses
    - ${await prisma.shipment.count()} shipments
    - ${await prisma.shipmentHistory.count()} shipment history records
    - ${await prisma.transaction.count()} transactions
    - ${await prisma.notification.count()} notifications
    - ${await prisma.systemSettings.count()} system settings`)

  // Print login credentials for demo
  console.log('\n🔐 Demo Login Credentials:')
  console.log('Admin: admin@logistics.com / admin123')
  console.log('Merchant: techstore@example.com / merchant123')
  console.log('Driver: driver1@logistics.com / driver123')
  console.log('Operations: ops1@logistics.com / ops123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })