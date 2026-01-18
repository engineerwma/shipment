'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from '../../../../contexts/LocaleContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  X,
  Package,
  User,
  Phone,
  MapPin,
  DollarSign,
  Weight,
  Box,
  Truck,
  Warehouse,
  AlertCircle,
  Mail,
  Calendar,
  Info,
} from 'lucide-react';

interface ShipmentFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerZone: string;
  description: string;
  weight?: number | null;
  dimensions?: string;
  declaredValue: number;
  shippingCost: number;
  codAmount: number;
  merchantId: string;
  driverId?: string;
  warehouseId?: string;
  notes?: string;
  status: string;
}

interface Merchant {
  id: string;
  name: string;
  companyName?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber?: string;
}

interface Warehouse {
  id: string;
  name: string;
  city: string;
}

const statusOptions = [
  { value: 'NEW', label: { en: 'New', ar: 'جديد' } },
  { value: 'IN_RECEIPT', label: { en: 'In Receipt', ar: 'في الاستلام' } },
  { value: 'IN_WAREHOUSE', label: { en: 'In Warehouse', ar: 'في المستودع' } },
  { value: 'WITH_DRIVER', label: { en: 'With Driver', ar: 'مع السائق' } },
  { value: 'DELIVERED', label: { en: 'Delivered', ar: 'تم التسليم' } },
  { value: 'DELIVERY_FAILED', label: { en: 'Delivery Failed', ar: 'فشل التسليم' } },
  { value: 'RETURNED', label: { en: 'Returned', ar: 'مرتجع' } },
  { value: 'PARTIAL_RETURNED', label: { en: 'Partial Return', ar: 'مرتجع جزئي' } },
];

const cities = [
  'Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez',
  'Luxor', 'al-Mansura', 'El-Mahalla El-Kubra', 'Tanta', 'Asyut', 'Ismailia',
  'Faiyum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'al-Minya',
  'Beni Suef', 'Qena', 'Sohag', 'Hurghada', '6th of October City', 'Sharm El Sheikh'
];

