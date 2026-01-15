'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, type Locale } from '@/lib/i18n';
import { Package, User, MapPin, DollarSign, Weight } from 'lucide-react';

interface CreateShipmentFormProps {
  locale: Locale;
  merchantId?: string;
  onSuccess?: () => void;
}

export default function CreateShipmentForm({
  locale,
  merchantId,
  onSuccess,
}: CreateShipmentFormProps) {
  const router = useRouter();
  const { t, isRTL } = useTranslation(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    merchantId: merchantId || '',
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight) || null,
          declaredValue: parseFloat(formData.declaredValue) || 0,
          shippingCost: parseFloat(formData.shippingCost) || 0,
          codAmount: parseFloat(formData.codAmount) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create shipment');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(
          merchantId ? '/merchant/shipments' : '/admin/shipments'
        );
      }
    } catch (err: any) {
      setError(err.message || t('messages.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    'Cairo',
    'Alexandria',
    'Giza',
    'Shubra El-Kheima',
    'Port Said',
    'Suez',
    'Luxor',
    'Mansoura',
    'El-Mahalla El-Kubra',
    'Tanta',
    'Asyut',
    'Ismailia',
    'Fayoum',
    'Zagazig',
    'Aswan',
    'Damietta',
    'Damanhur',
    'Minya',
    'Beni Suef',
    'Qena',
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {locale === 'en' ? 'Create New Shipment' : 'إنشاء شحنة جديدة'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            {locale === 'en' ? 'Customer Information' : 'معلومات العميل'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Full Name' : 'الاسم الكامل'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Address' : 'العنوان'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerAddress}
                onChange={(e) =>
                  setFormData({ ...formData, customerAddress: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'City' : 'المدينة'}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customerCity}
                onChange={(e) =>
                  setFormData({ ...formData, customerCity: e.target.value })
                }
                className="input"
                required
              >
                <option value="">{locale === 'en' ? 'Select City' : 'اختر المدينة'}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Zone/District' : 'المنطقة/الحى'}
              </label>
              <input
                type="text"
                value={formData.customerZone}
                onChange={(e) =>
                  setFormData({ ...formData, customerZone: e.target.value })
                }
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            {locale === 'en' ? 'Shipment Details' : 'تفاصيل الشحنة'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Description' : 'الوصف'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Weight (kg)' : 'الوزن (كجم)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Dimensions (L×W×H)' : 'الأبعاد (ط×ع×ار)'}
              </label>
              <input
                type="text"
                placeholder="30×20×15 cm"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {locale === 'en' ? 'Pricing' : 'التسعير'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Declared Value (EGP)' : 'القيمة المعلنة (جنية)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.declaredValue}
                onChange={(e) =>
                  setFormData({ ...formData, declaredValue: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Shipping Cost (EGP)' : 'تكلفة الشحن (جنية)'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.shippingCost}
                onChange={(e) =>
                  setFormData({ ...formData, shippingCost: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'COD Amount (EGP)' : 'مبلغ الدفع عند الاستلام (جنية)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.codAmount}
                onChange={(e) =>
                  setFormData({ ...formData, codAmount: e.target.value })
                }
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
            disabled={loading}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>{t('common.loading')}</span>
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                <span>{locale === 'en' ? 'Create Shipment' : 'إنشاء الشحنة'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}