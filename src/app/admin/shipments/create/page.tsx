'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

interface Merchant {
  id: string;
  name: string;
  email: string;
}

interface Driver {
  id: string;
  name: string;
  vehicleNumber: string;
}

interface Warehouse {
  id: string;
  name: string;
  city: string;
  code: string;
}

export default function CreateShipmentPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [formData, setFormData] = useState({
    merchantId: '',
    driverId: '',
    warehouseId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerZone: '',
    description: '',
    weight: '',
    dimensions: '',
    declaredValue: '',
    shippingCost: '',
    codAmount: '0',
    notes: '',
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      // Fetch merchants, drivers, and warehouses in parallel
      const [merchantsRes, driversRes, warehousesRes] = await Promise.all([
        fetch('/api/admin/merchants'),
        fetch('/api/admin/drivers'),
        fetch('/api/admin/warehouses'),
      ]);

      const [merchantsData, driversData, warehousesData] = await Promise.all([
        merchantsRes.json(),
        driversRes.json(),
        warehousesRes.json(),
      ]);

      setMerchants(merchantsData.merchants || []);
      setDrivers(driversData.drivers || []);
      setWarehouses(warehousesData.warehouses || []);
    } catch (error) {
      console.error('Error fetching form data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.merchantId) newErrors.merchantId = 'Merchant is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Customer phone is required';
    if (!formData.customerAddress.trim()) newErrors.customerAddress = 'Address is required';
    if (!formData.customerCity.trim()) newErrors.customerCity = 'City is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.declaredValue) newErrors.declaredValue = 'Declared value is required';
    if (!formData.shippingCost) newErrors.shippingCost = 'Shipping cost is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          declaredValue: parseFloat(formData.declaredValue),
          shippingCost: parseFloat(formData.shippingCost),
          codAmount: parseFloat(formData.codAmount),
          driverId: formData.driverId || null,
          warehouseId: formData.warehouseId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shipment');
      }

      alert('Shipment created successfully!');
      router.push('/admin/shipments');
    } catch (error: any) {
      alert(error.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Create New Shipment',
      back: 'Back to Shipments',
      merchant: 'Merchant',
      selectMerchant: 'Select Merchant',
      driver: 'Driver (Optional)',
      selectDriver: 'Select Driver',
      warehouse: 'Warehouse (Optional)',
      selectWarehouse: 'Select Warehouse',
      customerInfo: 'Customer Information',
      customerName: 'Customer Name',
      customerPhone: 'Customer Phone',
      customerAddress: 'Address',
      customerCity: 'City',
      customerZone: 'Zone/District',
      shipmentDetails: 'Shipment Details',
      description: 'Description',
      weight: 'Weight (kg)',
      dimensions: 'Dimensions (LxWxH)',
      pricing: 'Pricing',
      declaredValue: 'Declared Value',
      shippingCost: 'Shipping Cost',
      codAmount: 'COD Amount',
      notes: 'Notes',
      createShipment: 'Create Shipment',
      createShipmentLoading: 'Creating...',
    },
    ar: {
      title: 'إنشاء شحنة جديدة',
      back: 'العودة للشحنات',
      merchant: 'التاجر',
      selectMerchant: 'اختر تاجر',
      driver: 'السائق (اختياري)',
      selectDriver: 'اختر سائق',
      warehouse: 'المستودع (اختياري)',
      selectWarehouse: 'اختر مستودع',
      customerInfo: 'معلومات العميل',
      customerName: 'اسم العميل',
      customerPhone: 'هاتف العميل',
      customerAddress: 'العنوان',
      customerCity: 'المدينة',
      customerZone: 'المنطقة/الحي',
      shipmentDetails: 'تفاصيل الشحنة',
      description: 'الوصف',
      weight: 'الوزن (كجم)',
      dimensions: 'الأبعاد (ط×ع×ا)',
      pricing: 'التسعير',
      declaredValue: 'القيمة المعلنة',
      shippingCost: 'تكلفة الشحن',
      codAmount: 'مبلغ الدفع عند الاستلام',
      notes: 'ملاحظات',
      createShipment: 'إنشاء الشحنة',
      createShipmentLoading: 'جاري الإنشاء...',
    },
  };

  const t = translations[locale];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/shipments')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-gray-600">Fill in shipment details below</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {fetchingData ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading form data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Merchant, Driver, Warehouse */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Merchant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.merchant} *
                </label>
                <select
                  name="merchantId"
                  value={formData.merchantId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.merchantId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t.selectMerchant}</option>
                  {merchants.map((merchant) => (
                    <option key={merchant.id} value={merchant.id}>
                      {merchant.name} ({merchant.email})
                    </option>
                  ))}
                </select>
                {errors.merchantId && (
                  <p className="mt-1 text-sm text-red-600">{errors.merchantId}</p>
                )}
              </div>

              {/* Driver */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driver}
                </label>
                <select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">{t.selectDriver}</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.vehicleNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.warehouse}
                </label>
                <select
                  name="warehouseId"
                  value={formData.warehouseId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">{t.selectWarehouse}</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Information */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {t.customerInfo}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customerName} *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customerPhone} *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+20 123 456 7890"
                  />
                  {errors.customerPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customerAddress} *
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.customerAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Full address"
                  />
                  {errors.customerAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customerCity} *
                  </label>
                  <input
                    type="text"
                    name="customerCity"
                    value={formData.customerCity}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.customerCity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.customerCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerCity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.customerZone}
                  </label>
                  <input
                    type="text"
                    name="customerZone"
                    value={formData.customerZone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Zone or district"
                  />
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {t.shipmentDetails}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.description} *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the shipment contents"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.weight}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.dimensions}
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., 30x20x15"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {t.pricing}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.declaredValue} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="declaredValue"
                    value={formData.declaredValue}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.declaredValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.declaredValue && (
                    <p className="mt-1 text-sm text-red-600">{errors.declaredValue}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.shippingCost} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.shippingCost ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.shippingCost && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingCost}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.codAmount}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="codAmount"
                    value={formData.codAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.notes}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Additional notes..."
              />
            </div>

            {/* Submit button */}
            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                {loading ? t.createShipmentLoading : t.createShipment}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}