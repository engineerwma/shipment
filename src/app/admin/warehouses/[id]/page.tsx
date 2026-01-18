'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  BarChart3,
  Calendar,
  TrendingUp,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  PieChart,
  Box,
  Layers,
  Home,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

// Types
interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  managerName?: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentLoad: number;
  isActive: boolean;
  utilization: number;
  status: 'active' | 'inactive';
  statusColor: string;
  availableSpace: number;
  shipmentCount: number;
  createdAt: string;
  updatedAt: string;
  shipmentStats?: {
    total: number;
    inWarehouse: number;
    withDriver: number;
    delivered: number;
    pending: number;
  };
  recentShipments?: Array<{
    id: string;
    trackingNumber: string;
    customerName: string;
    customerCity: string;
    status: string;
    shippingCost: number;
    createdAt: string;
  }>;
}

// Translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      common: {
        back: 'Back',
        edit: 'Edit',
        loading: 'Loading...',
        active: 'Active',
        inactive: 'Inactive',
        viewAll: 'View All',
        createdAt: 'Created',
        updatedAt: 'Last Updated',
        status: 'Status',
        actions: 'Actions',
        yes: 'Yes',
        no: 'No',
        success: 'Success',
        error: 'Error',
      },
      warehouses: {
        warehouseDetails: 'Warehouse Details',
        contactInfo: 'Contact Information',
        locationInfo: 'Location Information',
        capacityInfo: 'Capacity Information',
        statistics: 'Statistics',
        recentShipments: 'Recent Shipments',
        shipmentStatistics: 'Shipment Statistics',
        totalShipments: 'Total Shipments',
        inWarehouse: 'In Warehouse',
        withDriver: 'With Driver',
        delivered: 'Delivered',
        pending: 'Pending',
        utilization: 'Utilization',
        availableSpace: 'Available Space',
        capacity: 'Capacity',
        currentLoad: 'Current Load',
        warehouseCode: 'Warehouse Code',
        address: 'Address',
        city: 'City',
        phone: 'Phone',
        email: 'Email',
        manager: 'Manager',
        coordinates: 'Coordinates',
        latLong: 'Lat/Long',
        statusActive: 'Active - Accepting shipments',
        statusInactive: 'Inactive - Not accepting shipments',
        highUtilization: 'High Utilization',
        moderateUtilization: 'Moderate Utilization',
        lowUtilization: 'Low Utilization',
        full: 'Full',
        almostFull: 'Almost Full',
        hasSpace: 'Has Space',
        empty: 'Empty',
        trackingNumber: 'Tracking #',
        customer: 'Customer',
        amount: 'Amount',
        date: 'Date',
        noShipments: 'No recent shipments',
        fetchError: 'Failed to load warehouse details',
        utilizationRate: 'Utilization Rate',
        shipmentCount: 'Shipment Count',
        totalValue: 'Total Value',
        lastUpdated: 'Last Updated',
        created: 'Created',
        shipments: 'Shipments',
        overview: 'Overview',
        details: 'Details',
        performance: 'Performance',
      },
      status: {
        NEW: 'New',
        IN_RECEIPT: 'In Receipt',
        IN_WAREHOUSE: 'In Warehouse',
        WITH_DRIVER: 'With Driver',
        DELIVERED: 'Delivered',
        DELIVERY_FAILED: 'Delivery Failed',
        RETURNED: 'Returned',
        PARTIAL_RETURNED: 'Partial Return',
      },
    },
    ar: {
      common: {
        back: 'رجوع',
        edit: 'تعديل',
        loading: 'جاري التحميل...',
        active: 'نشط',
        inactive: 'غير نشط',
        viewAll: 'عرض الكل',
        createdAt: 'تاريخ الإنشاء',
        updatedAt: 'آخر تحديث',
        status: 'الحالة',
        actions: 'الإجراءات',
        yes: 'نعم',
        no: 'لا',
        success: 'نجاح',
        error: 'خطأ',
      },
      warehouses: {
        warehouseDetails: 'تفاصيل المستودع',
        contactInfo: 'معلومات الاتصال',
        locationInfo: 'معلومات الموقع',
        capacityInfo: 'معلومات السعة',
        statistics: 'الإحصائيات',
        recentShipments: 'الشحنات الأخيرة',
        shipmentStatistics: 'إحصائيات الشحنات',
        totalShipments: 'إجمالي الشحنات',
        inWarehouse: 'في المستودع',
        withDriver: 'مع السائق',
        delivered: 'تم التسليم',
        pending: 'معلق',
        utilization: 'معدل الاستخدام',
        availableSpace: 'المساحة المتاحة',
        capacity: 'السعة',
        currentLoad: 'الحمل الحالي',
        warehouseCode: 'كود المستودع',
        address: 'العنوان',
        city: 'المدينة',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        manager: 'المدير',
        coordinates: 'الإحداثيات',
        latLong: 'خط العرض/الطول',
        statusActive: 'نشط - يقبل الشحنات',
        statusInactive: 'غير نشط - لا يقبل الشحنات',
        highUtilization: 'استخدام مرتفع',
        moderateUtilization: 'استخدام متوسط',
        lowUtilization: 'استخدام منخفض',
        full: 'ممتلئ',
        almostFull: 'شبه ممتلئ',
        hasSpace: 'يوجد مساحة',
        empty: 'فارغ',
        trackingNumber: 'رقم التتبع',
        customer: 'العميل',
        amount: 'المبلغ',
        date: 'التاريخ',
        noShipments: 'لا توجد شحنات حديثة',
        fetchError: 'فشل تحميل تفاصيل المستودع',
        utilizationRate: 'معدل الاستخدام',
        shipmentCount: 'عدد الشحنات',
        totalValue: 'القيمة الإجمالية',
        lastUpdated: 'آخر تحديث',
        created: 'تم الإنشاء',
        shipments: 'الشحنات',
        overview: 'نظرة عامة',
        details: 'التفاصيل',
        performance: 'الأداء',
      },
      status: {
        NEW: 'جديد',
        IN_RECEIPT: 'في الاستلام',
        IN_WAREHOUSE: 'في المستودع',
        WITH_DRIVER: 'مع السائق',
        DELIVERED: 'تم التسليم',
        DELIVERY_FAILED: 'فشل التسليم',
        RETURNED: 'مرتجع',
        PARTIAL_RETURNED: 'مرتجع جزئي',
      },
    },
  };
  
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

