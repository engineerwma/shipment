'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, type Locale } from '@/lib/i18n';
import { Building, User, Mail, Phone, Percent } from 'lucide-react';

interface CreateMerchantFormProps {
  locale: Locale;
  onSuccess?: () => void;
}

export default function CreateMerchantForm({
  locale,
  onSuccess,
}: CreateMerchantFormProps) {
  const router = useRouter();
  const { t, isRTL } = useTranslation(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'merchant123',
    companyName: '',
    commissionRate: '10',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          role: 'MERCHANT',
          commissionRate: parseFloat(formData.commissionRate) / 100,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create merchant');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/merchants');
      }
    } catch (err: any) {
      setError(err.message || t('messages.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {locale === 'en' ? 'Add New Merchant' : 'إضافة تاجر جديد'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            {locale === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Full Name' : 'الاسم الكامل'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Email' : 'البريد الإلكتروني'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
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
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Password' : 'كلمة المرور'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {locale === 'en'
                  ? 'Default password: merchant123 (change after first login)'
                  : 'كلمة المرور الافتراضية: merchant123 (قم بتغييرها بعد أول تسجيل دخول)'}
              </p>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            {locale === 'en' ? 'Company Information' : 'معلومات الشركة'}
          </h3>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'en' ? 'Company Name' : 'اسم الشركة'}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="input"
              required
            />
          </div>
        </div>

        {/* Commission */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5" />
            {locale === 'en' ? 'Commission Settings' : 'إعدادات العمولة'}
          </h3>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'en' ? 'Commission Rate (%)' : 'نسبة العمولة (%)'}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.commissionRate}
                onChange={(e) =>
                  setFormData({ ...formData, commissionRate: e.target.value })
                }
                className="input pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'en'
                ? 'Commission deducted from shipping cost'
                : 'عمولة تخصم من تكلفة الشحن'}
            </p>
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
                <Building className="w-4 h-4" />
                <span>{locale === 'en' ? 'Add Merchant' : 'إضافة التاجر'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}