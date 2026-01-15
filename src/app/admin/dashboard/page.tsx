'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  Users,
  Building,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  MapPin,
  Plus,
  FileText,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '../../../app/contexts/LocaleContext';

// Simple translation function for dashboard
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      shipments: 'Shipments',
      drivers: 'Drivers',
      merchants: 'Merchants',
      warehouses: 'Warehouses',
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
      dashboard: {
        welcome: 'Welcome back, Admin!',
        welcomeMessage: 'Here\'s what\'s happening with your logistics system today.',
        recentShipments: 'Recent Shipments',
        viewAll: 'View All',
        trackingNumber: 'Tracking #',
        customer: 'Customer',
        status: 'Status',
        amount: 'Amount',
        quickActions: 'Quick Actions',
        createShipment: 'Create Shipment',
        addDriver: 'Add Driver',
        generateReport: 'Generate Report',
        systemAlerts: 'System Alerts',
        shipmentsDelayed: '3 shipments delayed',
        checkDispatch: 'Check dispatch schedule',
        warehouseCapacity: 'Warehouse 85% capacity',
        considerRedistribution: 'Consider redistribution',
        revenue: 'Revenue',
        pending: 'Pending',
        deliveredToday: 'Delivered Today',
        returns: 'Returns',
      },
    },
    ar: {
      shipments: 'الشحنات',
      drivers: 'السائقين',
      merchants: 'التجار',
      warehouses: 'المستودعات',
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
      dashboard: {
        welcome: 'مرحباً بعودتك، المشرف!',
        welcomeMessage: 'هذا ما يحدث في نظام الشحن الخاص بك اليوم.',
        recentShipments: 'الشحنات الأخيرة',
        viewAll: 'عرض الكل',
        trackingNumber: 'رقم التتبع',
        customer: 'العميل',
        status: 'الحالة',
        amount: 'المبلغ',
        quickActions: 'إجراءات سريعة',
        createShipment: 'إنشاء شحنة',
        addDriver: 'إضافة مندوب',
        generateReport: 'إنشاء تقرير',
        systemAlerts: 'تنبيهات النظام',
        shipmentsDelayed: '3 شحنات متأخرة',
        checkDispatch: 'تحقق من جدول التوزيع',
        warehouseCapacity: 'المستودع 85% من السعة',
        considerRedistribution: 'فكر في إعادة التوزيع',
        revenue: 'الإيرادات',
        pending: 'معلق',
        deliveredToday: 'تم التسليم اليوم',
        returns: 'المرتجعات',
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

export default function AdminDashboardPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeDrivers: 0,
    totalMerchants: 0,
    warehouses: 0,
    revenue: 0,
    pendingShipments: 0,
    deliveredToday: 0,
    returns: 0,
  });
  const [recentShipments, setRecentShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from API
      const [statsRes, shipmentsRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/dashboard/recent-shipments'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        // Fallback to mock data if API fails
        const mockStats = {
          totalShipments: 156,
          activeDrivers: 8,
          totalMerchants: 24,
          warehouses: 3,
          revenue: 12500,
          pendingShipments: 42,
          deliveredToday: 38,
          returns: 12,
        };
        setStats(mockStats);
      }

      if (shipmentsRes.ok) {
        const shipmentsData = await shipmentsRes.json();
        setRecentShipments(shipmentsData.shipments || []);
      } else {
        // Fallback to mock data if API fails
        const mockShipments = [
          {
            id: '1',
            trackingNumber: 'TRK0012345',
            customerName: 'Ahmed Mohamed',
            customerCity: 'Cairo',
            status: 'DELIVERED',
            shippingCost: 150,
          },
          {
            id: '2',
            trackingNumber: 'TRK0012346',
            customerName: 'Sara Ali',
            customerCity: 'Alexandria',
            status: 'WITH_DRIVER',
            shippingCost: 120,
          },
          {
            id: '3',
            trackingNumber: 'TRK0012347',
            customerName: 'Omar Hassan',
            customerCity: 'Giza',
            status: 'IN_WAREHOUSE',
            shippingCost: 90,
          },
          {
            id: '4',
            trackingNumber: 'TRK0012348',
            customerName: 'Fatima Mahmoud',
            customerCity: 'Cairo',
            status: 'NEW',
            shippingCost: 110,
          },
          {
            id: '5',
            trackingNumber: 'TRK0012349',
            customerName: 'Khalid Ahmed',
            customerCity: 'Alexandria',
            status: 'DELIVERED',
            shippingCost: 85,
          },
        ];
        setRecentShipments(mockShipments);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data on error
      const mockStats = {
        totalShipments: 156,
        activeDrivers: 8,
        totalMerchants: 24,
        warehouses: 3,
        revenue: 12500,
        pendingShipments: 42,
        deliveredToday: 38,
        returns: 12,
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = () => {
    router.push('/admin/shipments/create');
  };

  const handleAddDriver = () => {
    router.push('/admin/drivers/create');
  };

  const handleGenerateReport = () => {
    router.push('/admin/reports');
  };

  const handleViewAllShipments = () => {
    router.push('/admin/shipments');
  };

  const statCards = [
    {
      title: getTranslation(locale, 'shipments'),
      value: stats.totalShipments,
      change: '+12%',
      icon: Package,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => router.push('/admin/shipments'),
    },
    {
      title: getTranslation(locale, 'drivers'),
      value: stats.activeDrivers,
      change: '+5%',
      icon: Truck,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => router.push('/admin/drivers'),
    },
    {
      title: getTranslation(locale, 'merchants'),
      value: stats.totalMerchants,
      change: '+8%',
      icon: Users,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => router.push('/admin/merchants'),
    },
    {
      title: getTranslation(locale, 'warehouses'),
      value: stats.warehouses,
      change: '+2%',
      icon: Building,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => router.push('/admin/warehouses'),
    },
    {
      title: getTranslation(locale, 'dashboard.revenue'),
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+15%',
      icon: DollarSign,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
      onClick: () => router.push('/admin/finance'),
    },
    {
      title: getTranslation(locale, 'dashboard.pending'),
      value: stats.pendingShipments,
      change: '-3%',
      icon: Clock,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      onClick: () => router.push('/admin/shipments?status=PENDING'),
    },
  ];

  const additionalStats = [
    {
      title: getTranslation(locale, 'dashboard.deliveredToday'),
      value: stats.deliveredToday,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: getTranslation(locale, 'dashboard.returns'),
      value: stats.returns,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const statusIcons: Record<string, any> = {
    DELIVERED: CheckCircle,
    WITH_DRIVER: Truck,
    IN_WAREHOUSE: Building,
    NEW: Package,
    DELIVERY_FAILED: AlertCircle,
    IN_RECEIPT: Clock,
    RETURNED: AlertCircle,
    PARTIAL_RETURNED: AlertCircle,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            {getTranslation(locale, 'dashboard.welcome')}
          </h1>
          <p className="opacity-90">
            {getTranslation(locale, 'dashboard.welcomeMessage')}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.slice(0, 4).map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow cursor-pointer"
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} ${stat.hoverColor} transition-colors`}>
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

        {/* Additional stats and revenue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.slice(4).map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow cursor-pointer"
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} ${stat.hoverColor} transition-colors`}>
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
          
          {/* Additional stats */}
          {additionalStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent shipments and quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent shipments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {getTranslation(locale, 'dashboard.recentShipments')}
              </h2>
              <button 
                onClick={handleViewAllShipments}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                {getTranslation(locale, 'dashboard.viewAll')}
                <span className="text-lg">→</span>
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading shipments...</p>
              </div>
            ) : recentShipments.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No shipments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3 px-2">
                        {getTranslation(locale, 'dashboard.trackingNumber')}
                      </th>
                      <th className="pb-3 px-2">
                        {getTranslation(locale, 'dashboard.customer')}
                      </th>
                      <th className="pb-3 px-2">
                        {getTranslation(locale, 'dashboard.status')}
                      </th>
                      <th className="pb-3 px-2">
                        {getTranslation(locale, 'dashboard.amount')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShipments.map((shipment) => {
                      const StatusIcon = statusIcons[shipment.status] || Package;
                      return (
                        <tr 
                          key={shipment.id} 
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
                        >
                          <td className="py-3 px-2">
                            <div className="font-medium text-gray-800">
                              {shipment.trackingNumber}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="text-sm">{shipment.customerName}</div>
                            <div className="text-xs text-gray-500">
                              {shipment.customerCity}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              {getTranslation(locale, `status.${shipment.status}`)}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-medium">
                              EGP {shipment.shippingCost}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick actions and alerts */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {getTranslation(locale, 'dashboard.quickActions')}
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={handleCreateShipment}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {getTranslation(locale, 'dashboard.createShipment')}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
                
                <button 
                  onClick={handleAddDriver}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {getTranslation(locale, 'dashboard.addDriver')}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
                
                <button 
                  onClick={handleGenerateReport}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {getTranslation(locale, 'dashboard.generateReport')}
                    </span>
                  </div>
                  <span className="text-gray-400">📊</span>
                </button>
              </div>
            </div>

            {/* System alerts */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {getTranslation(locale, 'dashboard.systemAlerts')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">
                      {getTranslation(locale, 'dashboard.shipmentsDelayed')}
                    </p>
                    <p className="text-yellow-700 mt-1">
                      {getTranslation(locale, 'dashboard.checkDispatch')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">
                      {getTranslation(locale, 'dashboard.warehouseCapacity')}
                    </p>
                    <p className="text-blue-700 mt-1">
                      {getTranslation(locale, 'dashboard.considerRedistribution')}
                    </p>
                  </div>
                </div>
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