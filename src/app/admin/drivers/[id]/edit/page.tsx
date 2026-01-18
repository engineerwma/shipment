'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Truck,
  Mail,
  Phone,
  Car,
  FileText,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

// Types
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
  isActive: boolean;
  isAvailable: boolean;
  currentLat?: number;
  currentLng?: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateDriverForm {
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
  isActive: boolean;
  isAvailable: boolean;
  currentLat?: string;
  currentLng?: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// Translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      common: {
        back: 'Back',
        save: 'Save Changes',
        saving: 'Saving...',
        cancel: 'Cancel',
        loading: 'Loading...',
        required: 'Required field',
        invalid: 'Invalid format',
        success: 'Success',
        error: 'Error',
        updateSuccess: 'Driver updated successfully',
        updateError: 'Failed to update driver',
        fetchError: 'Failed to load driver data',
      },
      drivers: {
        editDriver: 'Edit Driver',
        editDescription: 'Update driver information and settings',
        basicInfo: 'Basic Information',
        contactInfo: 'Contact Information',
        vehicleInfo: 'Vehicle Information',
        statusSettings: 'Status & Settings',
        locationInfo: 'Location Information (Optional)',
        security: 'Security',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        vehicleNumber: 'Vehicle Number',
        licenseNumber: 'License Number',
        currentStatus: 'Current Status',
        availability: 'Availability',
        active: 'Active',
        inactive: 'Inactive',
        available: 'Available',
        busy: 'Busy',
        latitude: 'Latitude',
        longitude: 'Longitude',
        password: 'New Password (Leave empty to keep current)',
        confirmPassword: 'Confirm New Password',
        driverId: 'Driver ID',
        createdAt: 'Created At',
        lastUpdated: 'Last Updated',
        leaveBlank: 'Leave blank to keep current password',
        passwordsMatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        enterLocation: 'Enter location coordinates',
        latPlaceholder: 'e.g., 30.0444',
        lngPlaceholder: 'e.g., 31.2357',
        updateSuccessMessage: 'Driver information has been updated successfully.',
        updateErrorMessage: 'There was an error updating the driver. Please try again.',
        fetchErrorMessage: 'Failed to load driver information. Please try again.',
      },
      validation: {
        requiredName: 'Name is required',
        requiredEmail: 'Email is required',
        invalidEmail: 'Please enter a valid email address',
        requiredPhone: 'Phone number is required',
        invalidPhone: 'Please enter a valid phone number',
        requiredVehicle: 'Vehicle number is required',
        requiredLicense: 'License number is required',
        passwordMismatch: 'Passwords do not match',
        passwordMinLength: 'Password must be at least 6 characters',
      },
    },
    ar: {
      common: {
        back: 'رجوع',
        save: 'حفظ التغييرات',
        saving: 'جاري الحفظ...',
        cancel: 'إلغاء',
        loading: 'جاري التحميل...',
        required: 'حقل مطلوب',
        invalid: 'صيغة غير صالحة',
        success: 'نجاح',
        error: 'خطأ',
        updateSuccess: 'تم تحديث بيانات السائق بنجاح',
        updateError: 'فشل تحديث بيانات السائق',
        fetchError: 'فشل تحميل بيانات السائق',
      },
      drivers: {
        editDriver: 'تعديل بيانات السائق',
        editDescription: 'تحديث معلومات وإعدادات السائق',
        basicInfo: 'المعلومات الأساسية',
        contactInfo: 'معلومات الاتصال',
        vehicleInfo: 'معلومات المركبة',
        statusSettings: 'الحالة والإعدادات',
        locationInfo: 'معلومات الموقع (اختياري)',
        security: 'الأمان',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        vehicleNumber: 'رقم المركبة',
        licenseNumber: 'رقم الرخصة',
        currentStatus: 'الحالة الحالية',
        availability: 'التوافر',
        active: 'نشط',
        inactive: 'غير نشط',
        available: 'متاح',
        busy: 'مشغول',
        latitude: 'خط العرض',
        longitude: 'خط الطول',
        password: 'كلمة مرور جديدة (اتركها فارغة للحفاظ على كلمة المرور الحالية)',
        confirmPassword: 'تأكيد كلمة المرور الجديدة',
        driverId: 'رقم السائق',
        createdAt: 'تاريخ الإنشاء',
        lastUpdated: 'آخر تحديث',
        leaveBlank: 'اتركه فارغًا للحفاظ على كلمة المرور الحالية',
        passwordsMatch: 'كلمات المرور غير متطابقة',
        passwordTooShort: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        enterLocation: 'أدخل إحداثيات الموقع',
        latPlaceholder: 'مثال: 30.0444',
        lngPlaceholder: 'مثال: 31.2357',
        updateSuccessMessage: 'تم تحديث معلومات السائق بنجاح.',
        updateErrorMessage: 'حدث خطأ أثناء تحديث السائق. يرجى المحاولة مرة أخرى.',
        fetchErrorMessage: 'فشل تحميل معلومات السائق. يرجى المحاولة مرة أخرى.',
      },
      validation: {
        requiredName: 'الاسم مطلوب',
        requiredEmail: 'البريد الإلكتروني مطلوب',
        invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
        requiredPhone: 'رقم الهاتف مطلوب',
        invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
        requiredVehicle: 'رقم المركبة مطلوب',
        requiredLicense: 'رقم الرخصة مطلوب',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        passwordMinLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
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

export default function EditDriverPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const params = useParams();
  const driverId = params.id as string;
  
  // State management
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<UpdateDriverForm>({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    licenseNumber: '',
    isActive: true,
    isAvailable: true,
    currentLat: '',
    currentLng: '',
    password: '',
    confirmPassword: '',
  });

  const isRTL = locale === 'ar';

  // Fetch driver data on mount
  useEffect(() => {
    if (driverId) {
      fetchDriver();
    }
  }, [driverId]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/drivers/${driverId}`);
      
      if (!response.ok) {
        throw new Error(getTranslation(locale, 'common.fetchError'));
      }

      const data = await response.json();
      setDriver(data.driver);
      
      // Populate form with existing data
      setFormData({
        name: data.driver.name || '',
        email: data.driver.email || '',
        phone: data.driver.phone || '',
        vehicleNumber: data.driver.vehicleNumber || '',
        licenseNumber: data.driver.licenseNumber || '',
        isActive: data.driver.isActive || true,
        isAvailable: data.driver.isAvailable || true,
        currentLat: data.driver.currentLat?.toString() || '',
        currentLng: data.driver.currentLng?.toString() || '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error fetching driver:', error);
      setErrors({
        general: getTranslation(locale, 'drivers.fetchErrorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  // Handle toggle changes
  const handleToggleChange = (field: 'isActive' | 'isAvailable') => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = getTranslation(locale, 'validation.requiredName');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = getTranslation(locale, 'validation.requiredEmail');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = getTranslation(locale, 'validation.invalidEmail');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = getTranslation(locale, 'validation.requiredPhone');
    } else if (!/^[+]?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = getTranslation(locale, 'validation.invalidPhone');
    }
    
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = getTranslation(locale, 'validation.requiredVehicle');
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = getTranslation(locale, 'validation.requiredLicense');
    }
    
    // Password validation (only if provided)
    if (formData.password.trim() !== '') {
      if (formData.password.length < 6) {
        newErrors.password = getTranslation(locale, 'validation.passwordMinLength');
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = getTranslation(locale, 'validation.passwordMismatch');
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
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        isActive: formData.isActive,
        isAvailable: formData.isAvailable,
      };
      
      // Add location if provided
      if (formData.currentLat && formData.currentLng) {
        updateData.currentLat = parseFloat(formData.currentLat);
        updateData.currentLng = parseFloat(formData.currentLng);
      }
      
      // Add password only if provided
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || getTranslation(locale, 'common.updateError'));
      }
      
      // Show success message
      alert(getTranslation(locale, 'common.updateSuccess'));
      
      // Redirect back to drivers list
      router.push('/admin/drivers');
      
    } catch (error: any) {
      console.error('Error updating driver:', error);
      setErrors({
        general: error.message || getTranslation(locale, 'drivers.updateErrorMessage'),
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm(getTranslation(locale, 'common.cancel') + '?')) {
      router.push('/admin/drivers');
    }
  };

  const t = (key: string) => getTranslation(locale, key);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (errors.general && !driver) {
    return (
      <div>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/drivers')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{t('drivers.editDriver')}</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-medium text-red-800">{t('common.error')}</h3>
            </div>
            <p className="text-red-700 mb-4">{errors.general}</p>
            <button
              onClick={fetchDriver}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('common.retry') || 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
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
              <h1 className="text-2xl font-bold text-gray-800">{t('drivers.editDriver')}</h1>
              <p className="text-gray-600">{t('drivers.editDescription')}</p>
            </div>
          </div>
          
          {driver && (
            <div className="text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t('drivers.driverId')}:</span>
                <code className="bg-gray-100 px-2 py-1 rounded">DRV-{driver.id.substring(0, 8)}</code>
              </div>
            </div>
          )}
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
              {t('drivers.basicInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.name')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('drivers.name')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.email')} *
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="driver@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('drivers.contactInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.phone')} *
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="+20 123 456 7890"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('drivers.vehicleInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.vehicleNumber')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <Car className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="ABC-1234"
                  />
                </div>
                {errors.vehicleNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
                )}
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.licenseNumber')} *
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="LIC-123456"
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status & Settings */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('drivers.statusSettings')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t('drivers.currentStatus')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggleChange('isActive')}
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
                    {formData.isActive ? t('drivers.active') : t('drivers.inactive')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.isActive 
                    ? t('drivers.active') + ' - Driver can receive shipments'
                    : t('drivers.inactive') + ' - Driver cannot receive shipments'
                  }
                </p>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t('drivers.availability')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggleChange('isAvailable')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.isAvailable ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isAvailable 
                          ? isRTL ? 'translate-x-[-1.25rem]' : 'translate-x-6' 
                          : isRTL ? 'translate-x-[-0.25rem]' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium">
                    {formData.isAvailable ? t('drivers.available') : t('drivers.busy')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.isAvailable 
                    ? t('drivers.available') + ' - Driver is available for new shipments'
                    : t('drivers.busy') + ' - Driver is currently busy'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('drivers.locationInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.latitude')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.000001"
                    name="currentLat"
                    value={formData.currentLat}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition border-gray-300 ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                    placeholder={t('drivers.latPlaceholder')}
                  />
                </div>
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.longitude')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.000001"
                    name="currentLng"
                    value={formData.currentLng}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition border-gray-300 ${
                      isRTL ? 'pr-10' : 'pl-10'
                    }`}
                    placeholder={t('drivers.lngPlaceholder')}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {t('drivers.enterLocation')}
            </p>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">
              {t('drivers.security')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.password')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('drivers.leaveBlank')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-gray-400`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('drivers.leaveBlank')}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('drivers.confirmPassword')}
                </label>
                <div className="relative">
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={t('drivers.confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-gray-400`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Driver Info (Read-only) */}
          {driver && (
            <div className="bg-gray-50 rounded-xl p-6 border">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Driver Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">{t('drivers.driverId')}</p>
                  <p className="font-mono text-sm">{driver.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('drivers.createdAt')}</p>
                  <p className="text-sm">{new Date(driver.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('drivers.lastUpdated')}</p>
                  <p className="text-sm">{new Date(driver.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`/admin/drivers/${driverId}`)}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {t('common.view') || 'View Details'}
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
          </div>
        </form>
      </div>
    </div>
  );
}