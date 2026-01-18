'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '../../../contexts/LocaleContext';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface Merchant {
  id: string;
  name: string;
  companyName?: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
  city: string;
}

export default function NewShipmentPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  
  const [formData, setFormData] = useState({
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
    codAmount: '',
    merchantId: '',
    driverId: '',
    warehouseId: '',
    notes: '',
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      // Fetch merchants
      const merchantsRes = await fetch('/api/users?role=MERCHANT');
      if (merchantsRes.ok) {
        const merchantsData = await merchantsRes.json();
        setMerchants(merchantsData);
      }

      // Fetch drivers
      const driversRes = await fetch('/api/users?role=DRIVER');
      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
      }

      // Fetch warehouses
      const warehousesRes = await fetch('/api/warehouses');
      if (warehousesRes.ok) {
        const warehousesData = await warehousesRes.json();
        setWarehouses(warehousesData);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          codAmount: parseFloat(formData.codAmount) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      const shipment = await response.json();
      toast.success(locale === 'en' ? 'Shipment created successfully!' : 'تم إنشاء الشحنة بنجاح!');
      router.push(`/admin/shipments/${shipment.id}`);
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error(locale === 'en' ? 'Failed to create shipment' : 'فشل إنشاء الشحنة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isRTL = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {locale === 'en' ? 'Create New Shipment' : 'إنشاء شحنة جديدة'}
        </h1>
        <p className="text-gray-600">
          {locale === 'en' ? 'Fill in the details to create a new shipment' : 'املأ التفاصيل لإنشاء شحنة جديدة'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'en' ? 'Customer Information' : 'معلومات العميل'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Customer Name' : 'اسم العميل'} *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Phone Number' : 'رقم الهاتف'} *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'City' : 'المدينة'} *
              </label>
              <input
                type="text"
                name="customerCity"
                value={formData.customerCity}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Zone/Area' : 'المنطقة'} *
              </label>
              <input
                type="text"
                name="customerZone"
                value={formData.customerZone}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Address' : 'العنوان'} *
              </label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                required
                rows={3}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'en' ? 'Shipment Details' : 'تفاصيل الشحنة'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Merchant' : 'التاجر'} *
              </label>
              <select
                name="merchantId"
                value={formData.merchantId}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">{locale === 'en' ? 'Select Merchant' : 'اختر التاجر'}</option>
                {merchants.map(merchant => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.companyName || merchant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Description' : 'الوصف'} *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder={locale === 'en' ? 'e.g., Electronics, Clothing' : 'مثال: إلكترونيات، ملابس'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Weight (kg)' : 'الوزن (كجم)'}
              </label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Dimensions' : 'الأبعاد'}
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="input w-full"
                placeholder={locale === 'en' ? 'e.g., 30x20x15 cm' : 'مثال: 30x20x15 سم'}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'en' ? 'Pricing' : 'التسعير'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Declared Value (EGP)' : 'القيمة المعلنة (جنيه)'} *
              </label>
              <input
                type="number"
                step="0.01"
                name="declaredValue"
                value={formData.declaredValue}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Shipping Cost (EGP)' : 'تكلفة الشحن (جنيه)'} *
              </label>
              <input
                type="number"
                step="0.01"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'COD Amount (EGP)' : 'مبلغ الدفع عند الاستلام (جنيه)'}
              </label>
              <input
                type="number"
                step="0.01"
                name="codAmount"
                value={formData.codAmount}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'en' ? 'Assignment' : 'التعيين'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Driver' : 'السائق'}
              </label>
              <select
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">{locale === 'en' ? 'Select Driver' : 'اختر السائق'}</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Warehouse' : 'المستودع'}
              </label>
              <select
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">{locale === 'en' ? 'Select Warehouse' : 'اختر المستودع'}</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} - {warehouse.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'en' ? 'Notes' : 'ملاحظات'}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input w-full"
              placeholder={locale === 'en' ? 'Additional notes...' : 'ملاحظات إضافية...'}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
            disabled={loading}
          >
            {locale === 'en' ? 'Cancel' : 'إلغاء'}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {locale === 'en' ? 'Creating...' : 'جاري الإنشاء...'}
              </>
            ) : (
              locale === 'en' ? 'Create Shipment' : 'إنشاء الشحنة'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}