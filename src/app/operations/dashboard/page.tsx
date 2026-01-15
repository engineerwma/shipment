'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Warehouse,
  Truck,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  Filter,
} from 'lucide-react';

type Locale = 'en' | 'ar';

export default function OperationsDashboardPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [stats, setStats] = useState({
    inWarehouse: 0,
    toDispatch: 0,
    dispatchedToday: 0,
    activeDrivers: 0,
    warehouseCapacity: 0,
    alerts: 0,
  });
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [shipmentsToDispatch, setShipmentsToDispatch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now
      const mockStats = {
        inWarehouse: 42,
        toDispatch: 18,
        dispatchedToday: 24,
        activeDrivers: 8,
        warehouseCapacity: 65,
        alerts: 3,
      };

      const mockWarehouses = [
        {
          id: '1',
          name: 'Main Warehouse',
          code: 'WH-001',
          city: 'Cairo',
          address: 'Industrial Zone, Cairo',
          currentLoad: 850,
          capacity: 1000,
          isActive: true,
          shipmentsCount: 125,
        },
        {
          id: '2',
          name: 'Alexandria Warehouse',
          code: 'WH-002',
          city: 'Alexandria',
          address: 'Port Area, Alexandria',
          currentLoad: 650,
          capacity: 800,
          isActive: true,
          shipmentsCount: 89,
        },
        {
          id: '3',
          name: 'Giza Warehouse',
          code: 'WH-003',
          city: 'Giza',
          address: 'Giza Industrial Area',
          currentLoad: 420,
          capacity: 600,
          isActive: true,
          shipmentsCount: 56,
        },
      ];

      const mockShipmentsToDispatch = [
        {
          id: '1',
          trackingNumber: 'TRK0012345',
          customerAddress: '123 Main St, Cairo',
          customerCity: 'Cairo',
          shippingCost: 150,
        },
        {
          id: '2',
          trackingNumber: 'TRK0012346',
          customerAddress: '456 Nile St, Giza',
          customerCity: 'Giza',
          shippingCost: 120,
        },
        {
          id: '3',
          trackingNumber: 'TRK0012347',
          customerAddress: '789 Corniche, Alexandria',
          customerCity: 'Alexandria',
          shippingCost: 90,
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setStats(mockStats);
        setWarehouses(mockWarehouses);
        setShipmentsToDispatch(mockShipmentsToDispatch);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: locale === 'en' ? 'In Warehouse' : 'في المستودع',
      value: stats.inWarehouse,
      icon: Warehouse,
      color: 'bg-purple-500',
      change: '+12',
    },
    {
      title: locale === 'en' ? 'To Dispatch' : 'للتوزيع',
      value: stats.toDispatch,
      icon: Truck,
      color: 'bg-indigo-500',
      change: '+5',
    },
    {
      title: locale === 'en' ? 'Dispatched Today' : 'تم التوزيع اليوم',
      value: stats.dispatchedToday,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8',
    },
    {
      title: locale === 'en' ? 'Active Drivers' : 'سائقون نشطون',
      value: stats.activeDrivers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2',
    },
    {
      title: locale === 'en' ? 'Warehouse Capacity' : 'سعة المستودع',
      value: `${stats.warehouseCapacity}%`,
      icon: BarChart3,
      color: 'bg-teal-500',
      change: '-3%',
    },
    {
      title: locale === 'en' ? 'Alerts' : 'تنبيهات',
      value: stats.alerts,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '+1',
    },
  ];

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Simple header */}
      <header className="sticky top-0 z-30 flex items-center h-16 bg-white border-b shadow-sm px-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold text-gray-800">
            Operations Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              {locale === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {locale === 'en' ? 'Operations Control Center' : 'مركز تحكم العمليات'}
            </h1>
            <p className="opacity-90">
              {locale === 'en'
                ? 'Monitor warehouse operations and manage dispatch activities.'
                : 'مراقبة عمليات المستودع وإدارة أنشطة التوزيع.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="spinner mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {locale === 'en' ? 'Loading dashboard...' : 'جاري تحميل لوحة التحكم...'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-4 border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Warehouses status */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {locale === 'en' ? 'Warehouses Status' : 'حالة المستودعات'}
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    {locale === 'en' ? 'View All' : 'عرض الكل'}
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-3">
                          {locale === 'en' ? 'Warehouse' : 'المستودع'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Location' : 'الموقع'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Capacity' : 'السعة'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Shipments' : 'الشحنات'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Status' : 'الحالة'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {warehouses.map((warehouse) => (
                        <tr key={warehouse.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div className="font-medium">{warehouse.name}</div>
                            <div className="text-sm text-gray-500">
                              {warehouse.code}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">{warehouse.city}</div>
                            <div className="text-xs text-gray-500">
                              {warehouse.address}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  warehouse.currentLoad / warehouse.capacity > 0.8
                                    ? 'bg-red-500'
                                    : warehouse.currentLoad / warehouse.capacity > 0.6
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{
                                  width: `${(warehouse.currentLoad / warehouse.capacity) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {warehouse.currentLoad}/{warehouse.capacity}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">{warehouse.shipmentsCount}</div>
                          </td>
                          <td className="py-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              warehouse.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {warehouse.isActive
                                ? locale === 'en' ? 'Active' : 'نشط'
                                : locale === 'en' ? 'Inactive' : 'غير نشط'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dispatch panel */}
              <div className="space-y-6">
                {/* Quick dispatch */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {locale === 'en' ? 'Quick Dispatch' : 'توزيع سريع'}
                  </h2>
                  <div className="space-y-4">
                    {shipmentsToDispatch.slice(0, 3).map((shipment) => (
                      <div key={shipment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-mono text-sm text-blue-600">
                              {shipment.trackingNumber}
                            </div>
                            <div className="text-xs text-gray-600">
                              {shipment.customerCity}
                            </div>
                          </div>
                          <div className="text-xs font-medium">
                            EGP {shipment.shippingCost}
                          </div>
                        </div>
                        <div className="text-sm mb-3">
                          {shipment.customerAddress.substring(0, 50)}...
                        </div>
                        <select
                          className="input input-sm w-full mb-2"
                          defaultValue=""
                        >
                          <option value="">
                            {locale === 'en' ? 'Select Driver' : 'اختر السائق'}
                          </option>
                          <option value="driver1">Mohamed Ahmed</option>
                          <option value="driver2">Ali Hassan</option>
                          <option value="driver3">Omar Mahmoud</option>
                        </select>
                        <button className="btn btn-primary btn-sm w-full">
                          {locale === 'en' ? 'Dispatch' : 'توزيع'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operations alerts */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {locale === 'en' ? 'Operations Alerts' : 'تنبيهات العمليات'}
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        type: 'warning',
                        text: locale === 'en'
                          ? 'Warehouse 3 at 85% capacity'
                          : 'المستودع 3 عند 85% من السعة',
                        time: '30 min ago',
                      },
                      {
                        type: 'info',
                        text: locale === 'en'
                          ? '20 shipments received from Merchant X'
                          : '20 شحنة استلمت من التاجر X',
                        time: '1 hour ago',
                      },
                      {
                        type: 'success',
                        text: locale === 'en'
                          ? 'Dispatch batch completed successfully'
                          : 'تم إكمال مجموعة التوزيع بنجاح',
                        time: '2 hours ago',
                      },
                      {
                        type: 'warning',
                        text: locale === 'en'
                          ? 'Driver XYZ delayed at location'
                          : 'السائق XYZ متأخر في الموقع',
                        time: '3 hours ago',
                      },
                    ].map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          alert.type === 'success' ? 'text-green-500' :
                          alert.type === 'info' ? 'text-blue-500' :
                          'text-yellow-500'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{alert.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Today's overview */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {locale === 'en' ? "Today's Overview" : 'نظرة عامة على اليوم'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Shipments Received' : 'شحنات مستلمة'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">142</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Shipments Processed' : 'شحنات معالجة'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">128</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Shipments Dispatched' : 'شحنات موزعة'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">14</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Pending Actions' : 'إجراءات معلقة'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}