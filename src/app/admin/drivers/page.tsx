'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Filter,
  MoreVertical,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '../../../app/contexts/LocaleContext';

// Types
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
  isAvailable: boolean;
  currentLocation: string;
  totalDeliveries: number;
  successRate: number;
  rating: number;
  earnings: number;
  joinedDate: string;
  lastActive: string;
  avatar?: string;
}

interface DriversResponse {
  drivers: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DriverStats {
  totalDrivers: number;
  activeDrivers: number;
  availableDrivers: number;
  totalEarnings: number;
}

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
        yes: 'Yes',
        no: 'No',
        cancel: 'Cancel',
        confirmDelete: 'Confirm Delete',
        confirmStatus: 'Confirm Status Change',
        success: 'Success',
        error: 'Error',
        refresh: 'Refresh',
        apply: 'Apply',
        clear: 'Clear',
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
        deleteDriver: 'Delete Driver',
        deleteConfirm: 'Are you sure you want to delete this driver? This action cannot be undone.',
        toggleStatus: 'Change Status',
        statusConfirm: 'Are you sure you want to {action} this driver?',
        statusChangeSuccess: 'Driver status changed successfully',
        deleteSuccess: 'Driver deleted successfully',
        noDrivers: 'No drivers found',
        noDriversDescription: 'Try adjusting your search or filter to find what you\'re looking for.',
        filterBy: 'Filter by',
        resetFilters: 'Reset Filters',
        viewDetails: 'View Details',
        editDriver: 'Edit Driver',
        makeAvailable: 'Make Available',
        makeBusy: 'Make Busy',
        lastActive: 'Last Active',
      },
      errors: {
        fetchError: 'Failed to load drivers. Please try again.',
        deleteError: 'Failed to delete driver. Please try again.',
        statusError: 'Failed to update driver status. Please try again.',
        statsError: 'Failed to load statistics. Please try again.',
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
        yes: 'نعم',
        no: 'لا',
        cancel: 'إلغاء',
        confirmDelete: 'تأكيد الحذف',
        confirmStatus: 'تأكيد تغيير الحالة',
        success: 'نجاح',
        error: 'خطأ',
        refresh: 'تحديث',
        apply: 'تطبيق',
        clear: 'مسح',
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
        deleteDriver: 'حذف السائق',
        deleteConfirm: 'هل أنت متأكد من حذف هذا السائق؟ لا يمكن التراجع عن هذا الإجراء.',
        toggleStatus: 'تغيير الحالة',
        statusConfirm: 'هل أنت متأكد أنك تريد {action} هذا السائق؟',
        statusChangeSuccess: 'تم تغيير حالة السائق بنجاح',
        deleteSuccess: 'تم حذف السائق بنجاح',
        noDrivers: 'لا توجد سائقين',
        noDriversDescription: 'حاول تعديل بحثك أو الفلتر للعثور على ما تبحث عنه.',
        filterBy: 'تصفية حسب',
        resetFilters: 'إعادة تعيين الفلاتر',
        viewDetails: 'عرض التفاصيل',
        editDriver: 'تعديل السائق',
        makeAvailable: 'جعله متاح',
        makeBusy: 'جعله مشغول',
        lastActive: 'آخر نشاط',
      },
      errors: {
        fetchError: 'فشل تحميل السائقين. يرجى المحاولة مرة أخرى.',
        deleteError: 'فشل حذف السائق. يرجى المحاولة مرة أخرى.',
        statusError: 'فشل تحديث حالة السائق. يرجى المحاولة مرة أخرى.',
        statsError: 'فشل تحميل الإحصائيات. يرجى المحاولة مرة أخرى.',
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
  const router = useRouter();
  
  // State management
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Stats state
  const [stats, setStats] = useState<DriverStats>({
    totalDrivers: 0,
    activeDrivers: 0,
    availableDrivers: 0,
    totalEarnings: 0,
  });
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'status' | 'availability' | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const isRTL = locale === 'ar';
  const itemsPerPage = 10;

  // Fetch drivers and stats on mount
  useEffect(() => {
    fetchDrivers();
    fetchDriverStats();
  }, [currentPage, statusFilter, availabilityFilter]);

  // Filter drivers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone.includes(searchTerm) ||
          driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.currentLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDrivers(filtered);
    }
  }, [searchTerm, drivers]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (availabilityFilter !== 'ALL') params.append('availability', availabilityFilter);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(`/api/admin/drivers?${params}`);
      
      if (!response.ok) {
        throw new Error(getTranslation(locale, 'errors.fetchError'));
      }

      const data: DriversResponse = await response.json();
      
      setDrivers(data.drivers);
      setFilteredDrivers(data.drivers);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (error: any) {
      console.error('Error fetching drivers:', error);
      setError(error.message);
      
      // Fallback to mock data if API fails
      const mockDrivers = generateMockDrivers();
      setDrivers(mockDrivers);
      setFilteredDrivers(mockDrivers);
      setTotalPages(3);
      setTotalCount(30);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch('/api/admin/drivers/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalDrivers: data.totalDrivers || 0,
          activeDrivers: data.activeDrivers || 0,
          availableDrivers: data.availableDrivers || 0,
          totalEarnings: data.totalEarnings || 0,
        });
      } else {
        // Fallback mock stats
        setStats({
          totalDrivers: 30,
          activeDrivers: 24,
          availableDrivers: 18,
          totalEarnings: 125000,
        });
      }
    } catch (error) {
      console.error('Error fetching driver stats:', error);
      // Fallback mock stats
      setStats({
        totalDrivers: 30,
        activeDrivers: 24,
        availableDrivers: 18,
        totalEarnings: 125000,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const generateMockDrivers = (): Driver[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Driver ${i + 1}`,
      email: `driver${i + 1}@example.com`,
      phone: `+2010000000${(i + 1).toString().padStart(2, '0')}`,
      vehicleNumber: `ABC-${(1000 + i).toString()}`,
      licenseNumber: `LIC-${(1000 + i).toString()}`,
      status: i % 10 < 8 ? 'active' : 'inactive',
      isAvailable: i % 2 === 0,
      currentLocation: ['Cairo', 'Giza', 'Alexandria'][i % 3],
      totalDeliveries: Math.floor(Math.random() * 300) + 50,
      successRate: Math.floor(Math.random() * 10) + 90,
      rating: 4 + Math.random(),
      earnings: Math.floor(Math.random() * 20000) + 5000,
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
    }));
  };

  // Modal handlers
  const openDeleteModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setActionType('delete');
    setShowDeleteModal(true);
  };

  const openStatusModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setActionType('status');
    setShowStatusModal(true);
  };

  const openAvailabilityModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setActionType('availability');
    setShowStatusModal(true);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setShowStatusModal(false);
    setSelectedDriver(null);
    setActionType(null);
    setModalLoading(false);
  };

  // CRUD Operations
  const handleDelete = async () => {
    if (!selectedDriver) return;
    
    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || getTranslation(locale, 'errors.deleteError'));
      }

      alert(getTranslation(locale, 'drivers.deleteSuccess'));
      closeModals();
      fetchDrivers();
      fetchDriverStats();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedDriver) return;
    
    try {
      setModalLoading(true);
      const newStatus = selectedDriver.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isActive: newStatus === 'active',
          isAvailable: newStatus === 'active', // Reset availability when activating
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || getTranslation(locale, 'errors.statusError'));
      }

      alert(getTranslation(locale, 'drivers.statusChangeSuccess'));
      closeModals();
      fetchDrivers();
      fetchDriverStats();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!selectedDriver) return;
    
    try {
      setModalLoading(true);
      const newAvailability = !selectedDriver.isAvailable;
      
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isAvailable: newAvailability,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || getTranslation(locale, 'errors.statusError'));
      }

      alert(`Driver marked as ${newAvailability ? 'available' : 'busy'}`);
      closeModals();
      fetchDrivers();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Filter handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAvailabilityFilter = (availability: string) => {
    setAvailabilityFilter(availability);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setAvailabilityFilter('ALL');
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stats cards data
  const statCards = [
    {
      label: getTranslation(locale, 'drivers.totalDrivers'),
      value: loadingStats ? '...' : stats.totalDrivers.toLocaleString(),
      icon: Truck,
      color: 'bg-blue-500',
      description: getTranslation(locale, 'common.all'),
      change: '+5%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'drivers.activeDrivers'),
      value: loadingStats ? '...' : stats.activeDrivers.toLocaleString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      description: getTranslation(locale, 'common.active'),
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'drivers.availableNow'),
      value: loadingStats ? '...' : stats.availableDrivers.toLocaleString(),
      icon: Clock,
      color: 'bg-teal-500',
      description: getTranslation(locale, 'common.available'),
      change: '-2%',
      changeColor: 'text-red-600',
    },
    {
      label: getTranslation(locale, 'drivers.totalEarnings'),
      value: loadingStats ? '...' : `EGP ${stats.totalEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: getTranslation(locale, 'drivers.totalEarnings'),
      change: '+15%',
      changeColor: 'text-green-600',
    },
  ];

  // Status options
  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'drivers.allStatus') },
    { value: 'active', label: getTranslation(locale, 'common.active') },
    { value: 'inactive', label: getTranslation(locale, 'common.inactive') },
  ];

  // Availability options
  const availabilityOptions = [
    { value: 'ALL', label: getTranslation(locale, 'common.all') },
    { value: 'available', label: getTranslation(locale, 'common.available') },
    { value: 'busy', label: getTranslation(locale, 'common.busy') },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchDrivers}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title={getTranslation(locale, 'common.refresh')}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{getTranslation(locale, 'drivers.filterBy')}</span>
            </button>
            <Link
              href="/admin/drivers/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{getTranslation(locale, 'drivers.addDriver')}</span>
            </Link>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">
                {getTranslation(locale, 'drivers.filterBy')}
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {getTranslation(locale, 'drivers.resetFilters')}
              </button>
            </div>
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
                    onChange={handleSearch}
                    placeholder={getTranslation(locale, 'drivers.searchPlaceholder')}
                    className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(locale, 'drivers.status')}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                  {getTranslation(locale, 'common.availability')}
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => handleAvailabilityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Drivers table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'drivers.loadingDrivers')}
              </p>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="p-12 text-center">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getTranslation(locale, 'drivers.noDrivers')}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {getTranslation(locale, 'drivers.noDriversDescription')}
              </p>
              {searchTerm || statusFilter !== 'ALL' || availabilityFilter !== 'ALL' ? (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {getTranslation(locale, 'drivers.resetFilters')}
                </button>
              ) : (
                <Link
                  href="/admin/drivers/create"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {getTranslation(locale, 'drivers.addDriver')}
                </Link>
              )}
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
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                              <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                                onClick={() => router.push(`/admin/drivers/${driver.id}`)}>
                                {driver.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {driver.email}
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
                              <span className={`font-medium ${
                                driver.successRate >= 95 ? 'text-green-600' : 
                                driver.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {driver.successRate}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'drivers.rating')}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="font-medium">{driver.rating.toFixed(1)}</span>
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
                          <div className="text-xs text-gray-500">
                            {getTranslation(locale, 'drivers.lastActive')}: {formatDate(driver.lastActive)}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/admin/drivers/${driver.id}`)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title={getTranslation(locale, 'drivers.viewDetails')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/drivers/${driver.id}/edit`)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                              title={getTranslation(locale, 'drivers.editDriver')}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openAvailabilityModal(driver)}
                              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                                driver.isAvailable 
                                  ? 'text-yellow-600 hover:text-yellow-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={driver.isAvailable 
                                ? getTranslation(locale, 'drivers.makeBusy')
                                : getTranslation(locale, 'drivers.makeAvailable')}
                            >
                              {driver.isAvailable ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openStatusModal(driver)}
                              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                                driver.status === 'active' 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={getTranslation(locale, 'drivers.toggleStatus')}
                            >
                              {driver.status === 'active' ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openDeleteModal(driver)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
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
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {((currentPage - 1) * itemsPerPage) + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      totalCount
                    )} {getTranslation(locale, 'common.of')} {totalCount} {getTranslation(locale, 'common.results')}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {getTranslation(locale, 'common.previous')}
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 border rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getTranslation(locale, 'drivers.deleteDriver')}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {getTranslation(locale, 'drivers.deleteConfirm')}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedDriver.name}</p>
                    <p className="text-sm text-gray-500">{selectedDriver.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  disabled={modalLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {getTranslation(locale, 'common.cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={modalLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {modalLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {getTranslation(locale, 'common.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedDriver && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  actionType === 'status' 
                    ? selectedDriver.status === 'active' 
                      ? 'bg-red-100' 
                      : 'bg-green-100'
                    : 'bg-blue-100'
                }`}>
                  {actionType === 'status' ? (
                    selectedDriver.status === 'active' ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )
                  ) : (
                    selectedDriver.isAvailable ? (
                      <Clock className="w-6 h-6 text-blue-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionType === 'status' 
                    ? getTranslation(locale, 'drivers.toggleStatus')
                    : selectedDriver.isAvailable
                      ? getTranslation(locale, 'drivers.makeBusy')
                      : getTranslation(locale, 'drivers.makeAvailable')
                  }
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {actionType === 'status' 
                  ? getTranslation(locale, 'drivers.statusConfirm').replace(
                      '{action}', 
                      selectedDriver.status === 'active' 
                        ? getTranslation(locale, 'common.deactivate')
                        : getTranslation(locale, 'common.activate')
                    )
                  : selectedDriver.isAvailable
                    ? 'Are you sure you want to mark this driver as busy?'
                    : 'Are you sure you want to mark this driver as available?'
                }
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedDriver.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedDriver.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDriver.status === 'active'
                          ? getTranslation(locale, 'common.active')
                          : getTranslation(locale, 'common.inactive')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedDriver.isAvailable
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedDriver.isAvailable
                          ? getTranslation(locale, 'common.available')
                          : getTranslation(locale, 'common.busy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  disabled={modalLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {getTranslation(locale, 'common.cancel')}
                </button>
                <button
                  onClick={actionType === 'status' ? handleToggleStatus : handleToggleAvailability}
                  disabled={modalLoading}
                  className={`px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2 ${
                    actionType === 'status'
                      ? selectedDriver.status === 'active'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {modalLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {actionType === 'status'
                    ? selectedDriver.status === 'active'
                      ? getTranslation(locale, 'common.deactivate')
                      : getTranslation(locale, 'common.activate')
                    : selectedDriver.isAvailable
                      ? getTranslation(locale, 'drivers.makeBusy')
                      : getTranslation(locale, 'drivers.makeAvailable')
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}