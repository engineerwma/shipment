'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Printer,
  Truck,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
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
        available: 'Available',
        busy: 'Busy',
        activate: 'Activate',
        deactivate: 'Deactivate',
        confirm: 'Are you sure?',
      },
      drivers: {
        title: 'Drivers Management',
        description: 'Manage and monitor all delivery drivers',
        drivers: 'Drivers',
        print: 'Print',
        export: 'Export',
        addDriver: 'Add Driver',
        searchDrivers: 'Search Drivers',
        searchPlaceholder: 'Search by name, email, vehicle...',
        totalDrivers: 'Total Drivers',
        activeDrivers: 'Active Drivers',
        availableNow: 'Available Now',
        totalEarnings: 'Total Earnings',
        status: 'Status',
        allStatus: 'All Status',
        location: 'Location',
        allLocations: 'All Locations',
        driver: 'Driver',
        vehicleAndContact: 'Vehicle & Contact',
        performance: 'Performance',
        earnings: 'Earnings',
        loadingDrivers: 'Loading drivers...',
        deliveries: 'Deliveries:',
        successRate: 'Success Rate:',
        rating: 'Rating:',
        joined: 'Joined:',
        deleteDriver: 'Delete this driver?',
        toggleStatus: 'Are you sure you want to {action} this driver?',
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
        available: 'متاح',
        busy: 'مشغول',
        activate: 'تفعيل',
        deactivate: 'تعطيل',
        confirm: 'هل أنت متأكد؟',
      },
      drivers: {
        title: 'إدارة السائقين',
        description: 'إدارة ومراقبة جميع سائقي التوصيل',
        drivers: 'السائقين',
        print: 'طباعة',
        export: 'تصدير',
        addDriver: 'إضافة سائق',
        searchDrivers: 'بحث السائقين',
        searchPlaceholder: 'ابحث بالاسم، البريد، المركبة...',
        totalDrivers: 'إجمالي السائقين',
        activeDrivers: 'السائقين النشطين',
        availableNow: 'متاحين الآن',
        totalEarnings: 'إجمالي الأرباح',
        status: 'الحالة',
        allStatus: 'كل الحالات',
        location: 'الموقع',
        allLocations: 'كل المواقع',
        driver: 'السائق',
        vehicleAndContact: 'المركبة والتواصل',
        performance: 'الأداء',
        earnings: 'الأرباح',
        loadingDrivers: 'جاري تحميل السائقين...',
        deliveries: 'التسليمات:',
        successRate: 'معدل النجاح:',
        rating: 'التقييم:',
        joined: 'تاريخ الانضمام:',
        deleteDriver: 'حذف هذا السائق؟',
        toggleStatus: 'هل أنت متأكد أنك تريد {action} هذا السائق؟',
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

export default function AdminDriversPage() {
  const { locale } = useLocale();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [searchTerm, statusFilter, locationFilter, drivers]);

  const fetchDrivers = async () => {
    try {
      // Mock data for drivers
      const mockDrivers = [
        {
          id: '1',
          name: 'Mohamed Ahmed',
          email: 'mohamed@driver.com',
          phone: '+201000000011',
          vehicleNumber: 'ABC-1234',
          licenseNumber: 'LIC-001',
          status: 'active',
          isAvailable: true,
          currentLocation: 'Cairo',
          totalDeliveries: 245,
          successRate: 96,
          rating: 4.8,
          earnings: 12500,
          joinedDate: '2023-01-15',
          lastActive: '2024-01-20 14:30',
        },
        {
          id: '2',
          name: 'Ali Hassan',
          email: 'ali@driver.com',
          phone: '+201000000012',
          vehicleNumber: 'DEF-5678',
          licenseNumber: 'LIC-002',
          status: 'active',
          isAvailable: false,
          currentLocation: 'Giza',
          totalDeliveries: 189,
          successRate: 94,
          rating: 4.6,
          earnings: 9800,
          joinedDate: '2023-03-10',
          lastActive: '2024-01-19 18:45',
        },
        {
          id: '3',
          name: 'Omar Mahmoud',
          email: 'omar@driver.com',
          phone: '+201000000013',
          vehicleNumber: 'GHI-9012',
          licenseNumber: 'LIC-003',
          status: 'active',
          isAvailable: true,
          currentLocation: 'Alexandria',
          totalDeliveries: 312,
          successRate: 98,
          rating: 4.9,
          earnings: 16200,
          joinedDate: '2022-11-05',
          lastActive: '2024-01-20 10:15',
        },
        {
          id: '4',
          name: 'Khalid Youssef',
          email: 'khalid@driver.com',
          phone: '+201000000014',
          vehicleNumber: 'JKL-3456',
          licenseNumber: 'LIC-004',
          status: 'inactive',
          isAvailable: false,
          currentLocation: 'Cairo',
          totalDeliveries: 156,
          successRate: 92,
          rating: 4.4,
          earnings: 7200,
          joinedDate: '2023-05-20',
          lastActive: '2024-01-10 09:30',
        },
        {
          id: '5',
          name: 'Ahmed Sami',
          email: 'ahmed@driver.com',
          phone: '+201000000015',
          vehicleNumber: 'MNO-7890',
          licenseNumber: 'LIC-005',
          status: 'active',
          isAvailable: true,
          currentLocation: 'Giza',
          totalDeliveries: 278,
          successRate: 97,
          rating: 4.7,
          earnings: 13800,
          joinedDate: '2022-12-12',
          lastActive: '2024-01-20 16:20',
        },
        {
          id: '6',
          name: 'Hassan Mohamed',
          email: 'hassan@driver.com',
          phone: '+201000000016',
          vehicleNumber: 'PQR-1234',
          licenseNumber: 'LIC-006',
          status: 'active',
          isAvailable: false,
          currentLocation: 'Alexandria',
          totalDeliveries: 201,
          successRate: 95,
          rating: 4.5,
          earnings: 10500,
          joinedDate: '2023-04-15',
          lastActive: '2024-01-19 22:10',
        },
        {
          id: '7',
          name: 'Mahmoud Ali',
          email: 'mahmoud@driver.com',
          phone: '+201000000017',
          vehicleNumber: 'STU-5678',
          licenseNumber: 'LIC-007',
          status: 'active',
          isAvailable: true,
          currentLocation: 'Cairo',
          totalDeliveries: 167,
          successRate: 93,
          rating: 4.3,
          earnings: 8900,
          joinedDate: '2023-06-30',
          lastActive: '2024-01-20 12:45',
        },
        {
          id: '8',
          name: 'Youssef Omar',
          email: 'youssef@driver.com',
          phone: '+201000000018',
          vehicleNumber: 'VWX-9012',
          licenseNumber: 'LIC-008',
          status: 'inactive',
          isAvailable: false,
          currentLocation: 'Giza',
          totalDeliveries: 98,
          successRate: 90,
          rating: 4.2,
          earnings: 5100,
          joinedDate: '2023-08-25',
          lastActive: '2024-01-05 14:20',
        },
        {
          id: '9',
          name: 'Sami Khalid',
          email: 'sami@driver.com',
          phone: '+201000000019',
          vehicleNumber: 'YZA-3456',
          licenseNumber: 'LIC-009',
          status: 'active',
          isAvailable: true,
          currentLocation: 'Alexandria',
          totalDeliveries: 223,
          successRate: 96,
          rating: 4.7,
          earnings: 11600,
          joinedDate: '2023-02-28',
          lastActive: '2024-01-20 08:30',
        },
        {
          id: '10',
          name: 'Amr Hassan',
          email: 'amr@driver.com',
          phone: '+201000000020',
          vehicleNumber: 'BCD-7890',
          licenseNumber: 'LIC-010',
          status: 'active',
          isAvailable: true,
          currentLocation: 'Cairo',
          totalDeliveries: 189,
          successRate: 94,
          rating: 4.6,
          earnings: 9900,
          joinedDate: '2023-07-14',
          lastActive: '2024-01-20 15:45',
        },
      ];

      setTimeout(() => {
        setDrivers(mockDrivers);
        setFilteredDrivers(mockDrivers);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone.includes(searchTerm) ||
          driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (driver) => driver.status === statusFilter
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(driver => driver.currentLocation === locationFilter);
    }

    setFilteredDrivers(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm(getTranslation(locale, 'drivers.deleteDriver'))) {
      try {
        console.log('Deleting driver:', id);
        fetchDrivers();
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' 
      ? getTranslation(locale, 'common.activate')
      : getTranslation(locale, 'common.deactivate');
    
    const confirmMessage = getTranslation(locale, 'drivers.toggleStatus')
      .replace('{action}', actionText);
    
    if (confirm(confirmMessage)) {
      try {
        console.log('Updating driver status:', id, newStatus);
        fetchDrivers();
      } catch (error) {
        console.error('Error updating driver status:', error);
      }
    }
  };

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const availableDrivers = drivers.filter(d => d.isAvailable).length;
  const totalEarnings = drivers.reduce((sum, d) => sum + d.earnings, 0);

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(drivers.map(d => d.currentLocation)));

  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'drivers.allStatus') },
    { value: 'active', label: getTranslation(locale, 'common.active') },
    { value: 'inactive', label: getTranslation(locale, 'common.inactive') },
  ];

  const statCards = [
    {
      label: getTranslation(locale, 'drivers.totalDrivers'),
      value: totalDrivers,
      icon: Truck,
      color: 'bg-blue-500',
      description: getTranslation(locale, 'common.all'),
      change: '+5%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'drivers.activeDrivers'),
      value: activeDrivers,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: getTranslation(locale, 'common.active'),
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'drivers.availableNow'),
      value: availableDrivers,
      icon: Clock,
      color: 'bg-teal-500',
      description: getTranslation(locale, 'common.available'),
      change: '-2%',
      changeColor: 'text-red-600',
    },
    {
      label: getTranslation(locale, 'drivers.totalEarnings'),
      value: `EGP ${totalEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: getTranslation(locale, 'drivers.totalEarnings'),
      change: '+15%',
      changeColor: 'text-green-600',
    },
  ];

  return (

      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getTranslation(locale, 'drivers.title')}
            </h1>
            <p className="text-gray-600">
              {getTranslation(locale, 'drivers.description')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>{getTranslation(locale, 'drivers.print')}</span>
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{getTranslation(locale, 'drivers.export')}</span>
            </button>
            <Link
              href="/admin/drivers/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{getTranslation(locale, 'drivers.addDriver')}</span>
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
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
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
                {getTranslation(locale, 'drivers.searchDrivers')}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(locale, 'drivers.searchPlaceholder')}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'drivers.status')}
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
                {getTranslation(locale, 'drivers.location')}
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input w-full"
              >
                <option value="">{getTranslation(locale, 'drivers.allLocations')}</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Drivers table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'drivers.loadingDrivers')}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'drivers.driver')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'drivers.vehicleAndContact')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'drivers.performance')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'drivers.earnings')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'drivers.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                              <div className="font-medium text-gray-900">
                                {driver.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: DRV-{driver.id.padStart(4, '0')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{driver.vehicleNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{driver.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-xs">{driver.currentLocation}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'drivers.deliveries')}
                              </span>
                              <span className="font-medium">{driver.totalDeliveries}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'drivers.successRate')}
                              </span>
                              <span className="font-medium text-green-600">{driver.successRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'drivers.rating')}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="font-medium">{driver.rating}</span>
                                <span className="text-gray-400 text-xs">/5</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-lg">
                            EGP {driver.earnings.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getTranslation(locale, 'drivers.joined')} {driver.joinedDate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              driver.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {driver.status === 'active'
                                ? getTranslation(locale, 'common.active')
                                : getTranslation(locale, 'common.inactive')}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              driver.isAvailable
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {driver.isAvailable
                                ? getTranslation(locale, 'common.available')
                                : getTranslation(locale, 'common.busy')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/drivers/${driver.id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title={getTranslation(locale, 'common.view')}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/drivers/${driver.id}/edit`}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title={getTranslation(locale, 'common.edit')}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(driver.id, driver.status)}
                              className={`p-2 rounded hover:bg-gray-100 ${
                                driver.status === 'active' 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={driver.status === 'active' 
                                ? getTranslation(locale, 'common.deactivate')
                                : getTranslation(locale, 'common.activate')}
                            >
                              {driver.status === 'active' ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(driver.id)}
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
              {filteredDrivers.length > itemsPerPage && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {(currentPage - 1) * itemsPerPage + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      filteredDrivers.length
                    )} {getTranslation(locale, 'common.of')} {filteredDrivers.length} {getTranslation(locale, 'common.results')}
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
                          p < Math.ceil(filteredDrivers.length / itemsPerPage)
                            ? p + 1
                            : p
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(filteredDrivers.length / itemsPerPage)
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
    
  );
}