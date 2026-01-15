'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Navigation,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
} from 'lucide-react';
import { useTranslation, type Locale } from '@/lib/i18n';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function DriverShipmentsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { t, isRTL } = useTranslation(locale);

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [searchTerm, statusFilter, shipments]);

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/driver/shipments');
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
          shipment.customerAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (shipment: any) => shipment.status === statusFilter
      );
    }

    setFilteredShipments(filtered);
  };

  const handleStatusUpdate = async (shipmentId: string, status: string) => {
    try {
      await fetch(`/api/driver/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchShipments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusOptions = [
    { value: 'ALL', label: locale === 'en' ? 'All Status' : 'كل الحالات' },
    { value: 'WITH_DRIVER', label: t('status.WITH_DRIVER') },
    { value: 'DELIVERED', label: t('status.DELIVERED') },
    { value: 'DELIVERY_FAILED', label: t('status.DELIVERY_FAILED') },
    { value: 'RETURNED', label: t('status.RETURNED') },
  ];

  const shipmentStats = {
    total: shipments.length,
    withDriver: shipments.filter((s: any) => s.status === 'WITH_DRIVER').length,
    delivered: shipments.filter((s: any) => s.status === 'DELIVERED').length,
    failed: shipments.filter((s: any) => s.status === 'DELIVERY_FAILED').length,
  };

  return (
    <DashboardLayout
      role="DRIVER"
      locale={locale}
      onLocaleChange={setLocale}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {locale === 'en' ? 'My Shipments' : 'شحناتي'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en'
              ? 'Manage and update shipment status'
              : 'إدارة وتحديث حالة الشحنات'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'Total' : 'الإجمالي'}</p>
                <p className="text-2xl font-bold">{shipmentStats.total}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'With Me' : 'معي'}</p>
                <p className="text-2xl font-bold text-indigo-600">{shipmentStats.withDriver}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'Delivered' : 'تم التسليم'}</p>
                <p className="text-2xl font-bold text-green-600">{shipmentStats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{locale === 'en' ? 'Failed' : 'فشل'}</p>
                <p className="text-2xl font-bold text-red-600">{shipmentStats.failed}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
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

        {/* Shipments list */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto"></div>
              <p className="text-gray-600 mt-2">
                {locale === 'en' ? 'Loading shipments...' : 'جاري تحميل الشحنات...'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredShipments.map((shipment: any) => (
                <div key={shipment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-medium text-blue-600">
                              {shipment.trackingNumber}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                shipment.status
                              )}`}
                            >
                              {t(`status.${shipment.status}`)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-gray-500">
                                {locale === 'en' ? 'Customer' : 'العميل'}
                              </div>
                              <div className="font-medium">
                                {shipment.customerName}
                              </div>
                              <div className="text-gray-600">
                                {shipment.customerPhone}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">
                                {locale === 'en' ? 'Address' : 'العنوان'}
                              </div>
                              <div className="font-medium">
                                {shipment.customerAddress}
                              </div>
                              <div className="text-gray-600">
                                {shipment.customerCity}, {shipment.customerZone}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">
                                {locale === 'en' ? 'Amount' : 'المبلغ'}
                              </div>
                              <div className="font-medium">
                                EGP {shipment.shippingCost}
                              </div>
                              {shipment.codAmount > 0 && (
                                <div className="text-green-600">
                                  COD: EGP {shipment.codAmount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => window.open(`https://maps.google.com/?q=${shipment.customerAddress}`)}
                        className="btn btn-secondary flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        {locale === 'en' ? 'Navigate' : 'التوجيه'}
                      </button>
                      
                      {shipment.status === 'WITH_DRIVER' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleStatusUpdate(shipment.id, 'DELIVERED')}
                            className="btn btn-success flex items-center justify-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {locale === 'en' ? 'Delivered' : 'تم التسليم'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(shipment.id, 'DELIVERY_FAILED')}
                            className="btn btn-danger flex items-center justify-center gap-2 text-sm"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {locale === 'en' ? 'Failed' : 'فشل'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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