export default function EditShipmentPage() {
  const { id } = useParams() as { id: string };
  const { locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  
  const [formData, setFormData] = useState<ShipmentFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerZone: '',
    description: '',
    weight: null,
    dimensions: '',
    declaredValue: 0,
    shippingCost: 0,
    codAmount: 0,
    merchantId: '',
    driverId: '',
    warehouseId: '',
    notes: '',
    status: 'NEW',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [debugInfo, setDebugInfo] = useState<string>('');

  const isRTL = locale === 'ar';

  // Debug useEffect
  useEffect(() => {
    console.log('=== EDIT PAGE DEBUG INFO ===');
    console.log('Shipment ID from params:', id);
    console.log('Loading state:', loading);
    console.log('Form data:', formData);
    
    setDebugInfo(`Shipment ID: ${id}\nLoading: ${loading}\nForm initialized: ${formData.customerName ? 'Yes' : 'No'}`);
  }, [id, loading, formData]);

  useEffect(() => {
    console.log('Starting to fetch shipment data for ID:', id);
    fetchShipmentData();
  }, [id]);

  const fetchShipmentData = async () => {
    setLoading(true);
    setDebugInfo(prev => prev + '\nStarting fetchShipmentData');
    
    try {
      console.log(`Fetching shipment with ID: ${id}`);
      setDebugInfo(prev => prev + `\nFetching API: /api/shipments/${id}`);
      
      // Fetch shipment data
      const shipmentRes = await fetch(`/api/shipments/${id}`);
      
      console.log('API Response status:', shipmentRes.status);
      setDebugInfo(prev => prev + `\nAPI Status: ${shipmentRes.status}`);
      
      if (!shipmentRes.ok) {
        const errorText = await shipmentRes.text();
        console.error('API Error Response:', errorText);
        setDebugInfo(prev => prev + `\nAPI Error: ${errorText}`);
        throw new Error(`Failed to fetch shipment: ${shipmentRes.status} - ${errorText}`);
      }
      
      const shipment = await shipmentRes.json();
      console.log('Shipment data received:', shipment);
      setDebugInfo(prev => prev + `\nShipment found: ${!!shipment}\nTracking: ${shipment.trackingNumber}`);
      
      setTrackingNumber(shipment.trackingNumber || 'N/A');
      setBarcode(shipment.barcode || 'N/A');
      setFormData({
        customerName: shipment.customerName || '',
        customerPhone: shipment.customerPhone || '',
        customerAddress: shipment.customerAddress || '',
        customerCity: shipment.customerCity || '',
        customerZone: shipment.customerZone || '',
        description: shipment.description || '',
        weight: shipment.weight || null,
        dimensions: shipment.dimensions || '',
        declaredValue: shipment.declaredValue || 0,
        shippingCost: shipment.shippingCost || 0,
        codAmount: shipment.codAmount || 0,
        merchantId: shipment.merchantId || '',
        driverId: shipment.driverId || '',
        warehouseId: shipment.warehouseId || '',
        notes: shipment.notes || '',
        status: shipment.status || 'NEW',
      });

      // Fetch dropdown data
      await fetchDropdownData();
      setDebugInfo(prev => prev + '\nData loaded successfully');
      
    } catch (error: any) {
      console.error('Error in fetchShipmentData:', error);
      setDebugInfo(prev => prev + `\nError: ${error.message}`);
      
      toast.error(
        locale === 'en' 
          ? `Failed to load shipment: ${error.message}` 
          : `فشل تحميل الشحنة: ${error.message}`
      );
      
      // Don't redirect immediately - show error and let user decide
      setTimeout(() => {
        console.log('Auto-redirecting to shipments page after error');
        router.push('/admin/shipments');
      }, 5000); // Redirect after 5 seconds to show error
      
    } finally {
      setLoading(false);
      setDebugInfo(prev => prev + '\nLoading complete');
    }
  };

  const fetchDropdownData = async () => {
    try {
      setDebugInfo(prev => prev + '\nFetching dropdown data...');
      
      // Fetch merchants
      const merchantsRes = await fetch('/api/users?role=MERCHANT');
      if (merchantsRes.ok) {
        const merchantsData = await merchantsRes.json();
        setMerchants(merchantsData);
        setDebugInfo(prev => prev + `\nMerchants: ${merchantsData.length} loaded`);
      }

      // Fetch drivers
      const driversRes = await fetch('/api/users?role=DRIVER&isAvailable=true');
      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
        setDebugInfo(prev => prev + `\nDrivers: ${driversData.length} loaded`);
      }

      // Fetch warehouses
      const warehousesRes = await fetch('/api/warehouses?isActive=true');
      if (warehousesRes.ok) {
        const warehousesData = await warehousesRes.json();
        setWarehouses(warehousesData);
        setDebugInfo(prev => prev + `\nWarehouses: ${warehousesData.length} loaded`);
      }
      
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      setDebugInfo(prev => prev + `\nDropdown error: ${error}`);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = locale === 'en' ? 'Customer name is required' : 'اسم العميل مطلوب';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = locale === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\-\s]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = locale === 'en' ? 'Invalid phone number' : 'رقم هاتف غير صالح';
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = locale === 'en' ? 'Address is required' : 'العنوان مطلوب';
    }

    if (!formData.customerCity.trim()) {
      newErrors.customerCity = locale === 'en' ? 'City is required' : 'المدينة مطلوبة';
    }

    if (!formData.customerZone.trim()) {
      newErrors.customerZone = locale === 'en' ? 'Zone is required' : 'المنطقة مطلوبة';
    }

    if (!formData.description.trim()) {
      newErrors.description = locale === 'en' ? 'Description is required' : 'الوصف مطلوب';
    }

    if (!formData.merchantId) {
      newErrors.merchantId = locale === 'en' ? 'Merchant is required' : 'التاجر مطلوب';
    }

    if (formData.declaredValue <= 0) {
      newErrors.declaredValue = locale === 'en' ? 'Declared value must be greater than 0' : 'القيمة المعلنة يجب أن تكون أكبر من صفر';
    }

    if (formData.shippingCost < 0) {
      newErrors.shippingCost = locale === 'en' ? 'Shipping cost cannot be negative' : 'تكلفة الشحن لا يمكن أن تكون سلبية';
    }

    if (formData.codAmount < 0) {
      newErrors.codAmount = locale === 'en' ? 'COD amount cannot be negative' : 'مبلغ الدفع عند الاستلام لا يمكن أن يكون سالباً';
    }

    if (formData.weight !== null && formData.weight < 0) {
      newErrors.weight = locale === 'en' ? 'Weight cannot be negative' : 'الوزن لا يمكن أن يكون سالباً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(locale === 'en' ? 'Please fix the errors in the form' : 'يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setSaving(true);
    setDebugInfo(prev => prev + '\nSubmitting form...');
    
    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        weight: formData.weight || null,
        driverId: formData.driverId || null,
        warehouseId: formData.warehouseId || null,
        notes: formData.notes || null,
      };

      console.log('Sending update data:', updateData);
      setDebugInfo(prev => prev + '\nSending update to API...');

      const response = await fetch(`/api/shipments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', response.status);
      setDebugInfo(prev => prev + `\nUpdate response: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update shipment');
      }

      const updatedShipment = await response.json();
      console.log('Shipment updated successfully:', updatedShipment);
      setDebugInfo(prev => prev + '\nShipment updated successfully!');

      toast.success(locale === 'en' ? 'Shipment updated successfully!' : 'تم تحديث الشحنة بنجاح!');
      
      // Redirect to shipment details page after success
      setTimeout(() => {
        router.push(`/admin/shipments/${id}`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating shipment:', error);
      setDebugInfo(prev => prev + `\nUpdate error: ${error.message}`);
      toast.error(error.message || (locale === 'en' ? 'Failed to update shipment' : 'فشل تحديث الشحنة'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof ShipmentFormData
  ) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {locale === 'en' ? 'Loading Shipment Data' : 'جاري تحميل بيانات الشحنة'}
          </h2>
          <p className="text-gray-600 mb-4">
            {locale === 'en' ? 'Please wait while we load the shipment details...' : 'يرجى الانتظار أثناء تحميل تفاصيل الشحنة...'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {locale === 'en' ? 'Debug Information' : 'معلومات التصحيح'}
              </span>
            </div>
            <pre className="text-xs text-blue-700 whitespace-pre-wrap">
              {debugInfo}
            </pre>
          </div>
          <button
            onClick={() => router.push('/admin/shipments')}
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'en' ? 'Back to Shipments' : 'العودة إلى الشحنات'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position={isRTL ? 'top-left' : 'top-right'}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-6xl mx-auto p-4">
        {/* Debug Panel - Remove in production */}
        <div className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Debug Information' : 'معلومات التصحيح'}
              </span>
            </div>
            <button
              onClick={() => setDebugInfo('')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {locale === 'en' ? 'Clear' : 'مسح'}
            </button>
          </div>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {debugInfo || 'No debug information available'}
          </pre>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/shipments/${id}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {locale === 'en' ? 'Edit Shipment' : 'تعديل الشحنة'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {trackingNumber || 'Loading...'}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {barcode || 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/shipments/${id}`}
                className="btn btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>{locale === 'en' ? 'Cancel' : 'إلغاء'}</span>
              </Link>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{locale === 'en' ? 'Saving...' : 'جاري الحفظ...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Save Changes' : 'حفظ التغييرات'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tracking Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-800">
                  {locale === 'en' 
                    ? 'Tracking information cannot be modified. To change tracking details, please contact support.' 
                    : 'معلومات التتبع لا يمكن تعديلها. لتغيير تفاصيل التتبع، يرجى التواصل مع الدعم الفني.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information Card */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b p-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    {locale === 'en' ? 'Customer Information' : 'معلومات العميل'}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Customer Name' : 'اسم العميل'} *
                      </label>
                      <div className="relative">
                        <User className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.customerName ? 'border-red-500' : ''}`}
                          placeholder={locale === 'en' ? 'Enter customer name' : 'أدخل اسم العميل'}
                        />
                      </div>
                      {errors.customerName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.customerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Phone Number' : 'رقم الهاتف'} *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.customerPhone ? 'border-red-500' : ''}`}
                          placeholder={locale === 'en' ? 'e.g., +201234567890' : 'مثال: +201234567890'}
                        />
                      </div>
                      {errors.customerPhone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.customerPhone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'City' : 'المدينة'} *
                      </label>
                      <div className="relative">
                        <MapPin className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                        <select
                          name="customerCity"
                          value={formData.customerCity}
                          onChange={handleChange}
                          className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.customerCity ? 'border-red-500' : ''}`}
                        >
                          <option value="">{locale === 'en' ? 'Select City' : 'اختر المدينة'}</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      {errors.customerCity && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.customerCity}
                        </p>
                      )}
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
                        className={`input w-full ${errors.customerZone ? 'border-red-500' : ''}`}
                        placeholder={locale === 'en' ? 'e.g., Downtown, Heliopolis' : 'مثال: وسط البلد، هليوبوليس'}
                      />
                      {errors.customerZone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.customerZone}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Address' : 'العنوان'} *
                      </label>
                      <textarea
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleChange}
                        rows={3}
                        className={`input w-full ${errors.customerAddress ? 'border-red-500' : ''}`}
                        placeholder={locale === 'en' ? 'Enter full address with landmarks' : 'أدخل العنوان الكامل مع المعالم'}
                      />
                      {errors.customerAddress && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.customerAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Details Card */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b p-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    {locale === 'en' ? 'Shipment Details' : 'تفاصيل الشحنة'}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Description' : 'الوصف'} *
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`input w-full ${errors.description ? 'border-red-500' : ''}`}
                        placeholder={locale === 'en' ? 'e.g., Electronics, Clothing' : 'مثال: إلكترونيات، ملابس'}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Merchant' : 'التاجر'} *
                      </label>
                      <select
                        name="merchantId"
                        value={formData.merchantId}
                        onChange={handleChange}
                        className={`input w-full ${errors.merchantId ? 'border-red-500' : ''}`}
                      >
                        <option value="">{locale === 'en' ? 'Select Merchant' : 'اختر التاجر'}</option>
                        {merchants.map(merchant => (
                          <option key={merchant.id} value={merchant.id}>
                            {merchant.companyName || merchant.name}
                          </option>
                        ))}
                      </select>
                      {errors.merchantId && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.merchantId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Weight (kg)' : 'الوزن (كجم)'}
                      </label>
                      <div className="relative">
                        <Weight className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.weight === null || formData.weight === undefined ? '' : formData.weight}
                          onChange={(e) => handleNumberChange(e, 'weight')}
                          className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.weight ? 'border-red-500' : ''}`}
                          placeholder={locale === 'en' ? 'Enter weight' : 'أدخل الوزن'}
                        />
                      </div>
                      {errors.weight && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.weight}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Dimensions' : 'الأبعاد'}
                      </label>
                      <div className="relative">
                        <Box className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                        <input
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleChange}
                          className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                          placeholder={locale === 'en' ? 'e.g., 30x20x15 cm' : 'مثال: 30x20x15 سم'}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Notes' : 'ملاحظات'}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="input w-full"
                      placeholder={locale === 'en' ? 'Additional notes about the shipment...' : 'ملاحظات إضافية حول الشحنة...'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing and Assignment */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b p-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    {locale === 'en' ? 'Pricing' : 'التسعير'}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Declared Value (EGP)' : 'القيمة المعلنة (جنيه)'} *
                    </label>
                    <div className="relative">
                      <DollarSign className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.declaredValue}
                        onChange={(e) => handleNumberChange(e, 'declaredValue')}
                        className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.declaredValue ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.declaredValue && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.declaredValue}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Shipping Cost (EGP)' : 'تكلفة الشحن (جنيه)'} *
                    </label>
                    <div className="relative">
                      <DollarSign className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.shippingCost}
                        onChange={(e) => handleNumberChange(e, 'shippingCost')}
                        className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.shippingCost ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.shippingCost && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.shippingCost}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'COD Amount (EGP)' : 'مبلغ الدفع عند الاستلام (جنيه)'}
                    </label>
                    <div className="relative">
                      <DollarSign className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.codAmount}
                        onChange={(e) => handleNumberChange(e, 'codAmount')}
                        className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full ${errors.codAmount ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.codAmount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.codAmount}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignment Card */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b p-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    {locale === 'en' ? 'Assignment' : 'التعيين'}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Status' : 'الحالة'} *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label[locale]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Driver' : 'السائق'}
                    </label>
                    <div className="relative">
                      <Truck className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <select
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleChange}
                        className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                      >
                        <option value="">{locale === 'en' ? 'Select Driver' : 'اختر السائق'}</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} {driver.vehicleNumber && `(${driver.vehicleNumber})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Warehouse' : 'المستودع'}
                    </label>
                    <div className="relative">
                      <Warehouse className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <select
                        name="warehouseId"
                        value={formData.warehouseId}
                        onChange={handleChange}
                        className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
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
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-4">
                  {locale === 'en' ? 'Summary' : 'ملخص'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">
                      {locale === 'en' ? 'Shipping Cost' : 'تكلفة الشحن'}
                    </span>
                    <span className="font-medium text-blue-900">
                      EGP {formData.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  {formData.codAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">
                        {locale === 'en' ? 'COD Amount' : 'مبلغ الدفع عند الاستلام'}
                      </span>
                      <span className="font-medium text-green-600">
                        EGP {formData.codAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-900">
                        {locale === 'en' ? 'Total Value' : 'القيمة الإجمالية'}
                      </span>
                      <span className="font-bold text-blue-900">
                        EGP {(formData.declaredValue + formData.shippingCost + formData.codAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Mobile) */}
          <div className="lg:hidden bg-white border-t p-4 fixed bottom-0 left-0 right-0 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push(`/admin/shipments/${id}`)}
                className="btn btn-secondary flex-1 mr-2"
              >
                {locale === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1 ml-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {locale === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                  </>
                ) : (
                  locale === 'en' ? 'Save Changes' : 'حفظ التغييرات'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}