'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

// Types
interface CreateWarehouseForm {
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  managerName: string;
  latitude: string;
  longitude: string;
  capacity: string;
  currentLoad: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  capacity?: string;
  currentLoad?: string;
  general?: string;
}

// Translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      common: {
        back: 'Back',
        save: 'Create Warehouse',
        saving: 'Creating...',
        cancel: 'Cancel',
        loading: 'Loading...',
        required: 'Required field',
        invalid: 'Invalid format',
        success: 'Success',
        error: 'Error',
        createSuccess: 'Warehouse created successfully',
        createError: 'Failed to create warehouse',
      },
      warehouses: {
        createWarehouse: 'Create New Warehouse',
        createDescription: 'Add a new warehouse to the system',
        basicInfo: 'Basic Information',
        locationInfo: 'Location Information',
        contactInfo: 'Contact Information',
        capacityInfo: 'Capacity Information',
        name: 'Warehouse Name',
        code: 'Warehouse Code',
        address: 'Address',
        city: 'City',
        phone: 'Phone Number',
        email: 'Email Address',
        managerName: 'Manager Name',
        latitude: 'Latitude',
        longitude: 'Longitude',
        capacity: 'Total Capacity',
        currentLoad: 'Current Load',
        isActive: 'Active Status',
        active: 'Active',
        inactive: 'Inactive',
        generateCode: 'Generate Code',
        enterCoordinates: 'Enter coordinates or use map',
        latPlaceholder: 'e.g., 30.0444',
        lngPlaceholder: 'e.g., 31.2357',
        loadCannotExceedCapacity: 'Current load cannot exceed capacity',
        codeMustBeUnique: 'Warehouse code must be unique',
        createSuccessMessage: 'Warehouse has been created successfully.',
        createErrorMessage: 'There was an error creating the warehouse. Please try again.',
      },
      validation: {
        requiredName: 'Warehouse name is required',
        requiredCode: 'Warehouse code is required',
        requiredAddress: 'Address is required',
        requiredCity: 'City is required',
        requiredLatitude: 'Latitude is required',
        requiredLongitude: 'Longitude is required',
        requiredCapacity: 'Capacity is required',
        invalidLatitude: 'Latitude must be between -90 and 90',
        invalidLongitude: 'Longitude must be between -180 and 180',
        invalidCapacity: 'Capacity must be a positive number',
        invalidCurrentLoad: 'Current load must be a positive number',
      },
    },
    ar: {
      common: {
        back: 'رجوع',
        save: 'إنشاء مستودع',
        saving: 'جاري الإنشاء...',
        cancel: 'إلغاء',
        loading: 'جاري التحميل...',
        required: 'حقل مطلوب',
        invalid: 'صيغة غير صالحة',
        success: 'نجاح',
        error: 'خطأ',
        createSuccess: 'تم إنشاء المستودع بنجاح',
        createError: 'فشل إنشاء المستودع',
      },
      warehouses: {
        createWarehouse: 'إنشاء مستودع جديد',
        createDescription: 'إضافة مستودع جديد للنظام',
        basicInfo: 'المعلومات الأساسية',
        locationInfo: 'معلومات الموقع',
        contactInfo: 'معلومات الاتصال',
        capacityInfo: 'معلومات السعة',
        name: 'اسم المستودع',
        code: 'كود المستودع',
        address: 'العنوان',
        city: 'المدينة',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني',
        managerName: 'اسم المدير',
        latitude: 'خط العرض',
        longitude: 'خط الطول',
        capacity: 'السعة الإجمالية',
        currentLoad: 'الحمل الحالي',
        isActive: 'الحالة',
        active: 'نشط',
        inactive: 'غير نشط',
        generateCode: 'توليد كود',
        enterCoordinates: 'أدخل الإحداثيات أو استخدم الخريطة',
        latPlaceholder: 'مثال: 30.0444',
        lngPlaceholder: 'مثال: 31.2357',
        loadCannotExceedCapacity: 'الحمل الحالي لا يمكن أن يتجاوز السعة',
        codeMustBeUnique: 'كود المستودع يجب أن يكون فريدًا',
        createSuccessMessage: 'تم إنشاء المستودع بنجاح.',
        createErrorMessage: 'حدث خطأ أثناء إنشاء المستودع. يرجى المحاولة مرة أخرى.',
      },
      validation: {
        requiredName: 'اسم المستودع مطلوب',
        requiredCode: 'كود المستودع مطلوب',
        requiredAddress: 'العنوان مطلوب',
        requiredCity: 'المدينة مطلوبة',
        requiredLatitude: 'خط العرض مطلوب',
        requiredLongitude: 'خط الطول مطلوب',
        requiredCapacity: 'السعة مطلوبة',
        invalidLatitude: 'خط العرض يجب أن يكون بين -90 و 90',
        invalidLongitude: 'خط الطول يجب أن يكون بين -180 و 180',
        invalidCapacity: 'السعة يجب أن تكون رقمًا موجبًا',
        invalidCurrentLoad: 'الحمل الحالي يجب أن يكون رقمًا موجبًا',
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

export default function CreateWarehousePage() {
  const { locale } = useLocale();
  const router = useRouter();
  
  // State management
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Form state
  const [formData, setFormData] = useState<CreateWarehouseForm>({
    name: '',
    code: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    managerName: '',
    latitude: '',
    longitude: '',
    capacity: '',
    currentLoad: '0',
    isActive: true,
  });

  const isRTL = locale === 'ar';
  const t = (key: string) => getTranslation(locale, key);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Generate warehouse code
  const generateCode = () => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const code = `WH${timestamp}${random}`;
    setFormData(prev => ({ ...prev, code }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = t('validation.requiredName');
    }
    
    if (!formData.code.trim()) {
      newErrors.code = t('validation.requiredCode');
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('validation.requiredAddress');
    }
    
    if (!formData.city.trim()) {
      newErrors.city = t('validation.requiredCity');
    }
    
    if (!formData.latitude.trim()) {
      newErrors.latitude = t('validation.requiredLatitude');
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = t('validation.invalidLatitude');
      }
    }
    
    if (!formData.longitude.trim()) {
      newErrors.longitude = t('validation.requiredLongitude');
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = t('validation.invalidLongitude');
      }
    }
    
    if (!formData.capacity.trim()) {
      newErrors.capacity = t('validation.requiredCapacity');
    } else {
      const capacity = parseFloat(formData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacity = t('validation.invalidCapacity');
      }
    }
    
    if (formData.currentLoad.trim()) {
      const currentLoad = parseFloat(formData.currentLoad);
      const capacity = parseFloat(formData.capacity);
      
      if (isNaN(currentLoad) || currentLoad < 0) {
        newErrors.currentLoad = t('validation.invalidCurrentLoad');
      } else if (currentLoad > capacity) {
        newErrors.currentLoad = t('warehouses.loadCannotExceedCapacity');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Prepare data for API
      const createData = {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        city: formData.city,
        phone: formData.phone || null,
        email: formData.email || null,
        managerName: formData.managerName || null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        capacity: parseInt(formData.capacity),
        currentLoad: parseInt(formData.currentLoad) || 0,
        isActive: formData.isActive,
      };
      
      const response = await fetch('/api/admin/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t('common.createError'));
      }
      
      alert(t('common.createSuccess'));
      router.push('/admin/warehouses');
      
    } catch (error: any) {
      console.error('Error creating warehouse:', error);
      setErrors({
        general: error.message || t('warehouses.createErrorMessage'),
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm(t('common.cancel') + '?')) {
      router.push('/admin/warehouses');
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/warehouses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('warehouses.createWarehouse')}</h1>
              <p className="text-gray-600">{t('warehouses.createDescription')}</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('warehouses.basicInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.name')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('warehouses.name')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.code')} *
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.code ? 'border-red-500' : 'border-gray-300'
                      } ${isRTL ? 'pr-10' : 'pl-10'}`}
                      placeholder="WH001"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    {t('warehouses.generateCode')}
                  </button>
                </div>
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('warehouses.codeMustBeUnique')}
                </p>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.address')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('warehouses.address')}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.city')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="e.g., Cairo"
                  />
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('warehouses.locationInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.latitude')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.latitude ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('warehouses.latPlaceholder')}
                  />
                </div>
                {errors.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                )}
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.longitude')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.longitude ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('warehouses.lngPlaceholder')}
                  />
                </div>
                {errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {t('warehouses.enterCoordinates')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('warehouses.contactInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.phone')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition border-gray-300 ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                    placeholder="+20 123 456 7890"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.email')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition border-gray-300 ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                    placeholder="warehouse@example.com"
                  />
                </div>
              </div>

              {/* Manager Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.managerName')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition border-gray-300 ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                    placeholder={t('warehouses.managerName')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('warehouses.capacityInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.capacity')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="1000"
                  />
                </div>
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              {/* Current Load */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('warehouses.currentLoad')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="currentLoad"
                    value={formData.currentLoad}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.currentLoad ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="0"
                  />
                </div>
                {errors.currentLoad && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentLoad}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('warehouses.loadCannotExceedCapacity')}
                </p>
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t('warehouses.isActive')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.isActive ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive 
                          ? isRTL ? 'translate-x-[-1.25rem]' : 'translate-x-6' 
                          : isRTL ? 'translate-x-[-0.25rem]' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium">
                    {formData.isActive ? t('warehouses.active') : t('warehouses.inactive')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.isActive 
                    ? t('warehouses.active') + ' - Warehouse is active and can receive shipments'
                    : t('warehouses.inactive') + ' - Warehouse is inactive and cannot receive shipments'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('common.save')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}