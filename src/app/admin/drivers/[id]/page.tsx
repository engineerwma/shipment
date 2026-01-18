'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Truck,
  Mail,
  Phone,
  Car,
  FileText,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

// Types
interface Driver {
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
  createdAt: string;
  updatedAt: string;
  statistics?: {
    totalDeliveries: number;
    failedDeliveries: number;
    totalShipments: number;
    successRate: number;
    totalEarnings: number;
    rating: number;
  };
  shipmentsDelivered?: Array<{
    id: string;
    trackingNumber: string;
    customerName: string;
    status: string;
    shippingCost: number;
    deliveryDate?: string;
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
        available: 'Available',
        busy: 'Busy',
        viewAll: 'View All',
        createdAt: 'Created',
        updatedAt: 'Last Updated',
        driverId: 'Driver ID',
        location: 'Location',
        status: 'Status',
        actions: 'Actions',
      },
      drivers: {
        driverDetails: 'Driver Details',
        contactInfo: 'Contact Information',
        vehicleInfo: 'Vehicle Information',
        performance: 'Performance',
        recentDeliveries: 'Recent Deliveries',
        statistics: 'Statistics',
        totalDeliveries: 'Total Deliveries',
        successRate: 'Success Rate',
        rating: 'Rating',
        totalEarnings: 'Total Earnings',
        currentLocation: 'Current Location',
        notAvailable: 'Not Available',
        email: 'Email',
        phone: 'Phone',
        vehicleNumber: 'Vehicle Number',
        licenseNumber: 'License Number',
        joinedDate: 'Joined Date',
        lastActive: 'Last Active',
        trackingNumber: 'Tracking #',
        customer: 'Customer',
        amount: 'Amount',
        deliveryDate: 'Delivery Date',
        noDeliveries: 'No recent deliveries',
        fetchError: 'Failed to load driver details',
      },
    },
    ar: {
      common: {
        back: 'رجوع',
        edit: 'تعديل',
        loading: 'جاري التحميل...',
        active: 'نشط',
        inactive: 'غير نشط',
        available: 'متاح',
        busy: 'مشغول',
        viewAll: 'عرض الكل',
        createdAt: 'تاريخ الإنشاء',
        updatedAt: 'آخر تحديث',
        driverId: 'رقم السائق',
        location: 'الموقع',
        status: 'الحالة',
        actions: 'الإجراءات',
      },
      drivers: {
        driverDetails: 'تفاصيل السائق',
        contactInfo: 'معلومات الاتصال',
        vehicleInfo: 'معلومات المركبة',
        performance: 'الأداء',
        recentDeliveries: 'التسليمات الأخيرة',
        statistics: 'الإحصائيات',
        totalDeliveries: 'إجمالي التسليمات',
        successRate: 'معدل النجاح',
        rating: 'التقييم',
        totalEarnings: 'إجمالي الأرباح',
        currentLocation: 'الموقع الحالي',
        notAvailable: 'غير متاح',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        vehicleNumber: 'رقم المركبة',
        licenseNumber: 'رقم الرخصة',
        joinedDate: 'تاريخ الانضمام',
        lastActive: 'آخر نشاط',
        trackingNumber: 'رقم التتبع',
        customer: 'العميل',
        amount: 'المبلغ',
        deliveryDate: 'تاريخ التسليم',
        noDeliveries: 'لا توجد تسليمات حديثة',
        fetchError: 'فشل تحميل تفاصيل السائق',
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

export default function DriverDetailsPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const params = useParams();
  const driverId = params.id as string;
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchDriver();
  }, [driverId]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/drivers/${driverId}`);
      
      if (!response.ok) {
        throw new Error(getTranslation(locale, 'drivers.fetchError'));
      }

      const data = await response.json();
      setDriver(data.driver);
    } catch (error: any) {
      console.error('Error fetching driver:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string) => getTranslation(locale, key);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !driver) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/drivers')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{t('drivers.driverDetails')}</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700">{error || t('drivers.fetchError')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/drivers')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{driver.name}</h1>
              <p className="text-gray-600">
                {t('drivers.driverId')}: DRV-{driver.id.substring(0, 8)}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.push(`/admin/drivers/${driverId}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t('common.edit')}
          </button>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            driver.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {driver.isActive ? t('common.active') : t('common.inactive')}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            driver.isAvailable
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {driver.isAvailable ? t('common.available') : t('common.busy')}
          </span>
          {driver.currentLat && driver.currentLng && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <MapPin className="w-3 h-3 mr-1" />
              {t('common.location')}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        {driver.statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('drivers.totalDeliveries')}</p>
                  <p className="text-2xl font-bold mt-1">{driver.statistics.totalDeliveries}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('drivers.successRate')}</p>
                  <p className="text-2xl font-bold mt-1">{driver.statistics.successRate}%</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('drivers.rating')}</p>
                  <p className="text-2xl font-bold mt-1">{driver.statistics.rating.toFixed(1)}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('drivers.totalEarnings')}</p>
                  <p className="text-2xl font-bold mt-1">EGP {driver.statistics.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
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
                {t('drivers.contactInfo')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('drivers.email')}</p>
                    <p className="font-medium">{driver.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('drivers.phone')}</p>
                    <p className="font-medium">{driver.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('drivers.joinedDate')}</p>
                    <p className="font-medium">{new Date(driver.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('drivers.lastActive')}</p>
                    <p className="font-medium">{new Date(driver.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
                {t('drivers.vehicleInfo')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('drivers.vehicleNumber')}</p>
                    <p className="font-medium">{driver.vehicleNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('drivers.licenseNumber')}</p>
                    <p className="font-medium">{driver.licenseNumber}</p>
                  </div>
                </div>
                {driver.currentLat && driver.currentLng && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t('drivers.currentLocation')}</p>
                      <p className="font-medium">
                        {driver.currentLat.toFixed(6)}, {driver.currentLng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Deliveries */}
          <div className="space-y-6">
            {/* Recent Deliveries */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  {t('drivers.recentDeliveries')}
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  {t('common.viewAll')}
                </button>
              </div>
              
              {driver.shipmentsDelivered && driver.shipmentsDelivered.length > 0 ? (
                <div className="space-y-4">
                  {driver.shipmentsDelivered.map((shipment) => (
                    <div key={shipment.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {shipment.trackingNumber}
                        </span>
                        <span className="text-sm font-medium">
                          EGP {shipment.shippingCost}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {shipment.customerName}
                      </p>
                      {shipment.deliveryDate && (
                        <p className="text-xs text-gray-500">
                          {new Date(shipment.deliveryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">{t('drivers.noDeliveries')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}