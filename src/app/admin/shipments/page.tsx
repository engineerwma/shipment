'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Printer,
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Upload,
  X,
  AlertCircle,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { useLocale } from '../../../app/contexts/LocaleContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';

// Simple translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      status: {
        NEW: 'New',
        IN_RECEIPT: 'In Receipt',
        IN_WAREHOUSE: 'In Warehouse',
        WITH_DRIVER: 'With Driver',
        DELIVERED: 'Delivered',
        DELIVERY_FAILED: 'Delivery Failed',
        RETURNED: 'Returned',
        PARTIAL_RETURNED: 'Partial Return',
      },
      common: {
        shipments: 'Shipments',
        actions: 'Actions',
        loading: 'Loading...',
        trackingNumber: 'Tracking #',
        customer: 'Customer',
        merchant: 'Merchant',
        status: 'Status',
        amount: 'Amount',
        date: 'Date',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        allStatus: 'All Status',
        dateRange: 'Date Range',
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
        refresh: 'Refresh',
        confirmDelete: 'Are you sure?',
        yes: 'Yes',
        no: 'No',
        success: 'Success',
        error: 'Error',
        downloadTemplate: 'Download Template',
        bulkUpload: 'Bulk Upload',
        uploadCompleted: 'Upload completed',
        totalRows: 'Total rows',
        successful: 'Successful',
        failed: 'Failed',
        errors: 'Errors',
        row: 'Row',
        close: 'Close',
        selectFile: 'Select File',
        uploadingShipments: 'Uploading shipments...',
      },
      shipments: {
        title: 'Shipments Management',
        description: 'Manage and track all shipments',
        printReport: 'Print Report',
        export: 'Export',
        newShipment: 'New Shipment',
        searchPlaceholder: 'Search by tracking, customer...',
        total: 'Total',
        withDriver: 'With Driver',
        deliveredToday: 'Delivered Today',
        pending: 'Pending',
        loadingShipments: 'Loading shipments...',
        confirmDelete: 'Delete this shipment?',
        deleteSuccess: 'Shipment deleted successfully',
        deleteError: 'Failed to delete shipment',
        fetchError: 'Failed to fetch shipments',
        noShipments: 'No shipments found',
        today: 'Today',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        bulkUploadSuccess: 'Bulk upload completed successfully',
        bulkUploadError: 'Failed to upload shipments',
        templateDownloadSuccess: 'Template downloaded successfully',
        templateDownloadError: 'Failed to download template',
        dragDropExcel: 'Drag & drop an Excel file here, or click to select',
        supportsExcel: 'Supports .xlsx, .xls files (max 5MB)',
        uploadCompleted: 'Upload completed',
      },
    },
    ar: {
      status: {
        NEW: 'جديد',
        IN_RECEIPT: 'في الاستلام',
        IN_WAREHOUSE: 'في المستودع',
        WITH_DRIVER: 'مع السائق',
        DELIVERED: 'تم التسليم',
        DELIVERY_FAILED: 'فشل التسليم',
        RETURNED: 'مرتجع',
        PARTIAL_RETURNED: 'مرتجع جزئي',
      },
      common: {
        shipments: 'الشحنات',
        actions: 'الإجراءات',
        loading: 'جاري التحميل...',
        trackingNumber: 'رقم التتبع',
        customer: 'العميل',
        merchant: 'التاجر',
        status: 'الحالة',
        amount: 'المبلغ',
        date: 'التاريخ',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        search: 'بحث',
        allStatus: 'كل الحالات',
        dateRange: 'النطاق الزمني',
        previous: 'السابق',
        next: 'التالي',
        showing: 'عرض',
        to: 'إلى',
        of: 'من',
        results: 'نتيجة',
        refresh: 'تحديث',
        confirmDelete: 'هل أنت متأكد؟',
        yes: 'نعم',
        no: 'لا',
        success: 'نجاح',
        error: 'خطأ',
        downloadTemplate: 'تحميل القالب',
        bulkUpload: 'رفع جماعي',
        uploadCompleted: 'اكتمل الرفع',
        totalRows: 'إجمالي الصفوف',
        successful: 'ناجح',
        failed: 'فاشل',
        errors: 'الأخطاء',
        row: 'صف',
        close: 'إغلاق',
        selectFile: 'اختر ملف',
        uploadingShipments: 'جاري رفع الشحنات...',
      },
      shipments: {
        title: 'إدارة الشحنات',
        description: 'إدارة وتتبع جميع الشحنات',
        printReport: 'طباعة تقرير',
        export: 'تصدير',
        newShipment: 'شحنة جديدة',
        searchPlaceholder: 'ابحث برقم التتبع، العميل...',
        total: 'الإجمالي',
        withDriver: 'مع السائق',
        deliveredToday: 'تم التسليم اليوم',
        pending: 'معلق',
        loadingShipments: 'جاري تحميل الشحنات...',
        confirmDelete: 'حذف هذه الشحنة؟',
        deleteSuccess: 'تم حذف الشحنة بنجاح',
        deleteError: 'فشل حذف الشحنة',
        fetchError: 'فشل تحميل الشحنات',
        noShipments: 'لا توجد شحنات',
        today: 'اليوم',
        thisWeek: 'هذا الأسبوع',
        thisMonth: 'هذا الشهر',
        bulkUploadSuccess: 'تم الرفع الجماعي بنجاح',
        bulkUploadError: 'فشل رفع الشحنات',
        templateDownloadSuccess: 'تم تحميل القالب بنجاح',
        templateDownloadError: 'فشل تحميل القالب',
        dragDropExcel: 'اسحب وأفلت ملف إكسل هنا، أو انقر للاختيار',
        supportsExcel: 'يدعم ملفات .xlsx, .xls (بحد أقصى 5 ميجابايت)',
        uploadCompleted: 'اكتمل الرفع',
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

interface Shipment {
  id: string;
  trackingNumber: string;
  barcode: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  customerZone: string;
  status: string;
  shippingCost: number;
  codAmount: number;
  declaredValue: number;
  description: string;
  weight?: number;
  dimensions?: string;
  createdAt: string;
  merchant: {
    id: string;
    name: string;
    companyName?: string;
    email: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  warehouse?: {
    id: string;
    name: string;
    city: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UploadResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
  createdIds: string[];
}

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  result?: UploadResult;
  showModal: boolean;
}

export default function AdminShipmentsPage() {
  const { locale } = useLocale();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    showModal: false,
  });
  const itemsPerPage = 10;

  const isRTL = locale === 'ar';

  // Fetch shipments from API
  const fetchShipments = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      // Handle date range
      if (dateRangeFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();

        switch (dateRangeFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }

        params.append('startDate', startDate.toISOString());
        params.append('endDate', now.toISOString());
      }

      const response = await fetch(`/api/shipments?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch shipments');
      }

      const data = await response.json();
      setShipments(data.shipments);
      setFilteredShipments(data.shipments);
      setTotalPages(data.pagination.pages);
      setTotalItems(data.pagination.total);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error(getTranslation(locale, 'shipments.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchShipments();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchShipments(currentPage);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  // Handle search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchShipments(1);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, dateRangeFilter]);

  // Handle delete shipment
  const handleDelete = async (id: string) => {
    if (!confirm(getTranslation(locale, 'shipments.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete shipment');
      }

      toast.success(getTranslation(locale, 'shipments.deleteSuccess'));
      fetchShipments(currentPage); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting shipment:', error);
      toast.error(error.message || getTranslation(locale, 'shipments.deleteError'));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchShipments(page);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = [
      'Tracking Number',
      'Barcode',
      'Customer Name',
      'Customer Phone',
      'Customer City',
      'Status',
      'Shipping Cost',
      'COD Amount',
      'Merchant',
      'Created At'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredShipments.map(shipment => [
        shipment.trackingNumber,
        shipment.barcode,
        `"${shipment.customerName}"`,
        shipment.customerPhone,
        shipment.customerCity,
        getTranslation(locale, `status.${shipment.status}`),
        shipment.shippingCost,
        shipment.codAmount,
        shipment.merchant.companyName || shipment.merchant.name,
        new Date(shipment.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shipments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Upload Functions
  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/shipments/template');
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shipment_template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(getTranslation(locale, 'shipments.templateDownloadSuccess'));
    } catch (error) {
      console.error('Template download error:', error);
      toast.error(getTranslation(locale, 'shipments.templateDownloadError'));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  if (!file) return;

  // Validate file type
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    toast.error(locale === 'en' 
      ? 'Please upload Excel files only (.xlsx, .xls)' 
      : 'يرجى رفع ملفات إكسل فقط (.xlsx, .xls)');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error(locale === 'en' 
      ? 'File size should be less than 5MB' 
      : 'يجب أن يكون حجم الملف أقل من 5 ميجابايت');
    return;
  }

  setUploadProgress({
    isUploading: true,
    progress: 0,
    showModal: true,
    result: undefined,
  });

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }));
    }, 300);

    // IMPORTANT: Include credentials to send cookies
    const response = await fetch('/api/shipments/bulk', {
      method: 'POST',
      body: formData,
      credentials: 'include', // This sends cookies with the request
    });

    clearInterval(progressInterval);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || getTranslation(locale, 'shipments.bulkUploadError'));
    }

    setUploadProgress({
      isUploading: false,
      progress: 100,
      showModal: true,
      result,
    });

    // Refresh shipments list
    fetchShipments(currentPage);

    toast.success(
      `${getTranslation(locale, 'shipments.bulkUploadSuccess')}: ${result.successful} ${getTranslation(locale, 'common.successful')}, ${result.failed} ${getTranslation(locale, 'common.failed')}`
    );

  } catch (error: any) {
    console.error('Upload error:', error);
    setUploadProgress(prev => ({
      ...prev,
      isUploading: false,
    }));
    
    // Show more detailed error message
    let errorMessage = error.message;
    if (error.message.includes('Unauthorized')) {
      errorMessage = locale === 'en' 
        ? 'Please login again to upload files' 
        : 'يرجى تسجيل الدخول مرة أخرى لرفع الملفات';
    }
    
    toast.error(errorMessage || getTranslation(locale, 'shipments.bulkUploadError'));
  }
}, [locale, currentPage, fetchShipments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    disabled: uploadProgress.isUploading,
  });

  const closeUploadModal = () => {
    setUploadProgress({
      isUploading: false,
      progress: 0,
      showModal: false,
      result: undefined,
    });
  };

  // Status options
  const statusOptions = [
    { value: 'ALL', label: getTranslation(locale, 'common.allStatus') },
    { value: 'NEW', label: getTranslation(locale, 'status.NEW') },
    { value: 'IN_RECEIPT', label: getTranslation(locale, 'status.IN_RECEIPT') },
    { value: 'IN_WAREHOUSE', label: getTranslation(locale, 'status.IN_WAREHOUSE') },
    { value: 'WITH_DRIVER', label: getTranslation(locale, 'status.WITH_DRIVER') },
    { value: 'DELIVERED', label: getTranslation(locale, 'status.DELIVERED') },
    { value: 'DELIVERY_FAILED', label: getTranslation(locale, 'status.DELIVERY_FAILED') },
    { value: 'RETURNED', label: getTranslation(locale, 'status.RETURNED') },
    { value: 'PARTIAL_RETURNED', label: getTranslation(locale, 'status.PARTIAL_RETURNED') },
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: getTranslation(locale, 'common.allStatus') },
    { value: 'today', label: getTranslation(locale, 'shipments.today') },
    { value: 'week', label: getTranslation(locale, 'shipments.thisWeek') },
    { value: 'month', label: getTranslation(locale, 'shipments.thisMonth') },
  ];

  // Calculate stats from real data
  const statCards = [
    { 
      label: getTranslation(locale, 'shipments.total'), 
      value: totalItems, 
      icon: Package, 
      color: 'bg-blue-500',
      description: locale === 'en' ? 'Total shipments' : 'إجمالي الشحنات'
    },
    { 
      label: getTranslation(locale, 'shipments.withDriver'), 
      value: shipments.filter((s) => s.status === 'WITH_DRIVER').length, 
      icon: Truck, 
      color: 'bg-indigo-500',
      description: locale === 'en' ? 'Currently with drivers' : 'حالياً مع السائقين'
    },
    { 
      label: getTranslation(locale, 'shipments.deliveredToday'), 
      value: shipments.filter((s) => {
        const today = new Date();
        const shipmentDate = new Date(s.createdAt);
        return s.status === 'DELIVERED' && 
               shipmentDate.toDateString() === today.toDateString();
      }).length, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      description: locale === 'en' ? 'Delivered today' : 'تم التسليم اليوم'
    },
    { 
      label: getTranslation(locale, 'shipments.pending'), 
      value: shipments.filter((s) => s.status === 'NEW' || s.status === 'IN_RECEIPT').length, 
      icon: Clock, 
      color: 'bg-yellow-500',
      description: locale === 'en' ? 'Awaiting processing' : 'في انتظار المعالجة'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return CheckCircle;
      case 'WITH_DRIVER': return Truck;
      case 'IN_WAREHOUSE': return Package;
      case 'NEW': return Clock;
      case 'DELIVERY_FAILED': return XCircle;
      case 'RETURNED': return Clock;
      case 'PARTIAL_RETURNED': return Clock;
      case 'IN_RECEIPT': return Package;
      default: return Package;
    }
  };

  // Upload Modal Component
  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {getTranslation(locale, 'common.bulkUpload')}
            </h3>
            <button
              onClick={closeUploadModal}
              className="text-gray-400 hover:text-gray-600"
              disabled={uploadProgress.isUploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {uploadProgress.isUploading ? (
            <div className="space-y-4">
              <div className="text-center">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600 mb-2">
                  {getTranslation(locale, 'common.uploadingShipments')}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {uploadProgress.progress}%
                </p>
              </div>
            </div>
          ) : uploadProgress.result ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${uploadProgress.result.failed === 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="flex items-start">
                  {uploadProgress.result.failed === 0 ? (
                    <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
                  )}
                  <div>
                    <p className="font-medium">
                      {getTranslation(locale, 'common.uploadCompleted')}
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        {getTranslation(locale, 'common.totalRows')}: {uploadProgress.result.total}
                      </p>
                      <p className="text-green-600">
                        {getTranslation(locale, 'common.successful')}: {uploadProgress.result.successful}
                      </p>
                      <p className="text-red-600">
                        {getTranslation(locale, 'common.failed')}: {uploadProgress.result.failed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {uploadProgress.result.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {getTranslation(locale, 'common.errors')}:
                  </h4>
                  <div className="max-h-48 overflow-y-auto border rounded">
                    {uploadProgress.result.errors.map((error, index) => (
                      <div 
                        key={index} 
                        className="p-3 border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {getTranslation(locale, 'common.row')} {error.row}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          {error.error}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeUploadModal}
                  className="btn btn-secondary flex-1"
                >
                  {getTranslation(locale, 'common.close')}
                </button>
                {uploadProgress.result.failed > 0 && (
                  <button
                    onClick={downloadTemplate}
                    className="btn btn-primary flex-1"
                  >
                    {getTranslation(locale, 'common.downloadTemplate')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4">
                {getTranslation(locale, 'shipments.dragDropExcel')}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {getTranslation(locale, 'shipments.supportsExcel')}
              </p>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button className="btn btn-primary w-full">
                  {getTranslation(locale, 'common.selectFile')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer
        position={isRTL ? 'top-left' : 'top-right'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {uploadProgress.showModal && <UploadModal />}

      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getTranslation(locale, 'shipments.title')}
            </h1>
            <p className="text-gray-600">
              {getTranslation(locale, 'shipments.description')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadTemplate}
              className="btn btn-secondary flex items-center gap-2"
              disabled={uploadProgress.isUploading}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{getTranslation(locale, 'common.downloadTemplate')}</span>
            </button>

            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                className="btn btn-secondary flex items-center gap-2"
                disabled={uploadProgress.isUploading}
              >
                <Upload className="w-4 h-4" />
                <span>{getTranslation(locale, 'common.bulkUpload')}</span>
              </button>
            </div>

            <button
              onClick={() => fetchShipments(currentPage)}
              className="btn btn-secondary flex items-center gap-2"
              disabled={loading || uploadProgress.isUploading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{getTranslation(locale, 'common.refresh')}</span>
            </button>
            
            <button
              onClick={handleExport}
              className="btn btn-secondary flex items-center gap-2"
              disabled={uploadProgress.isUploading}
            >
              <Download className="w-4 h-4" />
              <span>{getTranslation(locale, 'shipments.export')}</span>
            </button>
            
            <Link
              href="/admin/shipments/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(locale, 'shipments.newShipment')}</span>
            </Link>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'common.search')}
              </label>
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(locale, 'shipments.searchPlaceholder')}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation(locale, 'common.status')}
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
                {getTranslation(locale, 'common.dateRange')}
              </label>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value as any)}
                className="input w-full"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                &nbsp;
              </label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="input flex-1" 
                  dir="ltr"
                  onChange={(e) => {
                    // Handle custom date range
                    if (e.target.value) {
                      setDateRangeFilter('all');
                    }
                  }}
                />
                <span className="self-center text-gray-500">
                  {getTranslation(locale, 'common.to')}
                </span>
                <input 
                  type="date" 
                  className="input flex-1" 
                  dir="ltr"
                  onChange={(e) => {
                    // Handle custom date range
                    if (e.target.value) {
                      setDateRangeFilter('all');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipments table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">
                {getTranslation(locale, 'shipments.loadingShipments')}
              </p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getTranslation(locale, 'shipments.noShipments')}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'ALL' || dateRangeFilter !== 'all'
                  ? 'Try changing your filters'
                  : 'Create your first shipment to get started'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <button className="btn btn-secondary inline-flex items-center gap-2 mb-2 sm:mb-0">
                    <Upload className="w-4 h-4" />
                    {getTranslation(locale, 'common.bulkUpload')}
                  </button>
                </div>
                <Link
                  href="/admin/shipments/new"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {getTranslation(locale, 'shipments.newShipment')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.trackingNumber')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.customer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.merchant')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getTranslation(locale, 'common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredShipments.map((shipment) => {
                      const StatusIcon = getStatusIcon(shipment.status);
                      return (
                        <tr key={shipment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono font-medium text-blue-600">
                              {shipment.trackingNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {shipment.barcode}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{shipment.customerName}</div>
                            <div className="text-sm text-gray-500">
                              {shipment.customerPhone}
                            </div>
                            <div className="text-xs text-gray-400">
                              {shipment.customerCity}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{shipment.merchant.name}</div>
                            <div className="text-sm text-gray-500">
                              {shipment.merchant.companyName || shipment.merchant.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                shipment.status
                              )}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {getTranslation(locale, `status.${shipment.status}`)}
                            </span>
                            {shipment.driver && (
                              <div className="text-xs text-gray-500 mt-1">
                                {locale === 'en' ? 'Driver: ' : 'السائق: '}
                                {shipment.driver.name}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">
                              EGP {shipment.shippingCost.toFixed(2)}
                            </div>
                            {shipment.codAmount > 0 && (
                              <div className="text-xs text-green-600">
                                COD: EGP {shipment.codAmount.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(shipment.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                            <div className="text-xs text-gray-400">
                              {new Date(shipment.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/shipments/${shipment.id}`}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title={getTranslation(locale, 'common.view')}
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/admin/shipments/${shipment.id}/edit`}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title={getTranslation(locale, 'common.edit')}
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(shipment.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                title={getTranslation(locale, 'common.delete')}
                                disabled={shipment.status !== 'NEW'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {getTranslation(locale, 'common.showing')} {(currentPage - 1) * itemsPerPage + 1} {getTranslation(locale, 'common.to')} {Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    )} {getTranslation(locale, 'common.of')} {totalItems} {getTranslation(locale, 'common.results')}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {getTranslation(locale, 'common.previous')}
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 border rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {getTranslation(locale, 'common.next')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
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
