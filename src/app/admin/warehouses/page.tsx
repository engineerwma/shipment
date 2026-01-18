'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  BarChart3,
  Filter,
  RefreshCw,
  AlertCircle,
  Plus,
  MoreVertical,
  Download,
  Printer,
  TrendingUp,
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
}

interface WarehousesResponse {
  warehouses: Warehouse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface WarehouseStats {
  totalWarehouses: number;
  activeWarehouses: number;
  totalCapacity: number;
  totalCurrentLoad: number;
  totalUtilization: number;
  availableSpace: number;
}

// Translation function
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
      warehouses: {
        title: 'Warehouses Management',
        description: 'Manage and monitor all warehouses',
        warehouses: 'Warehouses',
        print: 'Print',
        export: 'Export',
        addWarehouse: 'Add Warehouse',
        searchWarehouses: 'Search Warehouses',
        searchPlaceholder: 'Search by name, code, city...',
        totalWarehouses: 'Total Warehouses',
        activeWarehouses: 'Active Warehouses',
        totalCapacity: 'Total Capacity',
        utilization: 'Utilization',
        status: 'Status',
        allStatus: 'All Status',
        city: 'City',
        allCities: 'All Cities',
        warehouse: 'Warehouse',
        location: 'Location',
        contact: 'Contact',
        capacity: 'Capacity',
        utilizationRate: 'Utilization Rate',
        shipments: 'Shipments',
        loadingWarehouses: 'Loading warehouses...',
        deleteWarehouse: 'Delete Warehouse',
        deleteConfirm: 'Are you sure you want to delete this warehouse? This action cannot be undone.',
        toggleStatus: 'Change Status',
        statusConfirm: 'Are you sure you want to {action} this warehouse?',
        statusChangeSuccess: 'Warehouse status changed successfully',
        deleteSuccess: 'Warehouse deleted successfully',
        noWarehouses: 'No warehouses found',
        noWarehousesDescription: 'Try adjusting your search or filter to find what you\'re looking for.',
        filterBy: 'Filter by',
        resetFilters: 'Reset Filters',
        viewDetails: 'View Details',
        editWarehouse: 'Edit Warehouse',
        code: 'Code',
        address: 'Address',
        manager: 'Manager',
        availableSpace: 'Available Space',
        highUtilization: 'High Utilization',
        moderateUtilization: 'Moderate Utilization',
        lowUtilization: 'Low Utilization',
        full: 'Full',
        almostFull: 'Almost Full',
        hasSpace: 'Has Space',
        empty: 'Empty',
      },
      errors: {
        fetchError: 'Failed to load warehouses. Please try again.',
        deleteError: 'Failed to delete warehouse. Please try again.',
        statusError: 'Failed to update warehouse status. Please try again.',
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
      warehouses: {
        title: 'إدارة المستودعات',
        description: 'إدارة ومراقبة جميع المستودعات',
        warehouses: 'المستودعات',
        print: 'طباعة',
        export: 'تصدير',
        addWarehouse: 'إضافة مستودع',
        searchWarehouses: 'بحث المستودعات',
        searchPlaceholder: 'ابحث بالاسم، الكود، المدينة...',
        totalWarehouses: 'إجمالي المستودعات',
        activeWarehouses: 'المستودعات النشطة',
        totalCapacity: 'إجمالي السعة',
        utilization: 'معدل الاستخدام',
        status: 'الحالة',
        allStatus: 'كل الحالات',
        city: 'المدينة',
        allCities: 'كل المدن',
        warehouse: 'المستودع',
        location: 'الموقع',
        contact: 'الاتصال',
        capacity: 'السعة',
        utilizationRate: 'معدل الاستخدام',
        shipments: 'الشحنات',
        loadingWarehouses: 'جاري تحميل المستودعات...',
        deleteWarehouse: 'حذف المستودع',
        deleteConfirm: 'هل أنت متأكد من حذف هذا المستودع؟ لا يمكن التراجع عن هذا الإجراء.',
        toggleStatus: 'تغيير الحالة',
        statusConfirm: 'هل أنت متأكد أنك تريد {action} هذا المستودع؟',
        statusChangeSuccess: 'تم تغيير حالة المستودع بنجاح',
        deleteSuccess: 'تم حذف المستودع بنجاح',
        noWarehouses: 'لا توجد مستودعات',
        noWarehousesDescription: 'حاول تعديل بحثك أو الفلتر للعثور على ما تبحث عنه.',
        filterBy: 'تصفية حسب',
        resetFilters: 'إعادة تعيين الفلاتر',
        viewDetails: 'عرض التفاصيل',
        editWarehouse: 'تعديل المستودع',
        code: 'الكود',
        address: 'العنوان',
        manager: 'المدير',
        availableSpace: 'المساحة المتاحة',
        highUtilization: 'استخدام مرتفع',
        moderateUtilization: 'استخدام متوسط',
        lowUtilization: 'استخدام منخفض',
        full: 'ممتلئ',
        almostFull: 'شبه ممتلئ',
        hasSpace: 'يوجد مساحة',
        empty: 'فارغ',
      },
      errors: {
        fetchError: 'فشل تحميل المستودعات. يرجى المحاولة مرة أخرى.',
        deleteError: 'فشل حذف المستودع. يرجى المحاولة مرة أخرى.',
        statusError: 'فشل تحديث حالة المستودع. يرجى المحاولة مرة أخرى.',
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

export default function AdminWarehousesPage() {
  const { locale } = useLocale();
  const router = useRouter();
  
  // State management
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  
  // Stats state
  const [stats, setStats] = useState<WarehouseStats>({
    totalWarehouses: 0,
    activeWarehouses: 0,
    totalCapacity: 0,
    totalCurrentLoad: 0,
    totalUtilization: 0,
    availableSpace: 0,
  });
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const isRTL = locale === 'ar';
  const itemsPerPage = 10;

  // Fetch warehouses and stats on mount
  useEffect(() => {
    fetchWarehouses();
    fetchWarehouseStats();
  }, [currentPage, statusFilter, cityFilter]);

  // Extract unique cities from warehouses
  useEffect(() => {
    const uniqueCities = Array.from(new Set(warehouses.map(w => w.city)));
    setCities(uniqueCities);
  }, [warehouses]);

  // Filter warehouses based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWarehouses(warehouses);
    } else {
      const filtered = warehouses.filter(
        (warehouse) =>
          warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (warehouse.managerName && warehouse.managerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredWarehouses(filtered);
    }
  }, [searchTerm, warehouses]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (cityFilter !== 'ALL') params.append('city', cityFilter);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(`/api/admin/warehouses?${params}`);
      
      if (!response.ok) {
        throw new Error(getTranslation(locale, 'errors.fetchError'));
      }

      const data: WarehousesResponse = await response.json();
      
      setWarehouses(data.warehouses);
      setFilteredWarehouses(data.warehouses);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (error: any) {
      console.error('Error fetching warehouses:', error);
      setError(error.message);
      
      // Fallback to mock data if API fails
      const mockWarehouses = generateMockWarehouses();
      setWarehouses(mockWarehouses);
      setFilteredWarehouses(mockWarehouses);
      setTotalPages(2);
      setTotalCount(15);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch('/api/admin/warehouses/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalWarehouses: data.totalWarehouses || 0,
          activeWarehouses: data.activeWarehouses || 0,
          totalCapacity: data.totalCapacity || 0,
          totalCurrentLoad: data.totalCurrentLoad || 0,
          totalUtilization: data.totalUtilization || 0,
          availableSpace: data.availableSpace || 0,
        });
      } else {
        // Fallback mock stats
        setStats({
          totalWarehouses: 15,
          activeWarehouses: 12,
          totalCapacity: 15000,
          totalCurrentLoad: 11250,
          totalUtilization: 75,
          availableSpace: 3750,
        });
      }
    } catch (error) {
      console.error('Error fetching warehouse stats:', error);
      // Fallback mock stats
      setStats({
        totalWarehouses: 15,
        activeWarehouses: 12,
        totalCapacity: 15000,
        totalCurrentLoad: 11250,
        totalUtilization: 75,
        availableSpace: 3750,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const generateMockWarehouses = (): Warehouse[] => {
    const mockCities = ['Cairo', 'Giza', 'Alexandria', 'Luxor', 'Aswan'];
    return Array.from({ length: 15 }, (_, i) => {
      const city = mockCities[i % mockCities.length];
      const capacity = Math.floor(Math.random() * 2000) + 500;
      const currentLoad = Math.floor(Math.random() * capacity);
      const utilization = Math.round((currentLoad / capacity) * 100);
      
      return {
        id: (i + 1).toString(),
        name: `Warehouse ${i + 1}`,
        code: `WH${(1000 + i).toString().padStart(3, '0')}`,
        address: `${i + 100} Main Street, ${city}`,
        city,
        phone: `+2010000000${(i + 1).toString().padStart(2, '0')}`,
        email: `warehouse${i + 1}@example.com`,
        managerName: `Manager ${i + 1}`,
        latitude: 30.0444 + (Math.random() - 0.5) * 0.1,
        longitude: 31.2357 + (Math.random() - 0.5) * 0.1,
        capacity,
        currentLoad,
        isActive: i % 15 < 12,
        utilization,
        status: i % 15 < 12 ? 'active' : 'inactive',
        statusColor: utilization >= 90 ? 'red' : utilization >= 75 ? 'yellow' : 'green',
        availableSpace: capacity - currentLoad,
        shipmentCount: Math.floor(Math.random() * 200) + 50,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Modal handlers
  const openDeleteModal = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDeleteModal(true);
  };

  const openStatusModal = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowStatusModal(true);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setShowStatusModal(false);
    setSelectedWarehouse(null);
    setModalLoading(false);
  };

  // CRUD Operations
  const handleDelete = async () => {
    if (!selectedWarehouse) return;
    
    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/warehouses/${selectedWarehouse.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || getTranslation(locale, 'errors.deleteError'));
      }

      alert(getTranslation(locale, 'warehouses.deleteSuccess'));
      closeModals();
      fetchWarehouses();
      fetchWarehouseStats();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedWarehouse) return;
    
    try {
      setModalLoading(true);
      const newStatus = !selectedWarehouse.isActive;
      
      const response = await fetch(`/api/admin/warehouses/${selectedWarehouse.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isActive: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || getTranslation(locale, 'errors.statusError'));
      }

      alert(getTranslation(locale, 'warehouses.statusChangeSuccess'));
      closeModals();
      fetchWarehouses();
      fetchWarehouseStats();
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

  const handleCityFilter = (city: string) => {
    setCityFilter(city);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCityFilter('ALL');
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
      label: getTranslation(locale, 'warehouses.totalWarehouses'),
      value: loadingStats ? '...' : stats.totalWarehouses.toLocaleString(),
      icon: Building,
      color: 'bg-blue-500',
      description: getTranslation(locale, 'common.all'),
      change: '+2%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'warehouses.activeWarehouses'),
      value: loadingStats ? '...' : stats.activeWarehouses.toLocaleString(),
      icon: BarChart3,
      color: 'bg-green-500',
      description: getTranslation(locale, 'common.active'),
      change: '+5%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'warehouses.totalCapacity'),
      value: loadingStats ? '...' : stats.totalCapacity.toLocaleString(),
      icon: Package,
      color: 'bg-purple-500',
      description: getTranslation(locale, 'warehouses.capacity'),
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'warehouses.utilization'),
      value: loadingStats ? '...' : `${stats.totalUtilization}%`,
      icon: TrendingUp,
      color: stats.totalUtilization >= 90 ? 'bg-red-500' : 
             stats.totalUtilization >= 75 ? 'bg-yellow-500' : 'bg-teal-500',
      description: getTranslation(locale, 'warehouses.utilizationRate'),
      change: stats.totalUtilization >= 90 ? 'High' : 
              stats.totalUtilization >= 75 ? 'Moderate' : 'Good',
      changeColor: stats.totalUtilization >= 90 ? 'text-red-600' : 
                   stats.totalUtilization >= 75 ? 'text-yellow-600' : 'text-green-600',
    },
  ];

  // Status options
  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'warehouses.allStatus') },
    { value: 'active', label: getTranslation(locale, 'common.active') },
    { value: 'inactive', label: getTranslation(locale, 'common.inactive') },
  ];

  // Get utilization label and color
  const getUtilizationInfo = (utilization: number) => {
    if (utilization >= 90) {
      return {
        label: getTranslation(locale, 'warehouses.full'),
        color: 'bg-red-100 text-red-800',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
      };
    } else if (utilization >= 75) {
      return {
        label: getTranslation(locale, 'warehouses.almostFull'),
        color: 'bg-yellow-100 text-yellow-800',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
      };
    } else if (utilization >= 50) {
      return {
        label: getTranslation(locale, 'warehouses.hasSpace'),
        color: 'bg-green-100 text-green-800',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
      };
    } else {
      return {
        label: getTranslation(locale, 'warehouses.empty'),
        color: 'bg-blue-100 text-blue-800',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
      };
    }
  };

  return (
    <>
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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchWarehouses}
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
              <span>{getTranslation(locale, 'warehouses.filterBy')}</span>
            </button>
            <Link
              href="/admin/warehouses/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(locale, 'warehouses.addWarehouse')}</span>
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
                {getTranslation(locale, 'warehouses.filterBy')}
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {getTranslation(locale, 'warehouses.resetFilters')}
              </button>
            </div>
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
                    onChange={handleSearch}
                    placeholder={getTranslation(locale, 'warehouses.searchPlaceholder')}
                    className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(locale, 'warehouses.status')}
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
                  {getTranslation(locale, 'warehouses.city')}
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => handleCityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="ALL">{getTranslation(locale, 'warehouses.allCities')}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
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

        {/* Warehouses table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'warehouses.loadingWarehouses')}
              </p>
            </div>
          ) : filteredWarehouses.length === 0 ? (
            <div className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getTranslation(locale, 'warehouses.noWarehouses')}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {getTranslation(locale, 'warehouses.noWarehousesDescription')}
              </p>
              {searchTerm || statusFilter !== 'ALL' || cityFilter !== 'ALL' ? (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {getTranslation(locale, 'warehouses.resetFilters')}
                </button>
              ) : (
                <Link
                  href="/admin/warehouses/create"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {getTranslation(locale, 'warehouses.addWarehouse')}
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
                        {getTranslation(locale, 'warehouses.warehouse')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.location')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.contact')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'warehouses.capacity')}
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
                    {filteredWarehouses.map((warehouse) => {
                      const utilInfo = getUtilizationInfo(warehouse.utilization);
                      return (
                        <tr key={warehouse.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                                <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                                  onClick={() => router.push(`/admin/warehouses/${warehouse.id}`)}>
                                  {warehouse.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {getTranslation(locale, 'warehouses.code')}: {warehouse.code}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">{warehouse.city}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {warehouse.address}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {warehouse.managerName && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{warehouse.managerName}</span>
                              </div>
                            )}
                            {warehouse.phone && (
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{warehouse.phone}</span>
                              </div>
                            )}
                            {warehouse.email && (
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-xs">{warehouse.email}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {getTranslation(locale, 'warehouses.capacity')}:
                                </span>
                                <span className="font-medium">{warehouse.capacity}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {getTranslation(locale, 'warehouses.utilization')}:
                                </span>
                                <span className="font-medium">{warehouse.utilization}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {getTranslation(locale, 'warehouses.availableSpace')}:
                                </span>
                                <span className="font-medium text-green-600">{warehouse.availableSpace}</span>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full text-center ${utilInfo.color}`}>
                                {utilInfo.label}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                warehouse.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {warehouse.status === 'active'
                                  ? getTranslation(locale, 'common.active')
                                  : getTranslation(locale, 'common.inactive')}
                              </span>
                              <div className="text-xs text-gray-500">
                                {getTranslation(locale, 'warehouses.shipments')}: {warehouse.shipmentCount}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => router.push(`/admin/warehouses/${warehouse.id}`)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title={getTranslation(locale, 'warehouses.viewDetails')}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/admin/warehouses/${warehouse.id}/edit`)}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title={getTranslation(locale, 'warehouses.editWarehouse')}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openStatusModal(warehouse)}
                                className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                                  warehouse.status === 'active' 
                                    ? 'text-red-600 hover:text-red-800' 
                                    : 'text-green-600 hover:text-green-800'
                                }`}
                                title={getTranslation(locale, 'warehouses.toggleStatus')}
                              >
                                {warehouse.status === 'active' ? (
                                  <AlertCircle className="w-4 h-4" />
                                ) : (
                                  <BarChart3 className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => openDeleteModal(warehouse)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title={getTranslation(locale, 'common.delete')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
      {showDeleteModal && selectedWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getTranslation(locale, 'warehouses.deleteWarehouse')}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {getTranslation(locale, 'warehouses.deleteConfirm')}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedWarehouse.name}</p>
                    <p className="text-sm text-gray-500">{selectedWarehouse.code} - {selectedWarehouse.city}</p>
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
      {showStatusModal && selectedWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  selectedWarehouse.status === 'active' 
                    ? 'bg-red-100' 
                    : 'bg-green-100'
                }`}>
                  {selectedWarehouse.status === 'active' ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getTranslation(locale, 'warehouses.toggleStatus')}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {getTranslation(locale, 'warehouses.statusConfirm').replace(
                  '{action}', 
                  selectedWarehouse.status === 'active' 
                    ? getTranslation(locale, 'common.deactivate')
                    : getTranslation(locale, 'common.activate')
                )}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedWarehouse.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedWarehouse.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedWarehouse.status === 'active'
                          ? getTranslation(locale, 'common.active')
                          : getTranslation(locale, 'common.inactive')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedWarehouse.code} • {selectedWarehouse.city}
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
                  onClick={handleToggleStatus}
                  disabled={modalLoading}
                  className={`px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2 ${
                    selectedWarehouse.status === 'active'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {modalLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {selectedWarehouse.status === 'active'
                    ? getTranslation(locale, 'common.deactivate')
                    : getTranslation(locale, 'common.activate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}