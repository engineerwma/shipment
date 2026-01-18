'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  BarChart3,
  Clock,
  MapPin,
} from 'lucide-react';

type Locale = 'en' | 'ar';

export default function MerchantDashboardPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [stats, setStats] = useState({
    totalShipments: 0,
    delivered: 0,
    inTransit: 0,
    pending: 0,
    returns: 0,
    revenue: 0,
    pendingWithdrawal: 0,
  });
  const [recentShipments, setRecentShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now
      const mockStats = {
        totalShipments: 124,
        delivered: 98,
        inTransit: 18,
        pending: 8,
        returns: 5,
        revenue: 8500,
        pendingWithdrawal: 1200,
      };

      const mockRecentShipments = [
        {
          id: '1',
          trackingNumber: 'TRK0012345',
          customerName: 'Ahmed Mohamed',
          customerPhone: '+201000000001',
          customerCity: 'Cairo',
          status: 'DELIVERED',
          shippingCost: 150,
          codAmount: 500,
          createdAt: new Date(),
        },
        {
          id: '2',
          trackingNumber: 'TRK0012346',
          customerName: 'Sara Ali',
          customerPhone: '+201000000002',
          customerCity: 'Alexandria',
          status: 'WITH_DRIVER',
          shippingCost: 120,
          codAmount: 300,
          createdAt: new Date(),
        },
        {
          id: '3',
          trackingNumber: 'TRK0012347',
          customerName: 'Omar Hassan',
          customerPhone: '+201000000003',
          customerCity: 'Giza',
          status: 'IN_WAREHOUSE',
          shippingCost: 90,
          codAmount: 0,
          createdAt: new Date(),
        },
        {
          id: '4',
          trackingNumber: 'TRK0012348',
          customerName: 'Fatima Mahmoud',
          customerPhone: '+201000000004',
          customerCity: 'Cairo',
          status: 'NEW',
          shippingCost: 110,
          codAmount: 200,
          createdAt: new Date(),
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setStats(mockStats);
        setRecentShipments(mockRecentShipments);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: locale === 'en' ? 'Total Shipments' : 'إجمالي الشحنات',
      value: stats.totalShipments,
      change: '+8%',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: locale === 'en' ? 'In Transit' : 'قيد النقل',
      value: stats.inTransit,
      change: '+12%',
      icon: Truck,
      color: 'bg-indigo-500',
    },
    {
      title: locale === 'en' ? 'Delivered' : 'تم التسليم',
      value: stats.delivered,
      change: '+15%',
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: locale === 'en' ? 'Revenue' : 'الإيرادات',
      value: `EGP ${stats.revenue.toLocaleString()}`,
      change: '+18%',
      icon: DollarSign,
      color: 'bg-teal-500',
    },
    {
      title: locale === 'en' ? 'Pending' : 'المعلقة',
      value: stats.pending,
      change: '-5%',
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: locale === 'en' ? 'Returns' : 'المرتجعات',
      value: stats.returns,
      change: '+2%',
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
  ];

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Simple header */}
      <header className="sticky top-0 z-30 flex items-center h-16 bg-white border-b shadow-sm px-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold text-gray-800">
            Merchant Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              {locale === 'en' ? 'العربية' : 'English'}
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {locale === 'en'
                  ? 'Welcome back to your Dashboard!'
                  : 'مرحباً بعودتك إلى لوحة التحكم!'}
              </h1>
              <p className="opacity-90">
                {locale === 'en'
                  ? 'Track your shipments, manage orders, and view analytics.'
                  : 'تتبع شحناتك، إدارة الطلبات، وعرض التحليلات.'}
              </p>
            </div>
            <Link
              href="/merchant/shipments/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>
                {locale === 'en' ? 'New Shipment' : 'شحنة جديدة'}
              </span>
            </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent shipments */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {locale === 'en' ? 'Recent Shipments' : 'الشحنات الأخيرة'}
                  </h2>
                  <Link
                    href="/merchant/shipments"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {locale === 'en' ? 'View All' : 'عرض الكل'}
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-3">
                          {locale === 'en' ? 'Tracking #' : 'رقم التتبع'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Customer' : 'العميل'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Status' : 'الحالة'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Amount' : 'المبلغ'}
                        </th>
                        <th className="pb-3">
                          {locale === 'en' ? 'Actions' : 'إجراءات'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentShipments.map((shipment) => (
                        <tr key={shipment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div className="font-mono text-blue-600">
                              {shipment.trackingNumber}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">{shipment.customerName}</div>
                            <div className="text-sm text-gray-500">
                              {shipment.customerCity}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              shipment.status
                            )}`}>
                              {getStatusText(locale, shipment.status)}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">
                              EGP {shipment.shippingCost}
                            </div>
                            {shipment.codAmount > 0 && (
                              <div className="text-xs text-green-600">
                                COD: EGP {shipment.codAmount}
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/merchant/shipments/${shipment.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {locale === 'en' ? 'Track' : 'تتبع'}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                {/* Quick stats */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {locale === 'en' ? 'Quick Stats' : 'إحصائيات سريعة'}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {locale === 'en' ? 'Pending Withdrawal' : 'سحب معلق'}
                        </span>
                      </div>
                      <span className="font-bold text-green-600">
                        EGP {stats.pendingWithdrawal}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {locale === 'en' ? 'Success Rate' : 'معدل النجاح'}
                        </span>
                      </div>
                      <span className="font-bold text-green-600">94%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {locale === 'en' ? 'Avg. Delivery Time' : 'متوسط وقت التسليم'}
                        </span>
                      </div>
                      <span className="font-bold text-gray-800">2.3 days</span>
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {locale === 'en' ? 'Recent Activity' : 'النشاط الأخير'}
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        type: 'success',
                        text: locale === 'en'
                          ? 'Shipment #TRK12345 delivered successfully'
                          : 'تم تسليم الشحنة #TRK12345 بنجاح',
                        time: '10 min ago',
                      },
                      {
                        type: 'info',
                        text: locale === 'en'
                          ? 'New shipment created #TRK12346'
                          : 'تم إنشاء شحنة جديدة #TRK12346',
                        time: '1 hour ago',
                      },
                      {
                        type: 'warning',
                        text: locale === 'en'
                          ? 'Payment withdrawal requested'
                          : 'تم طلب سحب مبلغ',
                        time: '2 hours ago',
                      },
                      {
                        type: 'success',
                        text: locale === 'en'
                          ? '3 shipments picked up by driver'
                          : 'تم استلام 3 شحنات بواسطة السائق',
                        time: '5 hours ago',
                      },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'info' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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
function getStatusText(locale: Locale, status: string): string {
  const translations: Record<Locale, Record<string, string>> = {
    en: {
      NEW: 'New',
      IN_RECEIPT: 'In Receipt',
      IN_WAREHOUSE: 'In Warehouse',
      WITH_DRIVER: 'With Driver',
      DELIVERED: 'Delivered',
      DELIVERY_FAILED: 'Delivery Failed',
      RETURNED: 'Returned',
      PARTIAL_RETURNED: 'Partial Return',
    },
    ar: {
      NEW: 'جديد',
      IN_RECEIPT: 'في الاستلام',
      IN_WAREHOUSE: 'في المستودع',
      WITH_DRIVER: 'مع السائق',
      DELIVERED: 'تم التسليم',
      DELIVERY_FAILED: 'فشل التسليم',
      RETURNED: 'مرتجع',  // Fixed spelling
      PARTIAL_RETURNED: 'مرتجع جزئي',  // Fixed spelling
    },
  };
  
  // Use optional chaining and nullish coalescing
  return translations[locale]?.[status] ?? status;
}