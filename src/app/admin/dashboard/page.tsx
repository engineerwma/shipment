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
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Warehouse,
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
        shipmentsDelayed: 'Shipments Delayed',
        checkDispatch: 'Check dispatch schedule',
        warehouseCapacity: 'Warehouse Capacity',
        considerRedistribution: 'Consider redistribution',
        revenue: 'Revenue',
        pending: 'Pending',
        deliveredToday: 'Delivered Today',
        returns: 'Returns',
        totalShipments: 'Total Shipments',
        activeDrivers: 'Active Drivers',
        totalMerchants: 'Total Merchants',
        activeWarehouses: 'Active Warehouses',
        refresh: 'Refresh',
        loading: 'Loading...',
        noData: 'No data available',
        warehouseAlerts: 'Warehouse Alerts',
        driverAlerts: 'Driver Alerts',
        highUtilization: 'High Utilization',
        unavailableDrivers: 'Unavailable Drivers',
        viewDetails: 'View Details',
        today: 'Today',
        thisMonth: 'This Month',
        lastUpdated: 'Last updated',
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
        shipmentsDelayed: 'شحنات متأخرة',
        checkDispatch: 'تحقق من جدول التوزيع',
        warehouseCapacity: 'سعة المستودع',
        considerRedistribution: 'فكر في إعادة التوزيع',
        revenue: 'الإيرادات',
        pending: 'معلق',
        deliveredToday: 'تم التسليم اليوم',
        returns: 'المرتجعات',
        totalShipments: 'إجمالي الشحنات',
        activeDrivers: 'السائقين النشطين',
        totalMerchants: 'إجمالي التجار',
        activeWarehouses: 'المستودعات النشطة',
        refresh: 'تحديث',
        loading: 'جاري التحميل...',
        noData: 'لا توجد بيانات',
        warehouseAlerts: 'تنبيهات المستودعات',
        driverAlerts: 'تنبيهات السائقين',
        highUtilization: 'استخدام مرتفع',
        unavailableDrivers: 'سائقين غير متاحين',
        viewDetails: 'عرض التفاصيل',
        today: 'اليوم',
        thisMonth: 'هذا الشهر',
        lastUpdated: 'آخر تحديث',
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

// Types for our data
interface DashboardStats {
  totalShipments: number;
  activeDrivers: number;
  totalMerchants: number;
  warehouses: number;
  revenue: number;
  pendingShipments: number;
  deliveredToday: number;
  returns: number;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerCity: string;
  customerPhone?: string;
  status: string;
  shippingCost: number;
  codAmount: number;
  createdAt: string;
  merchant?: {
    id: string;
    name: string;
    companyName?: string;
  };
  driver?: {
    id: string;
    name: string;
    vehicleNumber?: string;
  };
  warehouse?: {
    id: string;
    name: string;
    code?: string;
  };
}

interface WarehouseAlert {
  id: string;
  name: string;
  code: string;
  utilization: number;
  city: string;
  status: 'critical' | 'warning' | 'good';
}

interface DriverAlert {
  id: string;
  name: string;
  vehicleNumber?: string;
  isAvailable: boolean;
  todayDeliveries: number;
  todayEarnings: number;
}

