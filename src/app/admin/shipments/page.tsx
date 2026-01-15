'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Printer,
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '../../../app/contexts/LocaleContext';

// Simple translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
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
      common: {
        shipments: 'Shipments',
        actions: 'Actions',
        loading: 'Loading...',
        trackingNumber: 'Tracking #',
        customer: 'Customer',
        merchant: 'Merchant',
        status: 'Status',
        amount: 'Amount',
        date: 'Date',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        allStatus: 'All Status',
        dateRange: 'Date Range',
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
      },
      shipments: {
        title: 'Shipments Management',
        description: 'Manage and track all shipments',
        printReport: 'Print Report',
        export: 'Export',
        newShipment: 'New Shipment',
        searchPlaceholder: 'Search by tracking, customer...',
        total: 'Total',
        withDriver: 'With Driver',
        deliveredToday: 'Delivered Today',
        pending: 'Pending',
        loadingShipments: 'Loading shipments...',
        confirmDelete: 'Delete this shipment?',
      },
    },
    ar: {
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
      common: {
        shipments: 'الشحنات',
        actions: 'الإجراءات',
        loading: 'جاري التحميل...',
        trackingNumber: 'رقم التتبع',
        customer: 'العميل',
        merchant: 'التاجر',
        status: 'الحالة',
        amount: 'المبلغ',
        date: 'التاريخ',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        search: 'بحث',
        allStatus: 'كل الحالات',
        dateRange: 'النطاق الزمني',
        previous: 'السابق',
        next: 'التالي',
        showing: 'عرض',
        to: 'إلى',
        of: 'من',
        results: 'نتيجة',
      },
      shipments: {
        title: 'إدارة الشحنات',
        description: 'إدارة وتتبع جميع الشحنات',
        printReport: 'طباعة تقرير',
        export: 'تصدير',
        newShipment: 'شحنة جديدة',
        searchPlaceholder: 'ابحث برقم التتبع، العميل...',
        total: 'الإجمالي',
        withDriver: 'مع السائق',
        deliveredToday: 'تم التسليم اليوم',
        pending: 'معلق',
        loadingShipments: 'جاري تحميل الشحنات...',
        confirmDelete: 'حذف هذه الشحنة؟',
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

export default function AdminShipmentsPage() {
  const { locale } = useLocale();
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [searchTerm, statusFilter, shipments]);

  const fetchShipments = async () => {
    try {
      // Mock data for now
      const mockShipments = [
        {
          id: '1',
          trackingNumber: 'TRK0012345',
          barcode: 'BAR12345',
          customerName: 'Ahmed Mohamed',
          customerPhone: '+201000000001',
          customerCity: 'Cairo',
          status: 'DELIVERED',
          shippingCost: 150,
          codAmount: 500,
          createdAt: new Date('2024-01-15'),
          merchant: {
            name: 'Tech Store',
            companyName: 'Tech Store LLC',
          },
          driver: {
            name: 'Mohamed Ali',
          },
        },
        {
          id: '2',
          trackingNumber: 'TRK0012346',
          barcode: 'BAR12346',
          customerName: 'Sara Ali',
          customerPhone: '+201000000002',
          customerCity: 'Alexandria',
          status: 'WITH_DRIVER',
          shippingCost: 120,
          codAmount: 300,
          createdAt: new Date('2024-01-14'),
          merchant: {
            name: 'Fashion Shop',
            companyName: 'Fashion Shop Co.',
          },
          driver: {
            name: 'Omar Hassan',
          },
        },
        {
          id: '3',
          trackingNumber: 'TRK0012347',
          barcode: 'BAR12347',
          customerName: 'Omar Hassan',
          customerPhone: '+201000000003',
          customerCity: 'Giza',
          status: 'IN_WAREHOUSE',
          shippingCost: 90,
          codAmount: 0,
          createdAt: new Date('2024-01-13'),
          merchant: {
            name: 'Book Store',
            companyName: 'Books R Us',
          },
          driver: null,
        },
        {
          id: '4',
          trackingNumber: 'TRK0012348',
          barcode: 'BAR12348',
          customerName: 'Fatima Mahmoud',
          customerPhone: '+201000000004',
          customerCity: 'Cairo',
          status: 'NEW',
          shippingCost: 110,
          codAmount: 200,
          createdAt: new Date('2024-01-12'),
          merchant: {
            name: 'Electronics Store',
            companyName: 'Electronics Co.',
          },
          driver: null,
        },
        {
          id: '5',
          trackingNumber: 'TRK0012349',
          barcode: 'BAR12349',
          customerName: 'Khalid Ahmed',
          customerPhone: '+201000000005',
          customerCity: 'Alexandria',
          status: 'DELIVERED',
          shippingCost: 85,
          codAmount: 150,
          createdAt: new Date('2024-01-11'),
          merchant: {
            name: 'Home Goods',
            companyName: 'Home Goods Ltd.',
          },
          driver: {
            name: 'Ahmed Sami',
          },
        },
        {
          id: '6',
          trackingNumber: 'TRK0012350',
          barcode: 'BAR12350',
          customerName: 'Nadia Salem',
          customerPhone: '+201000000006',
          customerCity: 'Port Said',
          status: 'DELIVERY_FAILED',
          shippingCost: 95,
          codAmount: 180,
          createdAt: new Date('2024-01-10'),
          merchant: {
            name: 'Sports Gear',
            companyName: 'Sports Gear Inc.',
          },
          driver: {
            name: 'Youssef Ahmed',
          },
        },
        {
          id: '7',
          trackingNumber: 'TRK0012351',
          barcode: 'BAR12351',
          customerName: 'Mahmoud Khalil',
          customerPhone: '+201000000007',
          customerCity: 'Luxor',
          status: 'RETURNED',
          shippingCost: 120,
          codAmount: 400,
          createdAt: new Date('2024-01-09'),
          merchant: {
            name: 'Jewelry Store',
            companyName: 'Golden Jewelry',
          },
          driver: {
            name: 'Hassan Omar',
          },
        },
        {
          id: '8',
          trackingNumber: 'TRK0012352',
          barcode: 'BAR12352',
          customerName: 'Layla Mostafa',
          customerPhone: '+201000000008',
          customerCity: 'Aswan',
          status: 'PARTIAL_RETURNED',
          shippingCost: 130,
          codAmount: 250,
          createdAt: new Date('2024-01-08'),
          merchant: {
            name: 'Perfume Shop',
            companyName: 'Scents & Aromas',
          },
          driver: {
            name: 'Karim Mohamed',
          },
        },
        {
          id: '9',
          trackingNumber: 'TRK0012353',
          barcode: 'BAR12353',
          customerName: 'Ramy Adel',
          customerPhone: '+201000000009',
          customerCity: 'Suez',
          status: 'IN_RECEIPT',
          shippingCost: 75,
          codAmount: 120,
          createdAt: new Date('2024-01-07'),
          merchant: {
            name: 'Toy Store',
            companyName: 'Kids World',
          },
          driver: null,
        },
        {
          id: '10',
          trackingNumber: 'TRK0012354',
          barcode: 'BAR12354',
          customerName: 'Hala Nasser',
          customerPhone: '+201000000010',
          customerCity: 'Ismailia',
          status: 'DELIVERED',
          shippingCost: 110,
          codAmount: 320,
          createdAt: new Date('2024-01-06'),
          merchant: {
            name: 'Furniture Store',
            companyName: 'Home Comfort',
          },
          driver: {
            name: 'Said Mahmoud',
          },
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setShipments(mockShipments);
        setFilteredShipments(mockShipments);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      setLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerPhone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (shipment) => shipment.status === statusFilter
      );
    }

    setFilteredShipments(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm(getTranslation(locale, 'shipments.confirmDelete'))) {
      try {
        // In a real app, call API here
        console.log('Deleting shipment:', id);
        fetchShipments(); // Refresh data
      } catch (error) {
        console.error('Error deleting shipment:', error);
      }
    }
  };

  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'common.allStatus') },
    { value: 'NEW', label: getTranslation(locale, 'status.NEW') },
    { value: 'IN_RECEIPT', label: getTranslation(locale, 'status.IN_RECEIPT') },
    { value: 'IN_WAREHOUSE', label: getTranslation(locale, 'status.IN_WAREHOUSE') },
    { value: 'WITH_DRIVER', label: getTranslation(locale, 'status.WITH_DRIVER') },
    { value: 'DELIVERED', label: getTranslation(locale, 'status.DELIVERED') },
    { value: 'DELIVERY_FAILED', label: getTranslation(locale, 'status.DELIVERY_FAILED') },
    { value: 'RETURNED', label: getTranslation(locale, 'status.RETURNED') },
    { value: 'PARTIAL_RETURNED', label: getTranslation(locale, 'status.PARTIAL_RETURNED') },
  ];

  const statCards = [
    { 
      label: getTranslation(locale, 'shipments.total'), 
      value: shipments.length, 
      icon: Package, 
      color: 'bg-blue-500',
      description: locale === 'en' ? 'Total shipments' : 'إجمالي الشحنات'
    },
    { 
      label: getTranslation(locale, 'shipments.withDriver'), 
      value: shipments.filter((s) => s.status === 'WITH_DRIVER').length, 
      icon: Truck, 
      color: 'bg-indigo-500',
      description: locale === 'en' ? 'Currently with drivers' : 'حالياً مع السائقين'
    },
    { 
      label: getTranslation(locale, 'shipments.deliveredToday'), 
      value: 24, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      description: locale === 'en' ? 'Delivered today' : 'تم التسليم اليوم'
    },
    { 
      label: getTranslation(locale, 'shipments.pending'), 
      value: shipments.filter((s) => s.status === 'NEW').length, 
      icon: Clock, 
      color: 'bg-yellow-500',
      description: locale === 'en' ? 'Awaiting processing' : 'في انتظار المعالجة'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return CheckCircle;
      case 'WITH_DRIVER': return Truck;
      case 'IN_WAREHOUSE': return Package;
      case 'NEW': return Clock;
      case 'DELIVERY_FAILED': return XCircle;
      case 'RETURNED': return Clock;
      case 'PARTIAL_RETURNED': return Clock;
      case 'IN_RECEIPT': return Package;
      default: return Package;
    }
  };

  return (
   
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getTranslation(locale, 'shipments.title')}
            </h1>
            <p className="text-gray-600">
              {getTranslation(locale, 'shipments.description')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>{getTranslation(locale, 'shipments.printReport')}</span>
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{getTranslation(locale, 'shipments.export')}</span>
            </button>
            <Link
              href="/admin/shipments/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(locale, 'shipments.newShipment')}</span>
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
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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
                {getTranslation(locale, 'common.search')}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(locale, 'shipments.searchPlaceholder')}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'common.status')}
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
                {getTranslation(locale, 'common.dateRange')}
              </label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="input flex-1" 
                  dir="ltr"
                />
                <span className="self-center text-gray-500">
                  {getTranslation(locale, 'common.to')}
                </span>
                <input 
                  type="date" 
                  className="input flex-1" 
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipments table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'shipments.loadingShipments')}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.trackingNumber')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.customer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.merchant')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedShipments.map((shipment) => {
                      const StatusIcon = getStatusIcon(shipment.status);
                      return (
                        <tr key={shipment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono font-medium text-blue-600">
                              {shipment.trackingNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {shipment.barcode}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{shipment.customerName}</div>
                            <div className="text-sm text-gray-500">
                              {shipment.customerPhone}
                            </div>
                            <div className="text-xs text-gray-400">
                              {shipment.customerCity}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{shipment.merchant?.name}</div>
                            <div className="text-sm text-gray-500">
                              {shipment.merchant?.companyName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                shipment.status
                              )}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {getTranslation(locale, `status.${shipment.status}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">
                              EGP {shipment.shippingCost}
                            </div>
                            {shipment.codAmount > 0 && (
                              <div className="text-xs text-green-600">
                                COD: EGP {shipment.codAmount}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(shipment.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/shipments/${shipment.id}`}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title={getTranslation(locale, 'common.view')}
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/admin/shipments/${shipment.id}/edit`}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title={getTranslation(locale, 'common.edit')}
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(shipment.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
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
              {filteredShipments.length > itemsPerPage && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {(currentPage - 1) * itemsPerPage + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      filteredShipments.length
                    )} {getTranslation(locale, 'common.of')} {filteredShipments.length} {getTranslation(locale, 'common.results')}
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
                          p < Math.ceil(filteredShipments.length / itemsPerPage)
                            ? p + 1
                            : p
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.ceil(filteredShipments.length / itemsPerPage)
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