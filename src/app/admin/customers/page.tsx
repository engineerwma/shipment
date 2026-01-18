'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Download,
  Printer,
  Users,
  Calendar,
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
        actions: 'Actions',
        loading: 'Loading...',
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
      },
      customers: {
        title: 'Customers Management',
        description: 'Manage and view all customer information',
        customers: 'Customers',
        print: 'Print',
        export: 'Export',
        addCustomer: 'Add Customer',
        searchCustomers: 'Search Customers',
        searchPlaceholder: 'Search by name, email, phone...',
        totalCustomers: 'Total Customers',
        activeCustomers: 'Active Customers',
        totalRevenue: 'Total Revenue',
        avgOrdersPerCustomer: 'Avg. Orders/Customer',
        city: 'City',
        allCities: 'All Cities',
        status: 'Status',
        allStatus: 'All Status',
        customer: 'Customer',
        contact: 'Contact',
        location: 'Location',
        orders: 'Orders',
        totalSpent: 'Total Spent',
        loadingCustomers: 'Loading customers...',
        lastOrder: 'Last order:',
        loyalCustomer: 'Loyal customer',
        customerDetails: 'Customer Details',
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
        actions: 'الإجراءات',
        loading: 'جاري التحميل...',
        all: 'الكل',
        active: 'نشط',
        inactive: 'غير نشط',
      },
      customers: {
        title: 'إدارة العملاء',
        description: 'إدارة وعرض جميع معلومات العملاء',
        customers: 'العملاء',
        print: 'طباعة',
        export: 'تصدير',
        addCustomer: 'إضافة عميل',
        searchCustomers: 'بحث العملاء',
        searchPlaceholder: 'ابحث بالاسم، البريد، الهاتف...',
        totalCustomers: 'إجمالي العملاء',
        activeCustomers: 'العملاء النشطين',
        totalRevenue: 'إجمالي الإيرادات',
        avgOrdersPerCustomer: 'متوسط الطلبات/عميل',
        city: 'المدينة',
        allCities: 'كل المدن',
        status: 'الحالة',
        allStatus: 'كل الحالات',
        customer: 'العميل',
        contact: 'التواصل',
        location: 'الموقع',
        orders: 'الطلبات',
        totalSpent: 'إجمالي الإنفاق',
        loadingCustomers: 'جاري تحميل العملاء...',
        lastOrder: 'آخر طلب:',
        loyalCustomer: 'عميل مخلص',
        customerDetails: 'تفاصيل العميل',
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

export default function AdminCustomersPage() {
  const { locale } = useLocale();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, cityFilter, statusFilter, customers]);

  const fetchCustomers = async () => {
    try {
      // Mock data for customers
      const mockCustomers = [
        {
          id: '1',
          name: 'Ahmed Mohamed',
          email: 'ahmed@example.com',
          phone: '+201000000001',
          address: '123 Main St, Cairo',
          city: 'Cairo',
          totalOrders: 12,
          totalSpent: 4500,
          lastOrder: '2024-01-15',
          status: 'active',
          joinDate: '2023-01-15',
        },
        {
          id: '2',
          name: 'Sara Ali',
          email: 'sara@example.com',
          phone: '+201000000002',
          address: '456 Nile St, Giza',
          city: 'Giza',
          totalOrders: 8,
          totalSpent: 3200,
          lastOrder: '2024-01-10',
          status: 'active',
          joinDate: '2023-03-20',
        },
        {
          id: '3',
          name: 'Omar Hassan',
          email: 'omar@example.com',
          phone: '+201000000003',
          address: '789 Corniche, Alexandria',
          city: 'Alexandria',
          totalOrders: 5,
          totalSpent: 1800,
          lastOrder: '2024-01-05',
          status: 'active',
          joinDate: '2023-05-10',
        },
        {
          id: '4',
          name: 'Fatima Mahmoud',
          email: 'fatima@example.com',
          phone: '+201000000004',
          address: '321 Market St, Cairo',
          city: 'Cairo',
          totalOrders: 3,
          totalSpent: 950,
          lastOrder: '2024-01-02',
          status: 'inactive',
          joinDate: '2023-02-28',
        },
        {
          id: '5',
          name: 'Khalid Ahmed',
          email: 'khalid@example.com',
          phone: '+201000000005',
          address: '654 University St, Mansoura',
          city: 'Mansoura',
          totalOrders: 7,
          totalSpent: 2100,
          lastOrder: '2023-12-28',
          status: 'active',
          joinDate: '2023-04-15',
        },
        {
          id: '6',
          name: 'Noura Salah',
          email: 'noura@example.com',
          phone: '+201000000006',
          address: '987 Garden City, Cairo',
          city: 'Cairo',
          totalOrders: 15,
          totalSpent: 6200,
          lastOrder: '2024-01-18',
          status: 'active',
          joinDate: '2023-01-10',
        },
        {
          id: '7',
          name: 'Mohamed Ibrahim',
          email: 'mohamed@example.com',
          phone: '+201000000007',
          address: '147 Zamalek, Cairo',
          city: 'Cairo',
          totalOrders: 9,
          totalSpent: 3800,
          lastOrder: '2024-01-12',
          status: 'active',
          joinDate: '2023-03-05',
        },
        {
          id: '8',
          name: 'Hana Youssef',
          email: 'hana@example.com',
          phone: '+201000000008',
          address: '258 Heliopolis, Cairo',
          city: 'Cairo',
          totalOrders: 4,
          totalSpent: 1200,
          lastOrder: '2023-12-15',
          status: 'inactive',
          joinDate: '2023-06-20',
        },
        {
          id: '9',
          name: 'Youssef Ali',
          email: 'youssef@example.com',
          phone: '+201000000009',
          address: '369 Mohandeseen, Giza',
          city: 'Giza',
          totalOrders: 6,
          totalSpent: 1900,
          lastOrder: '2024-01-08',
          status: 'active',
          joinDate: '2023-07-15',
        },
        {
          id: '10',
          name: 'Laila Mohammed',
          email: 'laila@example.com',
          phone: '+201000000010',
          address: '753 Maadi, Cairo',
          city: 'Cairo',
          totalOrders: 11,
          totalSpent: 4100,
          lastOrder: '2024-01-16',
          status: 'active',
          joinDate: '2023-02-10',
        },
      ];

      setTimeout(() => {
        setCustomers(mockCustomers);
        setFilteredCustomers(mockCustomers);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(customer => customer.city === cityFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrders = (customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length).toFixed(1);

  // Get unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(customers.map(c => c.city)));

  const statCards = [
    {
      label: getTranslation(locale, 'customers.totalCustomers'),
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      description: getTranslation(locale, 'common.all'),
      change: '+12%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'customers.activeCustomers'),
      value: activeCustomers,
      icon: Users,
      color: 'bg-green-500',
      description: getTranslation(locale, 'common.active'),
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'customers.totalRevenue'),
      value: `EGP ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      description: getTranslation(locale, 'customers.totalRevenue'),
      change: '+15%',
      changeColor: 'text-green-600',
    },
    {
      label: getTranslation(locale, 'customers.avgOrdersPerCustomer'),
      value: avgOrders,
      icon: Calendar,
      color: 'bg-purple-500',
      description: getTranslation(locale, 'customers.avgOrdersPerCustomer'),
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
              {getTranslation(locale, 'customers.title')}
            </h1>
            <p className="text-gray-600">
              {getTranslation(locale, 'customers.description')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>{getTranslation(locale, 'customers.print')}</span>
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{getTranslation(locale, 'customers.export')}</span>
            </button>
            <Link
              href="/admin/customers/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{getTranslation(locale, 'customers.addCustomer')}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'customers.searchCustomers')}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(locale, 'customers.searchPlaceholder')}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'customers.city')}
              </label>
              <select 
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input w-full"
              >
                <option value="">{getTranslation(locale, 'customers.allCities')}</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'customers.status')}
              </label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                <option value="">{getTranslation(locale, 'customers.allStatus')}</option>
                <option value="active">{getTranslation(locale, 'common.active')}</option>
                <option value="inactive">{getTranslation(locale, 'common.inactive')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'customers.loadingCustomers')}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'customers.customer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'customers.contact')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'customers.location')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'customers.orders')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'customers.totalSpent')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'customers.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {customer.name
  .split(' ')
  .map((n: string) => n[0])
  .join('')}
                              </span>
                            </div>
                            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                              <div className="font-medium text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: CUST-{customer.id.padStart(4, '0')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{customer.city}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {customer.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{customer.totalOrders}</div>
                          <div className="text-xs text-gray-500">
                            {getTranslation(locale, 'customers.lastOrder')} {customer.lastOrder}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            EGP {customer.totalSpent.toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600">
                            {getTranslation(locale, 'customers.loyalCustomer')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            customer.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {customer.status === 'active'
                              ? getTranslation(locale, 'common.active')
                              : getTranslation(locale, 'common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/customers/${customer.id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title={getTranslation(locale, 'common.view')}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/customers/${customer.id}/edit`}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                            >
                              {getTranslation(locale, 'common.edit')}
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredCustomers.length > itemsPerPage && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {(currentPage - 1) * itemsPerPage + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      filteredCustomers.length
                    )} {getTranslation(locale, 'common.of')} {filteredCustomers.length} {getTranslation(locale, 'common.results')}
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
                          p < Math.ceil(filteredCustomers.length / itemsPerPage)
                            ? p + 1
                            : p
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(filteredCustomers.length / itemsPerPage)
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