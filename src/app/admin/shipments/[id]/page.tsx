'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from '../../../contexts/LocaleContext';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Weight,
  Box,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Printer,
  Download,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface ShipmentDetail {
  id: string;
  trackingNumber: string;
  barcode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerZone: string;
  status: string;
  shippingCost: number;
  codAmount: number;
  declaredValue: number;
  description: string;
  weight?: number;
  dimensions?: string;
  notes?: string;
  createdAt: string;
  pickupDate?: string;
  deliveryDate?: string;
  merchant: {
    id: string;
    name: string;
    companyName?: string;
    email: string;
    phone: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleNumber?: string;
  };
  warehouse?: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone?: string;
  };
  statusHistory: Array<{
    id: string;
    status: string;
    notes?: string;
    location?: string;
    createdAt: string;
  }>;
}

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const { locale } = useLocale();
  const router = useRouter();
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const fetchShipment = async () => {
    try {
      const response = await fetch(`/api/shipments/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shipment');
      }
      const data = await response.json();
      setShipment(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      toast.error(locale === 'en' ? 'Failed to load shipment details' : 'فشل تحميل تفاصيل الشحنة');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === shipment?.status) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/shipments/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(locale === 'en' ? 'Status updated successfully' : 'تم تحديث الحالة بنجاح');
      fetchShipment(); // Refresh data
      setStatusNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(locale === 'en' ? 'Failed to update status' : 'فشل تحديث الحالة');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string): string => {
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
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return CheckCircle;
      case 'WITH_DRIVER': return Truck;
      case 'IN_WAREHOUSE': return Package;
      case 'NEW': return Clock;
      case 'DELIVERY_FAILED': return XCircle;
      default: return Package;
    }
  };

  const statusOptions = [
    { value: 'NEW', label: locale === 'en' ? 'New' : 'جديد' },
    { value: 'IN_RECEIPT', label: locale === 'en' ? 'In Receipt' : 'في الاستلام' },
    { value: 'IN_WAREHOUSE', label: locale === 'en' ? 'In Warehouse' : 'في المستودع' },
    { value: 'WITH_DRIVER', label: locale === 'en' ? 'With Driver' : 'مع السائق' },
    { value: 'DELIVERED', label: locale === 'en' ? 'Delivered' : 'تم التسليم' },
    { value: 'DELIVERY_FAILED', label: locale === 'en' ? 'Delivery Failed' : 'فشل التسليم' },
    { value: 'RETURNED', label: locale === 'en' ? 'Returned' : 'مرتجع' },
    { value: 'PARTIAL_RETURNED', label: locale === 'en' ? 'Partial Return' : 'مرتجع جزئي' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {locale === 'en' ? 'Shipment not found' : 'الشحنة غير موجودة'}
        </h3>
        <p className="text-gray-600 mb-4">
          {locale === 'en' ? 'The shipment you are looking for does not exist.' : 'الشحنة التي تبحث عنها غير موجودة.'}
        </p>
        <Link href="/admin/shipments" className="btn btn-primary">
          {locale === 'en' ? 'Back to Shipments' : 'العودة إلى الشحنات'}
        </Link>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(shipment.status);
  const isRTL = locale === 'ar';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/shipments"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {locale === 'en' ? 'Shipment Details' : 'تفاصيل الشحنة'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-blue-600">{shipment.trackingNumber}</span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-gray-600">{shipment.barcode}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchShipment}
            className="btn btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{locale === 'en' ? 'Refresh' : 'تحديث'}</span>
          </button>
          <Link
            href={`/admin/shipments/${id}/edit`}
            className="btn btn-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>{locale === 'en' ? 'Edit' : 'تعديل'}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Shipment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(shipment.status).split(' ')[0]}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {locale === 'en' ? 'Current Status' : 'الحالة الحالية'}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                    {statusOptions.find(s => s.value === shipment.status)?.label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {locale === 'en' ? 'Created' : 'تم الإنشاء'}
                </div>
                <div className="font-medium">
                  {new Date(shipment.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                </div>
              </div>
            </div>

            {/* Update Status Form */}
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-3">
                {locale === 'en' ? 'Update Status' : 'تحديث الحالة'}
              </h4>
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input w-full"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder={locale === 'en' ? 'Add notes about status change...' : 'أضف ملاحظات حول تغيير الحالة...'}
                  rows={2}
                  className="input w-full"
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || newStatus === shipment.status}
                  className="btn btn-primary w-full"
                >
                  {updatingStatus ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      {locale === 'en' ? 'Updating...' : 'جاري التحديث...'}
                    </>
                  ) : (
                    locale === 'en' ? 'Update Status' : 'تحديث الحالة'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Customer Information' : 'معلومات العميل'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{locale === 'en' ? 'Customer Name' : 'اسم العميل'}</div>
                  <div className="font-medium">{shipment.customerName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{locale === 'en' ? 'Phone Number' : 'رقم الهاتف'}</div>
                  <div className="font-medium">{shipment.customerPhone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{locale === 'en' ? 'City' : 'المدينة'}</div>
                  <div className="font-medium">{shipment.customerCity}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{locale === 'en' ? 'Zone/Area' : 'المنطقة'}</div>
                  <div className="font-medium">{shipment.customerZone}</div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{locale === 'en' ? 'Address' : 'العنوان'}</div>
                    <div className="font-medium">{shipment.customerAddress}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Status History' : 'سجل الحالة'}
            </h3>
            <div className="space-y-4">
              {shipment.statusHistory.map((history, index) => {
                const HistoryIcon = getStatusIcon(history.status);
                return (
                  <div key={history.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-lg ${getStatusColor(history.status).split(' ')[0]}`}>
                        <HistoryIcon className="w-4 h-4" />
                      </div>
                      {index < shipment.statusHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}>
                          {statusOptions.find(s => s.value === history.status)?.label}
                        </span>
                        <div className="text-xs text-gray-500">
                          {new Date(history.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                        </div>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-2">{history.notes}</p>
                      )}
                      {history.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {history.location}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Shipment Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Shipment Details' : 'تفاصيل الشحنة'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{locale === 'en' ? 'Description' : 'الوصف'}</span>
                <span className="font-medium">{shipment.description}</span>
              </div>
              
              {shipment.weight && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{locale === 'en' ? 'Weight' : 'الوزن'}</span>
                  <div className="flex items-center gap-1">
                    <Weight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{shipment.weight} kg</span>
                  </div>
                </div>
              )}

              {shipment.dimensions && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{locale === 'en' ? 'Dimensions' : 'الأبعاد'}</span>
                  <div className="flex items-center gap-1">
                    <Box className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{shipment.dimensions}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">{locale === 'en' ? 'Declared Value' : 'القيمة المعلنة'}</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">EGP {shipment.declaredValue.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">{locale === 'en' ? 'Shipping Cost' : 'تكلفة الشحن'}</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">EGP {shipment.shippingCost.toFixed(2)}</span>
                </div>
              </div>

              {shipment.codAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{locale === 'en' ? 'COD Amount' : 'مبلغ الدفع عند الاستلام'}</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">EGP {shipment.codAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {shipment.notes && (
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-2">{locale === 'en' ? 'Notes' : 'ملاحظات'}</div>
                  <p className="text-gray-700">{shipment.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Merchant Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              {locale === 'en' ? 'Merchant Information' : 'معلومات التاجر'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{shipment.merchant.name}</div>
                  {shipment.merchant.companyName && (
                    <div className="text-sm text-gray-600">{shipment.merchant.companyName}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-sm">{shipment.merchant.phone}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-sm">{shipment.merchant.email}</div>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {shipment.driver && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                {locale === 'en' ? 'Driver Information' : 'معلومات السائق'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">{shipment.driver.name}</div>
                    {shipment.driver.vehicleNumber && (
                      <div className="text-sm text-gray-600">
                        {locale === 'en' ? 'Vehicle' : 'المركبة'}: {shipment.driver.vehicleNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-sm">{shipment.driver.phone}</div>
                </div>
              </div>
            </div>
          )}

          {/* Warehouse Information */}
          {shipment.warehouse && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                {locale === 'en' ? 'Warehouse Information' : 'معلومات المستودع'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">{shipment.warehouse.name}</div>
                    <div className="text-sm text-gray-600">{shipment.warehouse.city}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">{shipment.warehouse.address}</div>

                {shipment.warehouse.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-sm">{shipment.warehouse.phone}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}