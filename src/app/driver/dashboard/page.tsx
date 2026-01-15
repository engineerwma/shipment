'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Navigation,
  DollarSign,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Truck,
  Battery,
} from 'lucide-react';
import { useTranslation, type Locale } from '@/lib/i18n';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function DriverDashboardPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [stats, setStats] = useState({
    todaysShipments: 0,
    deliveredToday: 0,
    pendingDelivery: 0,
    earningsToday: 0,
    totalEarnings: 0,
    rating: 4.8,
  });
  const [currentShipments, setCurrentShipments] = useState([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  const { t, isRTL } = useTranslation(locale);

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/driver/dashboard');
      const data = await response.json();
      setStats(data.stats);
      setCurrentShipments(data.currentShipments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleStatusUpdate = async (shipmentId: string, status: string) => {
    try {
      await fetch(`/api/driver/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await fetch('/api/driver/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      setIsOnline(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statCards = [
    {
      title: locale === 'en' ? "Today's Shipments" : 'شحنات اليوم',
      value: stats.todaysShipments,
      icon: Package,
      color: 'bg-blue-500',
      change: '+2',
    },
    {
      title: locale === 'en' ? 'Delivered Today' : 'تم التسليم اليوم',
      value: stats.deliveredToday,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+3',
    },
    {
      title: locale === 'en' ? 'Pending Delivery' : 'قيد التسليم',
      value: stats.pendingDelivery,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-1',
    },
    {
      title: locale === 'en' ? "Today's Earnings" : 'أرباح اليوم',
      value: `EGP ${stats.earningsToday}`,
      icon: DollarSign,
      color: 'bg-teal-500',
      change: '+15%',
    },
  ];

  return (
    <DashboardLayout
      role="DRIVER"
      locale={locale}
      onLocaleChange={setLocale}
    >
      <div className="space-y-6">
        {/* Header with status */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {locale === 'en' ? 'Driver Dashboard' : 'لوحة تحكم السائق'}
              </h1>
              <p className="opacity-90">
                {currentLocation
                  ? `${locale === 'en' ? 'Location' : 'الموقع'}: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                  : locale === 'en'
                  ? 'Getting location...'
                  : 'جاري تحديد الموقع...'}
              </p>
            </div>
            <button
              onClick={toggleOnlineStatus}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                isOnline
                  ? 'bg-white text-orange-600 hover:bg-orange-50'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {isOnline
                ? locale === 'en'
                  ? 'Online - Tap to Go Offline'
                  : 'متصل - اضغط للانتقال للوضع غير المتصل'
                : locale === 'en'
                ? 'Offline - Tap to Go Online'
                : 'غير متصل - اضغط للانتقال للوضع المتصل'}
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Current shipments and map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current shipments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {locale === 'en' ? 'Current Shipments' : 'الشحنات الحالية'}
              </h2>
              <span className="text-sm text-gray-500">
                {locale === 'en' ? 'Updated just now' : 'تم التحديث الآن'}
              </span>
            </div>
            
            <div className="space-y-4">
              {currentShipments.map((shipment: any) => (
                <div
                  key={shipment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono font-medium text-blue-600">
                        {shipment.trackingNumber}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {shipment.customerName} • {shipment.customerPhone}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      shipment.status
                    )}`}>
                      {t(`status.${shipment.status}`)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-gray-500">
                        {locale === 'en' ? 'Address' : 'العنوان'}
                      </div>
                      <div className="font-medium">{shipment.customerAddress}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">
                        {locale === 'en' ? 'Amount' : 'المبلغ'}
                      </div>
                      <div className="font-medium">
                        EGP {shipment.shippingCost}
                        {shipment.codAmount > 0 && (
                          <span className="text-green-600 ml-2">
                            (COD: EGP {shipment.codAmount})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(shipment.id, 'DELIVERED')}
                      className="flex-1 btn btn-success py-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Mark Delivered' : 'تسليم'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(shipment.id, 'DELIVERY_FAILED')}
                      className="flex-1 btn btn-danger py-2 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Failed' : 'فشل'}
                    </button>
                    <button
                      onClick={() => window.open(`https://maps.google.com/?q=${shipment.customerAddress}`)}
                      className="flex-1 btn btn-secondary py-2 text-sm"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Navigate' : 'التوجيه'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Map preview */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {locale === 'en' ? 'Route Map' : 'خريطة المسار'}
              </h2>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {locale === 'en' ? 'Map integration' : 'تكامل الخريطة'}
                  </p>
                  <button className="mt-2 text-blue-600 text-sm font-medium">
                    {locale === 'en' ? 'Open Full Map' : 'فتح الخريطة كاملة'}
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle info */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {locale === 'en' ? 'Vehicle Info' : 'معلومات المركبة'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {locale === 'en' ? 'Vehicle Number' : 'رقم المركبة'}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">ABC-1234</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Battery className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {locale === 'en' ? 'Fuel Level' : 'مستوى الوقود'}
                    </span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {locale === 'en' ? 'Total Earnings' : 'إجمالي الأرباح'}
                    </span>
                  </div>
                  <span className="font-bold text-green-600">
                    EGP {stats.totalEarnings}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {locale === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-blue-600 font-medium text-sm">
                    {locale === 'en' ? 'Scan Barcode' : 'مسح الباركود'}
                  </div>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-green-600 font-medium text-sm">
                    {locale === 'en' ? 'Collect Payment' : 'تحصيل المدفوعات'}
                  </div>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-purple-600 font-medium text-sm">
                    {locale === 'en' ? 'Call Customer' : 'اتصال بالعميل'}
                  </div>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-orange-600 font-medium text-sm">
                    {locale === 'en' ? 'Report Issue' : 'الإبلاغ عن مشكلة'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function getStatusColor(status: string): string {
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
}