export default function WarehouseDetailsPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const params = useParams();
  const warehouseId = params.id as string;
  
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchWarehouse();
  }, [warehouseId]);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/warehouses/${warehouseId}`);
      
      if (!response.ok) {
        throw new Error(getTranslation(locale, 'warehouses.fetchError'));
      }

      const data = await response.json();
      setWarehouse(data.warehouse);
    } catch (error: any) {
      console.error('Error fetching warehouse:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string) => getTranslation(locale, key);

  // Get status translation
  const getStatusTranslation = (status: string) => {
    return getTranslation(locale, `status.${status}`) || status;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      IN_RECEIPT: 'bg-yellow-100 text-yellow-800',
      IN_WAREHOUSE: 'bg-purple-100 text-purple-800',
      WITH_DRIVER: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      DELIVERY_FAILED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-orange-100 text-orange-800',
      PARTIAL_RETURNED: 'bg-pink-100 text-pink-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get utilization info
  const getUtilizationInfo = (utilization: number) => {
    if (utilization >= 90) {
      return {
        label: t('warehouses.full'),
        color: 'bg-red-100 text-red-800',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        icon: AlertCircle,
        iconColor: 'text-red-600',
      };
    } else if (utilization >= 75) {
      return {
        label: t('warehouses.almostFull'),
        color: 'bg-yellow-100 text-yellow-800',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
      };
    } else if (utilization >= 50) {
      return {
        label: t('warehouses.hasSpace'),
        color: 'bg-green-100 text-green-800',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        icon: CheckCircle,
        iconColor: 'text-green-600',
      };
    } else {
      return {
        label: t('warehouses.empty'),
        color: 'bg-blue-100 text-blue-800',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        icon: Box,
        iconColor: 'text-blue-600',
      };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !warehouse) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/warehouses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{t('warehouses.warehouseDetails')}</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700">{error || t('warehouses.fetchError')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const utilInfo = getUtilizationInfo(warehouse.utilization);
  const UtilIcon = utilInfo.icon;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/warehouses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{warehouse.name}</h1>
              <p className="text-gray-600">
                {t('warehouses.warehouseCode')}: {warehouse.code}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.push(`/admin/warehouses/${warehouseId}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t('common.edit')}
          </button>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            warehouse.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {warehouse.status === 'active' ? t('common.active') : t('common.inactive')}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${utilInfo.color}`}>
            <UtilIcon className={`w-3 h-3 mr-1 ${utilInfo.iconColor}`} />
            {utilInfo.label}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <MapPin className="w-3 h-3 mr-1" />
            {warehouse.city}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Package className="w-3 h-3 mr-1" />
            {warehouse.shipmentCount} {t('warehouses.shipments')}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('warehouses.capacity')}</p>
                <p className="text-2xl font-bold mt-1">{warehouse.capacity.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('warehouses.utilization')}</p>
                <p className={`text-2xl font-bold mt-1 ${
                  warehouse.utilization >= 90 ? 'text-red-600' : 
                  warehouse.utilization >= 75 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {warehouse.utilization}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('warehouses.availableSpace')}</p>
                <p className="text-2xl font-bold mt-1">{warehouse.availableSpace.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-teal-100 rounded-lg">
                <Box className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('warehouses.shipmentCount')}</p>
                <p className="text-2xl font-bold mt-1">{warehouse.shipmentCount.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Statistics */}
        {warehouse.shipmentStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <p className="text-sm text-gray-600">{t('warehouses.totalShipments')}</p>
              <p className="text-2xl font-bold mt-1">{warehouse.shipmentStats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <p className="text-sm text-gray-600">{t('warehouses.inWarehouse')}</p>
              <p className="text-2xl font-bold mt-1 text-purple-600">{warehouse.shipmentStats.inWarehouse}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <p className="text-sm text-gray-600">{t('warehouses.withDriver')}</p>
              <p className="text-2xl font-bold mt-1 text-indigo-600">{warehouse.shipmentStats.withDriver}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <p className="text-sm text-gray-600">{t('warehouses.delivered')}</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{warehouse.shipmentStats.delivered}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <p className="text-sm text-gray-600">{t('warehouses.pending')}</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{warehouse.shipmentStats.pending}</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
                {t('warehouses.contactInfo')}
              </h2>
              <div className="space-y-4">
                {(warehouse.managerName || warehouse.phone || warehouse.email) ? (
                  <>
                    {warehouse.managerName && (
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('warehouses.manager')}</p>
                          <p className="font-medium">{warehouse.managerName}</p>
                        </div>
                      </div>
                    )}
                    {warehouse.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('warehouses.phone')}</p>
                          <p className="font-medium">{warehouse.phone}</p>
                        </div>
                      </div>
                    )}
                    {warehouse.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">{t('warehouses.email')}</p>
                          <p className="font-medium">{warehouse.email}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No contact information available
                  </p>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
                {t('warehouses.locationInfo')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('warehouses.address')}</p>
                    <p className="font-medium">{warehouse.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('warehouses.city')}</p>
                    <p className="font-medium">{warehouse.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('warehouses.coordinates')}</p>
                    <p className="font-medium font-mono">
                      {warehouse.latitude.toFixed(6)}, {warehouse.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
                {t('warehouses.capacityInfo')}
              </h2>
              <div className="space-y-6">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{t('warehouses.utilization')}</span>
                    <span className="font-medium">{warehouse.utilization}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        warehouse.utilization >= 90 ? 'bg-red-500' : 
                        warehouse.utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(warehouse.utilization, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Capacity details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('warehouses.capacity')}</p>
                    <p className="text-2xl font-bold mt-1">{warehouse.capacity.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('warehouses.currentLoad')}</p>
                    <p className="text-2xl font-bold mt-1">{warehouse.currentLoad.toLocaleString()}</p>
                  </div>
                </div>

                {/* Status message */}
                <div className={`p-4 rounded-lg ${utilInfo.bgColor}`}>
                  <div className="flex items-center gap-3">
                    <UtilIcon className={`w-5 h-5 ${utilInfo.iconColor}`} />
                    <div>
                      <p className={`font-medium ${utilInfo.textColor}`}>
                        {warehouse.utilization >= 90 
                          ? t('warehouses.highUtilization')
                          : warehouse.utilization >= 75
                          ? t('warehouses.moderateUtilization')
                          : t('warehouses.lowUtilization')
                        }
                      </p>
                      <p className={`text-sm ${utilInfo.textColor} mt-1`}>
                        {warehouse.utilization >= 90
                          ? 'Consider redistributing shipments or adding capacity'
                          : warehouse.utilization >= 75
                          ? 'Monitor closely, approaching capacity limits'
                          : 'Operating at optimal levels with available space'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Shipments & Info */}
          <div className="space-y-6">
            {/* Warehouse Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
                {t('warehouses.details')}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('warehouses.warehouseCode')}</p>
                  <p className="font-medium font-mono">{warehouse.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('common.status')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      warehouse.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {warehouse.status === 'active' ? t('common.active') : t('common.inactive')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {warehouse.status === 'active'
                        ? t('warehouses.statusActive')
                        : t('warehouses.statusInactive')
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('warehouses.created')}</p>
                  <p className="font-medium">{new Date(warehouse.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('warehouses.lastUpdated')}</p>
                  <p className="font-medium">{new Date(warehouse.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Recent Shipments */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  {t('warehouses.recentShipments')}
                </h2>
                <button 
                  onClick={() => router.push(`/admin/shipments?warehouse=${warehouse.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {t('common.viewAll')}
                </button>
              </div>
              
              {warehouse.recentShipments && warehouse.recentShipments.length > 0 ? (
                <div className="space-y-4">
                  {warehouse.recentShipments.slice(0, 5).map((shipment) => (
                    <div 
                      key={shipment.id} 
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {shipment.trackingNumber}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                          {getStatusTranslation(shipment.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {shipment.customerName}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>EGP {shipment.shippingCost}</span>
                        <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">{t('warehouses.noShipments')}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                {t('warehouses.performance')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/admin/shipments/create?warehouse=${warehouse.id}`)}
                  className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      Add Shipment
                    </span>
                  </div>
                  <span className="text-blue-400">+</span>
                </button>
                
                <button
                  onClick={() => router.push(`/admin/warehouses/${warehouseId}/edit`)}
                  className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      Edit Warehouse
                    </span>
                  </div>
                  <span className="text-blue-400">✏️</span>
                </button>
                
                <button
                  onClick={() => router.push(`/admin/reports?warehouse=${warehouse.id}`)}
                  className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      Generate Report
                    </span>
                  </div>
                  <span className="text-blue-400">📊</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}