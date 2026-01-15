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
  Building,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  TrendingUp,
  CreditCard,
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
      },
      merchants: {
        title: 'Merchants Management',
        description: 'Manage and monitor all registered merchants',
        merchants: 'Merchants',
        print: 'Print',
        export: 'Export',
        addMerchant: 'Add Merchant',
        searchMerchants: 'Search Merchants',
        searchPlaceholder: 'Search by name, company, email...',
        totalMerchants: 'Total Merchants',
        activeMerchants: 'Active Merchants',
        totalRevenue: 'Total Revenue',
        pendingBalance: 'Pending Balance',
        status: 'Status',
        allStatus: 'All Status',
        city: 'City',
        allCities: 'All Cities',
        merchant: 'Merchant',
        contactAndLocation: 'Contact & Location',
        performance: 'Performance',
        financial: 'Financial',
        loadingMerchants: 'Loading merchants...',
        shipments: 'Shipments:',
        pending: 'Pending:',
        rating: 'Rating:',
        commission: 'Commission:',
        revenue: 'Revenue:',
        balance: 'Balance:',
        joined: 'Joined:',
        contact: 'Contact:',
        deleteMerchant: 'Delete this merchant?',
        toggleStatus: 'Are you sure you want to {action} this merchant?',
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
      },
      merchants: {
        title: 'إدارة التجار',
        description: 'إدارة ومراقبة جميع التجار المسجلين',
        merchants: 'التجار',
        print: 'طباعة',
        export: 'تصدير',
        addMerchant: 'إضافة تاجر',
        searchMerchants: 'بحث التجار',
        searchPlaceholder: 'ابحث بالاسم، الشركة، البريد...',
        totalMerchants: 'إجمالي التجار',
        activeMerchants: 'التجار النشطين',
        totalRevenue: 'إجمالي الإيرادات',
        pendingBalance: 'الرصيد المعلق',
        status: 'الحالة',
        allStatus: 'كل الحالات',
        city: 'المدينة',
        allCities: 'كل المدن',
        merchant: 'التاجر',
        contactAndLocation: 'التواصل والموقع',
        performance: 'الأداء',
        financial: 'المالية',
        loadingMerchants: 'جاري تحميل التجار...',
        shipments: 'الشحنات:',
        pending: 'معلق:',
        rating: 'التقييم:',
        commission: 'العمولة:',
        revenue: 'الإيرادات:',
        balance: 'الرصيد:',
        joined: 'تاريخ الانضمام:',
        contact: 'جهة الاتصال:',
        deleteMerchant: 'حذف هذا التاجر؟',
        toggleStatus: 'هل أنت متأكد أنك تريد {action} هذا التاجر؟',
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

export default function AdminMerchantsPage() {
  const { locale } = useLocale();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    filterMerchants();
  }, [searchTerm, statusFilter, cityFilter, merchants]);

  const fetchMerchants = async () => {
    try {
      // Mock data for merchants
      const mockMerchants = [
        {
          id: '1',
          name: 'Ahmed Store',
          companyName: 'Ahmed Trading Co.',
          email: 'ahmed@store.com',
          phone: '+201000000021',
          address: '123 Market St, Cairo',
          city: 'Cairo',
          status: 'active',
          commissionRate: 10,
          totalShipments: 245,
          pendingShipments: 12,
          revenue: 125000,
          balance: 25000,
          joinedDate: '2023-01-10',
          rating: 4.8,
          contactPerson: 'Ahmed Mohamed',
        },
        {
          id: '2',
          name: 'Tech Zone',
          companyName: 'Tech Zone Electronics',
          email: 'info@techzone.com',
          phone: '+201000000022',
          address: '456 Tech St, Giza',
          city: 'Giza',
          status: 'active',
          commissionRate: 12,
          totalShipments: 189,
          pendingShipments: 8,
          revenue: 98000,
          balance: 18000,
          joinedDate: '2023-03-05',
          rating: 4.6,
          contactPerson: 'Sara Ali',
        },
        {
          id: '3',
          name: 'Fashion Hub',
          companyName: 'Fashion Hub Retail',
          email: 'sales@fashionhub.com',
          phone: '+201000000023',
          address: '789 Fashion St, Alexandria',
          city: 'Alexandria',
          status: 'active',
          commissionRate: 8,
          totalShipments: 312,
          pendingShipments: 15,
          revenue: 162000,
          balance: 32000,
          joinedDate: '2022-11-15',
          rating: 4.9,
          contactPerson: 'Omar Hassan',
        },
        {
          id: '4',
          name: 'Book World',
          companyName: 'Book World Publishers',
          email: 'contact@bookworld.com',
          phone: '+201000000024',
          address: '321 Book St, Cairo',
          city: 'Cairo',
          status: 'inactive',
          commissionRate: 15,
          totalShipments: 156,
          pendingShipments: 5,
          revenue: 72000,
          balance: 12000,
          joinedDate: '2023-05-25',
          rating: 4.4,
          contactPerson: 'Fatima Mahmoud',
        },
        {
          id: '5',
          name: 'Home Essentials',
          companyName: 'Home Essentials Ltd.',
          email: 'support@homeessentials.com',
          phone: '+201000000025',
          address: '654 Home St, Mansoura',
          city: 'Mansoura',
          status: 'active',
          commissionRate: 9,
          totalShipments: 278,
          pendingShipments: 18,
          revenue: 138000,
          balance: 28000,
          joinedDate: '2022-12-20',
          rating: 4.7,
          contactPerson: 'Khalid Ahmed',
        },
        {
          id: '6',
          name: 'Gadget Store',
          companyName: 'Gadget Store Electronics',
          email: 'sales@gadgetstore.com',
          phone: '+201000000026',
          address: '987 Gadget St, Cairo',
          city: 'Cairo',
          status: 'active',
          commissionRate: 11,
          totalShipments: 201,
          pendingShipments: 10,
          revenue: 105000,
          balance: 21000,
          joinedDate: '2023-04-18',
          rating: 4.5,
          contactPerson: 'Noura Salah',
        },
        {
          id: '7',
          name: 'Style Boutique',
          companyName: 'Style Boutique Fashion',
          email: 'info@styleboutique.com',
          phone: '+201000000027',
          address: '147 Style St, Giza',
          city: 'Giza',
          status: 'active',
          commissionRate: 7,
          totalShipments: 167,
          pendingShipments: 7,
          revenue: 89000,
          balance: 17000,
          joinedDate: '2023-06-30',
          rating: 4.3,
          contactPerson: 'Mohamed Ibrahim',
        },
        {
          id: '8',
          name: 'Sports Gear',
          companyName: 'Sports Gear Co.',
          email: 'contact@sportsgear.com',
          phone: '+201000000028',
          address: '258 Sports St, Cairo',
          city: 'Cairo',
          status: 'inactive',
          commissionRate: 14,
          totalShipments: 98,
          pendingShipments: 3,
          revenue: 51000,
          balance: 10000,
          joinedDate: '2023-08-28',
          rating: 4.2,
          contactPerson: 'Hana Youssef',
        },
        {
          id: '9',
          name: 'Kitchen Pro',
          companyName: 'Kitchen Pro Appliances',
          email: 'sales@kitchenpro.com',
          phone: '+201000000029',
          address: '369 Kitchen St, Alexandria',
          city: 'Alexandria',
          status: 'active',
          commissionRate: 10,
          totalShipments: 223,
          pendingShipments: 14,
          revenue: 116000,
          balance: 23000,
          joinedDate: '2023-02-14',
          rating: 4.7,
          contactPerson: 'Youssef Ali',
        },
        {
          id: '10',
          name: 'Beauty Store',
          companyName: 'Beauty Store Cosmetics',
          email: 'info@beautystore.com',
          phone: '+201000000030',
          address: '753 Beauty St, Cairo',
          city: 'Cairo',
          status: 'active',
          commissionRate: 13,
          totalShipments: 189,
          pendingShipments: 9,
          revenue: 99000,
          balance: 19000,
          joinedDate: '2023-07-22',
          rating: 4.6,
          contactPerson: 'Laila Mohammed',
        },
      ];

      setTimeout(() => {
        setMerchants(mockMerchants);
        setFilteredMerchants(mockMerchants);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setLoading(false);
    }
  };

  const filterMerchants = () => {
    let filtered = merchants;

    if (searchTerm) {
      filtered = filtered.filter(
        (merchant) =>
          merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          merchant.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          merchant.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (merchant) => merchant.status === statusFilter
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(merchant => merchant.city === cityFilter);
    }

    setFilteredMerchants(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm(getTranslation(locale, 'merchants.deleteMerchant'))) {
      try {
        console.log('Deleting merchant:', id);
        fetchMerchants();
      } catch (error) {
        console.error('Error deleting merchant:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' 
      ? getTranslation(locale, 'common.activate')
      : getTranslation(locale, 'common.deactivate');
    
    const confirmMessage = getTranslation(locale, 'merchants.toggleStatus')
      .replace('{action}', actionText);
    
    if (confirm(confirmMessage)) {
      try {
        console.log('Updating merchant status:', id, newStatus);
        fetchMerchants();
      } catch (error) {
        console.error('Error updating merchant status:', error);
      }
    }
  };

  const paginatedMerchants = filteredMerchants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter(m => m.status === 'active').length;
  const totalRevenue = merchants.reduce((sum, m) => sum + m.revenue, 0);
  const totalBalance = merchants.reduce((sum, m) => sum + m.balance, 0);

  // Get unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(merchants.map(m => m.city)));

  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'merchants.allStatus') },
    { value: 'active', label: getTranslation(locale, 'common.active') },
    { value: 'inactive', label: getTranslation(locale, 'common.inactive') },
  ];

  const statCards = [
    {
      label: getTranslation(locale, 'merchants.totalMerchants'),
      value: totalMerchants,
      icon: Building,
      color: 'bg-blue-500',
      description: getTranslation(locale, 'common.all'),
      change: '+12%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'merchants.activeMerchants'),
      value: activeMerchants,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: getTranslation(locale, 'common.active'),
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'merchants.totalRevenue'),
      value: `EGP ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      description: getTranslation(locale, 'merchants.totalRevenue'),
      change: '+15%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'merchants.pendingBalance'),
      value: `EGP ${totalBalance.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-purple-500',
      description: getTranslation(locale, 'merchants.pendingBalance'),
      change: '+5%',
      changeColor: 'text-green-600',
    },
  ];

  return (
   
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getTranslation(locale, 'merchants.title')}
            </h1>
            <p className="text-gray-600">
              {getTranslation(locale, 'merchants.description')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>{getTranslation(locale, 'merchants.print')}</span>
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{getTranslation(locale, 'merchants.export')}</span>
            </button>
            <Link
              href="/admin/merchants/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{getTranslation(locale, 'merchants.addMerchant')}</span>
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
                {getTranslation(locale, 'merchants.searchMerchants')}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(locale, 'merchants.searchPlaceholder')}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'merchants.status')}
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
                {getTranslation(locale, 'merchants.city')}
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input w-full"
              >
                <option value="">{getTranslation(locale, 'merchants.allCities')}</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Merchants table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'merchants.loadingMerchants')}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'merchants.merchant')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'merchants.contactAndLocation')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'merchants.performance')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'merchants.financial')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'merchants.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedMerchants.map((merchant) => (
                      <tr key={merchant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Building className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                              <div className="font-medium text-gray-900">
                                {merchant.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {merchant.companyName}
                              </div>
                              <div className="text-xs text-gray-400">
                                ID: MCH-{merchant.id.padStart(4, '0')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{merchant.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{merchant.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-xs">{merchant.city}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {getTranslation(locale, 'merchants.contact')} {merchant.contactPerson}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'merchants.shipments')}
                              </span>
                              <span className="font-medium">{merchant.totalShipments}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'merchants.pending')}
                              </span>
                              <span className="font-medium text-yellow-600">{merchant.pendingShipments}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'merchants.rating')}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="font-medium">{merchant.rating}</span>
                                <span className="text-gray-400 text-xs">/5</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'merchants.commission')}
                              </span>
                              <span className="font-medium text-purple-600">{merchant.commissionRate}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'merchants.revenue')}
                              </span>
                              <div className="font-medium">
                                EGP {merchant.revenue.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">
                                {getTranslation(locale, 'merchants.balance')}
                              </span>
                              <div className="font-medium text-green-600">
                                EGP {merchant.balance.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {getTranslation(locale, 'merchants.joined')} {merchant.joinedDate}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            merchant.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {merchant.status === 'active'
                              ? getTranslation(locale, 'common.active')
                              : getTranslation(locale, 'common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/merchants/${merchant.id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title={getTranslation(locale, 'common.view')}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/merchants/${merchant.id}/edit`}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title={getTranslation(locale, 'common.edit')}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(merchant.id, merchant.status)}
                              className={`p-2 rounded hover:bg-gray-100 ${
                                merchant.status === 'active' 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={merchant.status === 'active' 
                                ? getTranslation(locale, 'common.deactivate')
                                : getTranslation(locale, 'common.activate')}
                            >
                              {merchant.status === 'active' ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(merchant.id)}
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
              {filteredMerchants.length > itemsPerPage && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {(currentPage - 1) * itemsPerPage + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      filteredMerchants.length
                    )} {getTranslation(locale, 'common.of')} {filteredMerchants.length} {getTranslation(locale, 'common.results')}
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
                          p < Math.ceil(filteredMerchants.length / itemsPerPage)
                            ? p + 1
                            : p
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(filteredMerchants.length / itemsPerPage)
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