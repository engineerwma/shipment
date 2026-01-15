'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Printer,
  Warehouse as WarehouseIcon,
  MapPin,
  Package,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Thermometer,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '../../../app/contexts/LocaleContext';

// Simple translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      common: {
        search: 'Search',
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        actions: 'Actions',
        loading: 'Loading...',
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
        activate: 'Activate',
        deactivate: 'Deactivate',
        confirm: 'Are you sure?',
        manager: 'Manager',
        phone: 'Phone',
        capacity: 'Capacity',
        updated: 'Updated',
        full: 'full',
      },
      warehouses: {
        title: 'Warehouses Management',
        description: 'Manage and monitor all warehouse facilities',
        warehouses: 'Warehouses',
        print: 'Print',
        export: 'Export',
        addWarehouse: 'Add Warehouse',
        searchWarehouses: 'Search Warehouses',
        searchPlaceholder: 'Search by name, code, city...',
        totalWarehouses: 'Total Warehouses',
        activeWarehouses: 'Active Warehouses',
        totalCapacity: 'Total Capacity',
        overallUsage: 'Overall Usage',
        status: 'Status',
        allStatus: 'All Status',
        city: 'City',
        allCities: 'All Cities',
        warehouse: 'Warehouse',
        locationAndContact: 'Location & Contact',
        capacityAndUsage: 'Capacity & Usage',
        operations: 'Operations',
        loadingWarehouses: 'Loading warehouses...',
        totalShipments: 'Total Shipments:',
        pending: 'Pending:',
        staff: 'Staff:',
        deleteWarehouse: 'Delete this warehouse?',
        toggleStatus: 'Are you sure you want to {action} this warehouse?',
        highUsage: 'High usage - Consider expansion',
      },
    },
    ar: {
      common: {
        search: 'بحث',
        previous: 'السابق',
        next: 'التالي',
        showing: 'عرض',
        to: 'إلى',
        of: 'من',
        results: 'نتيجة',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        actions: 'الإجراءات',
        loading: 'جاري التحميل...',
        all: 'الكل',
        active: 'نشط',
        inactive: 'غير نشط',
        activate: 'تفعيل',
        deactivate: 'تعطيل',
        confirm: 'هل أنت متأكد؟',
        manager: 'المدير',
        phone: 'الهاتف',
        capacity: 'السعة',
        updated: 'آخر تحديث',
        full: 'ممتلئ',
      },
      warehouses: {
        title: 'إدارة المستودعات',
        description: 'إدارة ومراقبة جميع مرافق المستودعات',
        warehouses: 'المستودعات',
        print: 'طباعة',
        export: 'تصدير',
        addWarehouse: 'إضافة مستودع',
        searchWarehouses: 'بحث المستودعات',
        searchPlaceholder: 'ابحث بالاسم، الرمز، المدينة...',
        totalWarehouses: 'إجمالي المستودعات',
        activeWarehouses: 'المستودعات النشطة',
        totalCapacity: 'إجمالي السعة',
        overallUsage: 'إجمالي الاستخدام',
        status: 'الحالة',
        allStatus: 'كل الحالات',
        city: 'المدينة',
        allCities: 'كل المدن',
        warehouse: 'المستودع',
        locationAndContact: 'الموقع والتواصل',
        capacityAndUsage: 'السعة والاستخدام',
        operations: 'العمليات',
        loadingWarehouses: 'جاري تحميل المستودعات...',
        totalShipments: 'إجمالي الشحنات:',
        pending: 'معلق:',
        staff: 'الموظفين:',
        deleteWarehouse: 'حذف هذا المستودع؟',
        toggleStatus: 'هل أنت متأكد أنك تريد {action} هذا المستودع؟',
        highUsage: 'استخدام عالي - فكر في التوسع',
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

export default function AdminWarehousesPage() {
  const { locale } = useLocale();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    filterWarehouses();
  }, [searchTerm, statusFilter, cityFilter, warehouses]);

  const fetchWarehouses = async () => {
    try {
      // Mock data for warehouses
      const mockWarehouses = [
        {
          id: '1',
          name: 'Main Warehouse Cairo',
          code: 'WH-CAI-001',
          address: 'Industrial Zone, Cairo',
          city: 'Cairo',
          latitude: 30.0444,
          longitude: 31.2357,
          capacity: 1000,
          currentLoad: 850,
          capacityPercentage: 85,
          isActive: true,
          manager: 'Ahmed Mohamed',
          phone: '+201000000031',
          totalShipments: 1250,
          pendingShipments: 42,
          staffCount: 15,
          lastUpdated: '2024-01-20 14:30',
        },
        {
          id: '2',
          name: 'Alexandria Port Warehouse',
          code: 'WH-ALX-002',
          address: 'Port Area, Alexandria',
          city: 'Alexandria',
          latitude: 31.2001,
          longitude: 29.9187,
          capacity: 800,
          currentLoad: 650,
          capacityPercentage: 81,
          isActive: true,
          manager: 'Sara Ali',
          phone: '+201000000032',
          totalShipments: 890,
          pendingShipments: 28,
          staffCount: 12,
          lastUpdated: '2024-01-19 18:45',
        },
        {
          id: '3',
          name: 'Giza Distribution Center',
          code: 'WH-GIZ-003',
          address: 'Giza Industrial Area',
          city: 'Giza',
          latitude: 30.0131,
          longitude: 31.2089,
          capacity: 600,
          currentLoad: 420,
          capacityPercentage: 70,
          isActive: true,
          manager: 'Omar Hassan',
          phone: '+201000000033',
          totalShipments: 560,
          pendingShipments: 35,
          staffCount: 10,
          lastUpdated: '2024-01-20 10:15',
        },
        {
          id: '4',
          name: 'Mansoura Regional Hub',
          code: 'WH-MAN-004',
          address: 'Mansoura Industrial Zone',
          city: 'Mansoura',
          latitude: 31.0409,
          longitude: 31.3785,
          capacity: 500,
          currentLoad: 280,
          capacityPercentage: 56,
          isActive: true,
          manager: 'Fatima Mahmoud',
          phone: '+201000000034',
          totalShipments: 320,
          pendingShipments: 18,
          staffCount: 8,
          lastUpdated: '2024-01-18 16:20',
        },
        {
          id: '5',
          name: 'Shubra Al Kheima Warehouse',
          code: 'WH-SHK-005',
          address: 'Shubra Industrial Area',
          city: 'Cairo',
          latitude: 30.1286,
          longitude: 31.2422,
          capacity: 700,
          currentLoad: 520,
          capacityPercentage: 74,
          isActive: false,
          manager: 'Khalid Ahmed',
          phone: '+201000000035',
          totalShipments: 410,
          pendingShipments: 15,
          staffCount: 9,
          lastUpdated: '2024-01-10 09:30',
        },
        {
          id: '6',
          name: 'Tanta Logistics Center',
          code: 'WH-TAN-006',
          address: 'Tanta Free Zone',
          city: 'Tanta',
          latitude: 30.7865,
          longitude: 31.0004,
          capacity: 450,
          currentLoad: 310,
          capacityPercentage: 69,
          isActive: true,
          manager: 'Noura Salah',
          phone: '+201000000036',
          totalShipments: 280,
          pendingShipments: 22,
          staffCount: 7,
          lastUpdated: '2024-01-19 22:10',
        },
        {
          id: '7',
          name: 'Port Said Port Warehouse',
          code: 'WH-PTS-007',
          address: 'Port Said Port Area',
          city: 'Port Said',
          latitude: 31.2565,
          longitude: 32.2841,
          capacity: 900,
          currentLoad: 620,
          capacityPercentage: 69,
          isActive: true,
          manager: 'Mohamed Ibrahim',
          phone: '+201000000037',
          totalShipments: 510,
          pendingShipments: 31,
          staffCount: 11,
          lastUpdated: '2024-01-20 12:45',
        },
        {
          id: '8',
          name: 'Suez Canal Warehouse',
          code: 'WH-SUE-008',
          address: 'Suez Canal Zone',
          city: 'Suez',
          latitude: 29.9668,
          longitude: 32.5498,
          capacity: 550,
          currentLoad: 380,
          capacityPercentage: 69,
          isActive: false,
          manager: 'Hana Youssef',
          phone: '+201000000038',
          totalShipments: 290,
          pendingShipments: 12,
          staffCount: 6,
          lastUpdated: '2024-01-05 14:20',
        },
        {
          id: '9',
          name: 'Luxor Storage Facility',
          code: 'WH-LUX-009',
          address: 'Luxor Industrial Area',
          city: 'Luxor',
          latitude: 25.6872,
          longitude: 32.6396,
          capacity: 400,
          currentLoad: 210,
          capacityPercentage: 53,
          isActive: true,
          manager: 'Youssef Ali',
          phone: '+201000000039',
          totalShipments: 180,
          pendingShipments: 14,
          staffCount: 5,
          lastUpdated: '2024-01-20 08:30',
        },
        {
          id: '10',
          name: 'Aswan Distribution Point',
          code: 'WH-ASW-010',
          address: 'Aswan Commercial Zone',
          city: 'Aswan',
          latitude: 24.0889,
          longitude: 32.8998,
          capacity: 350,
          currentLoad: 190,
          capacityPercentage: 54,
          isActive: true,
          manager: 'Laila Mohammed',
          phone: '+201000000040',
          totalShipments: 150,
          pendingShipments: 8,
          staffCount: 4,
          lastUpdated: '2024-01-20 15:45',
        },
      ];

      setTimeout(() => {
        setWarehouses(mockWarehouses);
        setFilteredWarehouses(mockWarehouses);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLoading(false);
    }
  };

  const filterWarehouses = () => {
    let filtered = warehouses;

    if (searchTerm) {
      filtered = filtered.filter(
        (warehouse) =>
          warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (warehouse) => warehouse.isActive === (statusFilter === 'active')
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(warehouse => warehouse.city === cityFilter);
    }

    setFilteredWarehouses(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm(getTranslation(locale, 'warehouses.deleteWarehouse'))) {
      try {
        console.log('Deleting warehouse:', id);
        fetchWarehouses();
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const actionText = newStatus 
      ? getTranslation(locale, 'common.activate')
      : getTranslation(locale, 'common.deactivate');
    
    const confirmMessage = getTranslation(locale, 'warehouses.toggleStatus')
      .replace('{action}', actionText);
    
    if (confirm(confirmMessage)) {
      try {
        console.log('Updating warehouse status:', id, newStatus);
        fetchWarehouses();
      } catch (error) {
        console.error('Error updating warehouse status:', error);
      }
    }
  };

  const paginatedWarehouses = filteredWarehouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.isActive).length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalUsed = warehouses.reduce((sum, w) => sum + w.currentLoad, 0);
  const overallUsage = Math.round((totalUsed / totalCapacity) * 100);

  // Get unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(warehouses.map(w => w.city)));

  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'warehouses.allStatus') },
    { value: 'active', label: getTranslation(locale, 'common.active') },
    { value: 'inactive', label: getTranslation(locale, 'common.inactive') },
  ];

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCapacityTextColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCapacityIcon = (percentage: number) => {
    if (percentage >= 80) return Thermometer;
    if (percentage >= 60) return BarChart3;
    return Package;
  };

  const statCards = [
    {
      label: getTranslation(locale, 'warehouses.totalWarehouses'),
      value: totalWarehouses,
      icon: WarehouseIcon,
      color: 'bg-blue-500',
      description: getTranslation(locale, 'common.all'),
      change: '+5%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'warehouses.activeWarehouses'),
      value: activeWarehouses,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: getTranslation(locale, 'common.active'),
      change: '+3%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'warehouses.totalCapacity'),
      value: `${totalCapacity.toLocaleString()} units`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      description: getTranslation(locale, 'warehouses.totalCapacity'),
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'warehouses.overallUsage'),
      value: `${overallUsage}%`,
      icon: getCapacityIcon(overallUsage),
      color: getCapacityColor(overallUsage),
      description: getTranslation(locale, 'warehouses.overallUsage'),
      change: overallUsage >= 80 ? '+2%' : '-1%',
      changeColor: overallUsage >= 80 ? 'text-red-600' : 'text-green-600',
    },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getTranslation(locale, 'warehouses.title')}
            </h1>
            <p className="text-gray-600">
              {getTranslation(locale, 'warehouses.description')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>{getTranslation(locale, 'warehouses.print')}</span>
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{getTranslation(locale, 'warehouses.export')}</span>
            </button>
            <Link
              href="/admin/warehouses/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(locale, 'warehouses.addWarehouse')}</span>
            </Link>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${getCapacityTextColor(parseInt(stat.value))}`}>
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${stat.changeColor}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'warehouses.searchWarehouses')}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(locale, 'warehouses.searchPlaceholder')}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'warehouses.status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'warehouses.city')}
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input w-full"
              >
                <option value="">{getTranslation(locale, 'warehouses.allCities')}</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Warehouses table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'warehouses.loadingWarehouses')}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.warehouse')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.locationAndContact')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.capacityAndUsage')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.operations')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedWarehouses.map((warehouse) => (
                      <tr key={warehouse.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <WarehouseIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                              <div className="font-medium text-gray-900">
                                {warehouse.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {warehouse.code}
                              </div>
                              <div className="text-xs text-gray-400">
                                ID: WH-{warehouse.id.padStart(4, '0')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{warehouse.city}</span>
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {warehouse.address}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'common.manager')}:
                              </span>
                              <div className="font-medium">{warehouse.manager}</div>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'common.phone')}:
                              </span>
                              <div>{warehouse.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">
                                  {getTranslation(locale, 'common.capacity')}:
                                </span>
                                <span className="font-medium">
                                  {warehouse.currentLoad}/{warehouse.capacity}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getCapacityColor(warehouse.capacityPercentage)}`}
                                  style={{ width: `${warehouse.capacityPercentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 text-right mt-1">
                                {warehouse.capacityPercentage}% {getTranslation(locale, 'common.full')}
                              </div>
                            </div>
                            {warehouse.capacityPercentage >= 80 && (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>
                                  {getTranslation(locale, 'warehouses.highUsage')}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'warehouses.totalShipments')}
                              </span>
                              <span className="font-medium">{warehouse.totalShipments}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'warehouses.pending')}
                              </span>
                              <span className="font-medium text-yellow-600">{warehouse.pendingShipments}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'warehouses.staff')}
                              </span>
                              <span className="font-medium">{warehouse.staffCount}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {getTranslation(locale, 'common.updated')}: {warehouse.lastUpdated}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            warehouse.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {warehouse.isActive
                              ? getTranslation(locale, 'common.active')
                              : getTranslation(locale, 'common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/warehouses/${warehouse.id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title={getTranslation(locale, 'common.view')}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/warehouses/${warehouse.id}/edit`}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title={getTranslation(locale, 'common.edit')}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(warehouse.id, warehouse.isActive)}
                              className={`p-2 rounded hover:bg-gray-100 ${
                                warehouse.isActive 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={warehouse.isActive 
                                ? getTranslation(locale, 'common.deactivate')
                                : getTranslation(locale, 'common.activate')}
                            >
                              {warehouse.isActive ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(warehouse.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title={getTranslation(locale, 'common.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredWarehouses.length > itemsPerPage && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {(currentPage - 1) * itemsPerPage + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      filteredWarehouses.length
                    )} {getTranslation(locale, 'common.of')} {filteredWarehouses.length} {getTranslation(locale, 'common.results')}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {getTranslation(locale, 'common.previous')}
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          p < Math.ceil(filteredWarehouses.length / itemsPerPage)
                            ? p + 1
                            : p
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(filteredWarehouses.length / itemsPerPage)
                      }
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {getTranslation(locale, 'common.next')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}