'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function CreateDriverPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleNumber: '',
    licenseNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create driver');
      }

      alert('Driver created successfully!');
      router.push('/admin/drivers');
    } catch (error: any) {
      alert(error.message || 'Failed to create driver');
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Add New Driver',
      back: 'Back to Drivers',
      name: 'Name',
      email: 'Email',
      phone: 'Phone Number',
      password: 'Password',
      vehicleNumber: 'Vehicle Number',
      licenseNumber: 'License Number',
      createDriver: 'Create Driver',
      createDriverLoading: 'Creating...',
      required: 'Required field',
    },
    ar: {
      title: 'إضافة سائق جديد',
      back: 'العودة للسائقين',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      vehicleNumber: 'رقم المركبة',
      licenseNumber: 'رقم الرخصة',
      createDriver: 'إنشاء سائق',
      createDriverLoading: 'جاري الإنشاء...',
      required: 'حقل مطلوب',
    },
  };

  const t = translations[locale];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/drivers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-gray-600">Fill in driver details below</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.name} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter driver name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.email} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="driver@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.phone} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+20 123 456 7890"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.password} *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.vehicleNumber} *
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC-1234"
              />
              {errors.vehicleNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.licenseNumber} *
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123456789"
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              {loading ? t.createDriverLoading : t.createDriver}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}