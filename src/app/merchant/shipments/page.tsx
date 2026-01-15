'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  Plus,
  BarChart3,
} from 'lucide-react';
import { useTranslation, type Locale } from '@/lib/i18n';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function MerchantShipmentsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { t, isRTL } = useTranslation(locale);

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [searchTerm, statusFilter, shipments]);

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/merchant/shipments');
      const data = await response.json();
      setShipments(data);
      setFilteredShipments(data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(
        (shipment: any) =>
          shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerPhone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (shipment: any) => shipment.status === statusFilter
      );
    }

    setFilteredShipments(filtered);
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: 'ALL', label: locale === 'en' ? 'All Status' : 'كل الحالات' },
    { value: 'NEW', label: t('status.NEW') },
    { value: 'IN_RECEIPT', label: t('status.IN_RECEIPT') },
    { value: 'IN_WAREHOUSE', label: t('status.IN_WAREHOUSE') },
    { value: 'WITH_DRIVER', label: t('status.WITH_DRIVER') },
    { value: 'DELIVERED', label: t('status.DELIVERED') },
    { value: 'DELIVERY_FAILED', label: t('status.DELIVERY_FAILED') },
    { value: 'RETURNED', label: t('status.RETURNED') },
  ];

  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const shipmentStats = {
    total: shipments.length,
    delivered: shipments.filter((s: any) => s.status === 'DELIVERED').length,
    inTransit: shipments.filter((s: any) => 
      ['IN_RECEIPT', 'IN_WAREHOUSE', 'WITH_DRIVER'].includes(s.status)
    ).length,
    pending: shipments.filter((s: any) => s.status === 'NEW').length,
  };

  return (
    <DashboardLayout
      role="MERCHANT"
      locale={locale}
      onLocaleChange={setLocale}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t('navigation.shipments')}
            </h1>
            <p className="text-gray-600">
              {locale === 'en'
                ? 'Manage and track your shipments'
                : 'إدارة وتتبع شحناتك'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>{locale === 'en' ? 'Print' : 'طباعة'}</span>
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{locale === 'en' ? 'Export' : 'تصدير'}</span>
            </button>
            <Link
              href="/merchant/shipments/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'en' ? 'New Shipment' : 'شحنة جديدة'}</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'Total' : 'الإجمالي'}</p>
                <p className="text-2xl font-bold">{shipmentStats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'Delivered' : 'تم التسليم'}</p>
                <p className="text-2xl font-bold text-green-600">{shipmentStats.delivered}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'In Transit' : 'قيد النقل'}</p>
                <p className="text-2xl font-bold text-yellow-600">{shipmentStats.inTransit}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'Pending' : 'معلق'}</p>
                <p className="text-2xl font-bold text-red-600">{shipmentStats.pending}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Search' : 'بحث'}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={locale === 'en' ? 'Search shipments...' : 'ابحث في الشحنات...'}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Status' : 'الحالة'}
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
                {locale === 'en' ? 'Date' : 'التاريخ'}
              </label>
              <input type="date" className="input w-full" />
            </div>
          </div>
        </div>

        {/* Shipments table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto"></div>
              <p className="text-gray-600 mt-2">
                {locale === 'en' ? 'Loading shipments...' : 'جاري تحميل الشحنات...'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'en' ? 'Tracking #' : 'رقم التتبع'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'en' ? 'Customer' : 'العميل'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'en' ? 'Destination' : 'الوجهة'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'en' ? 'Status' : 'الحالة'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'en' ? 'Amount' : 'المبلغ'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'en' ? 'Date' : 'التاريخ'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedShipments.map((shipment: any) => (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono font-medium text-blue-600">
                            {shipment.trackingNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{shipment.customerName}</div>
                          <div className="text-sm text-gray-500">
                            {shipment.customerPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">{shipment.customerCity}</div>
                          <div className="text-xs text-gray-500">
                            {shipment.customerZone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              shipment.status
                            )}`}
                          >
                            {t(`status.${shipment.status}`)}
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
                          {new Date(shipment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/merchant/shipments/${shipment.id}`}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title={locale === 'en' ? 'View' : 'عرض'}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/merchant/shipments/${shipment.id}/track`}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              {locale === 'en' ? 'Track' : 'تتبع'}
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredShipments.length > itemsPerPage && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {locale === 'en'
                      ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                          currentPage * itemsPerPage,
                          filteredShipments.length
                        )} of ${filteredShipments.length} results`
                      : `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(
                          currentPage * itemsPerPage,
                          filteredShipments.length
                        )} من ${filteredShipments.length} نتيجة`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      {locale === 'en' ? 'Previous' : 'السابق'}
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
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      {locale === 'en' ? 'Next' : 'التالي'}
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