export default function AdminDashboardPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalShipments: 0,
    activeDrivers: 0,
    totalMerchants: 0,
    warehouses: 0,
    revenue: 0,
    pendingShipments: 0,
    deliveredToday: 0,
    returns: 0,
  });
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [warehouseAlerts, setWarehouseAlerts] = useState<WarehouseAlert[]>([]);
  const [driverAlerts, setDriverAlerts] = useState<DriverAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [statsRes, shipmentsRes, warehouseStatsRes, driverStatsRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/dashboard/recent-shipments'),
        fetch('/api/admin/dashboard/warehouse-stats'),
        fetch('/api/admin/dashboard/driver-stats'),
      ]);

      // Process stats
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        console.error('Failed to fetch dashboard stats');
      }

      // Process recent shipments
      if (shipmentsRes.ok) {
        const shipmentsData = await shipmentsRes.json();
        setRecentShipments(shipmentsData.shipments || []);
      } else {
        console.error('Failed to fetch recent shipments');
      }

      // Process warehouse alerts
      if (warehouseStatsRes.ok) {
        const warehouseData = await warehouseStatsRes.json();
        setWarehouseAlerts(warehouseData.highUtilizationWarehouses || []);
      } else {
        console.error('Failed to fetch warehouse stats');
      }

      // Process driver alerts
      if (driverStatsRes.ok) {
        const driverData = await driverStatsRes.json();
        setDriverAlerts(driverData.drivers || []);
      } else {
        console.error('Failed to fetch driver stats');
      }

      // Update last updated time
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateShipment = () => {
    router.push('/admin/shipments/create');
  };

  const handleAddDriver = () => {
    router.push('/admin/drivers/create');
  };

  const handleAddWarehouse = () => {
    router.push('/admin/warehouses/create');
  };

  const handleGenerateReport = () => {
    router.push('/admin/reports');
  };

  const handleViewAllShipments = () => {
    router.push('/admin/shipments');
  };

  // Calculate percentage changes (mock for now - you can implement real calculations)
  const calculateChange = (current: number, previous: number = current * 0.9) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isPositive: change >= 0,
      icon: change >= 0 ? TrendingUp : TrendingDown,
    };
  };

  const statCards = [
    {
      title: getTranslation(locale, 'dashboard.totalShipments'),
      value: stats.totalShipments.toLocaleString(),
      change: calculateChange(stats.totalShipments),
      icon: Package,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => router.push('/admin/shipments'),
    },
    {
      title: getTranslation(locale, 'dashboard.activeDrivers'),
      value: stats.activeDrivers.toLocaleString(),
      change: calculateChange(stats.activeDrivers),
      icon: Truck,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => router.push('/admin/drivers?status=active'),
    },
    {
      title: getTranslation(locale, 'dashboard.totalMerchants'),
      value: stats.totalMerchants.toLocaleString(),
      change: calculateChange(stats.totalMerchants),
      icon: Users,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => router.push('/admin/merchants'),
    },
    {
      title: getTranslation(locale, 'dashboard.activeWarehouses'),
      value: stats.warehouses.toLocaleString(),
      change: calculateChange(stats.warehouses),
      icon: Building,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => router.push('/admin/warehouses'),
    },
    {
      title: getTranslation(locale, 'dashboard.revenue'),
      value: `EGP ${stats.revenue.toLocaleString()}`,
      subtitle: getTranslation(locale, 'dashboard.thisMonth'),
      change: calculateChange(stats.revenue),
      icon: DollarSign,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
      onClick: () => router.push('/admin/finance'),
    },
    {
      title: getTranslation(locale, 'dashboard.pending'),
      value: stats.pendingShipments.toLocaleString(),
      change: calculateChange(stats.pendingShipments),
      icon: Clock,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      onClick: () => router.push('/admin/shipments?status=pending'),
    },
  ];

  const additionalStats = [
    {
      title: getTranslation(locale, 'dashboard.deliveredToday'),
      value: stats.deliveredToday.toLocaleString(),
      subtitle: getTranslation(locale, 'dashboard.today'),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => router.push('/admin/shipments?status=DELIVERED&today=true'),
    },
    {
      title: getTranslation(locale, 'dashboard.returns'),
      value: stats.returns.toLocaleString(),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => router.push('/admin/shipments?status=RETURNED'),
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

  // Get unavailable drivers count
  const unavailableDriversCount = driverAlerts.filter(driver => !driver.isAvailable).length;

  return (
    <>
      <div className="space-y-6">
        {/* Welcome header with refresh button */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {getTranslation(locale, 'dashboard.welcome')}
              </h1>
              <p className="opacity-90">
                {getTranslation(locale, 'dashboard.welcomeMessage')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm opacity-75">
                  {getTranslation(locale, 'dashboard.lastUpdated')}: {lastUpdated}
                </span>
              )}
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                title={getTranslation(locale, 'dashboard.refresh')}
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const ChangeIcon = stat.change.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow cursor-pointer"
                onClick={stat.onClick}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} ${stat.hoverColor} transition-colors`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <ChangeIcon className={`w-4 h-4 ${
                      stat.change.isPositive ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.change.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change.isPositive ? '+' : '-'}{stat.change.value}%
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.title}</p>
                {stat.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow cursor-pointer"
              onClick={stat.onClick}
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
              {stat.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        {/* Recent shipments and alerts */}
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
                <p className="mt-2 text-gray-600">{getTranslation(locale, 'dashboard.loading')}</p>
              </div>
            ) : recentShipments.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">{getTranslation(locale, 'dashboard.noData')}</p>
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
                    {recentShipments.slice(0, 8).map((shipment) => {
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
                            <div className="text-xs text-gray-500">
                              {new Date(shipment.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="text-sm">{shipment.customerName}</div>
                            <div className="text-xs text-gray-500">
                              {shipment.customerCity}
                              {shipment.customerPhone && ` • ${shipment.customerPhone}`}
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
                              {shipment.codAmount > 0 && (
                                <div className="text-xs text-gray-500">
                                  COD: EGP {shipment.codAmount}
                                </div>
                              )}
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
                  onClick={handleAddWarehouse}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                      <Warehouse className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {getTranslation(locale, 'warehouses')}
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
                {/* Warehouse alerts */}
                {warehouseAlerts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {getTranslation(locale, 'dashboard.warehouseAlerts')}
                    </h3>
                    <div className="space-y-2">
                      {warehouseAlerts.map((warehouse) => (
                        <div 
                          key={warehouse.id}
                          className="flex items-center justify-between p-2 bg-red-50 border border-red-100 rounded-lg cursor-pointer hover:bg-red-100"
                          onClick={() => router.push(`/admin/warehouses/${warehouse.id}`)}
                        >
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              {warehouse.name} ({warehouse.code})
                            </p>
                            <p className="text-xs text-red-700">
                              {getTranslation(locale, 'dashboard.highUtilization')}: {warehouse.utilization}%
                            </p>
                          </div>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Driver alerts */}
                {unavailableDriversCount > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {getTranslation(locale, 'dashboard.driverAlerts')}
                    </h3>
                    <div 
                      className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-100"
                      onClick={() => router.push('/admin/drivers?availability=unavailable')}
                    >
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {getTranslation(locale, 'dashboard.unavailableDrivers')}
                        </p>
                        <p className="text-xs text-yellow-700">
                          {unavailableDriversCount} {getTranslation(locale, 'drivers')} {getTranslation(locale, 'dashboard.today')}
                        </p>
                      </div>
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                )}

                {/* Pending shipments alert */}
                {stats.pendingShipments > 20 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">
                        {getTranslation(locale, 'dashboard.shipmentsDelayed')}
                      </p>
                      <p className="text-yellow-700 mt-1">
                        {stats.pendingShipments} {getTranslation(locale, 'dashboard.pending')}. {getTranslation(locale, 'dashboard.checkDispatch')}
                      </p>
                      <button 
                        onClick={() => router.push('/admin/shipments?status=pending')}
                        className="text-yellow-800 underline text-xs mt-1"
                      >
                        {getTranslation(locale, 'dashboard.viewDetails')}
                      </button>
                    </div>
                  </div>
                )}

                {/* General warehouse capacity alert */}
                {warehouseAlerts.length === 0 && stats.warehouses > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">
                        {getTranslation(locale, 'dashboard.warehouseCapacity')}
                      </p>
                      <p className="text-blue-700 mt-1">
                        {getTranslation(locale, 'dashboard.considerRedistribution')}
                      </p>
                      <button 
                        onClick={() => router.push('/admin/warehouses')}
                        className="text-blue-800 underline text-xs mt-1"
                      >
                        {getTranslation(locale, 'dashboard.viewDetails')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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