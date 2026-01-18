export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
  isActive: boolean;
  isAvailable: boolean;
  currentLat?: number;
  currentLng?: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverWithStats extends Driver {
  statistics: {
    totalDeliveries: number;
    failedDeliveries: number;
    successRate: number;
    totalEarnings: number;
    rating: number;
  };
  recentShipments: Array<{
    id: string;
    trackingNumber: string;
    customerName: string;
    status: string;
    shippingCost: number;
    deliveryDate?: Date;
  }>;
}

export interface DriversResponse {
  drivers: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}