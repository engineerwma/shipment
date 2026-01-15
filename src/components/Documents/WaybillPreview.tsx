'use client';

import { useState, useEffect } from 'react';
import { Printer, Download, X, Package, User, MapPin, DollarSign, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { printWaybill, downloadWaybill } from '@/lib/pdf-generator';
import { useTranslation, type Locale } from '@/lib/i18n';

interface WaybillPreviewProps {
  locale: Locale;
  shipment: {
    id: string;
    trackingNumber: string;
    barcode: string;
    createdAt: Date;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerZone: string;
    description: string;
    weight?: number;
    dimensions?: string;
    declaredValue: number;
    shippingCost: number;
    codAmount: number;
    status: string;
    notes?: string;
    merchant?: {
      name: string;
      companyName?: string;
      phone: string;
    };
  };
  onClose?: () => void;
}

export default function WaybillPreview({
  locale,
  shipment,
  onClose,
}: WaybillPreviewProps) {
  const { t, isRTL } = useTranslation(locale);
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const waybillData = {
        trackingNumber: shipment.trackingNumber,
        barcode: shipment.barcode,
        createdAt: shipment.createdAt,
        customerName: shipment.customerName,
        customerPhone: shipment.customerPhone,
        customerAddress: shipment.customerAddress,
        customerCity: shipment.customerCity,
        customerZone: shipment.customerZone,
        description: shipment.description,
        weight: shipment.weight,
        dimensions: shipment.dimensions,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        codAmount: shipment.codAmount,
        status: shipment.status,
        notes: shipment.notes,
        merchantName: shipment.merchant?.name || '',
        merchantCompany: shipment.merchant?.companyName || '',
        merchantPhone: shipment.merchant?.phone || '',
      };
      
      printWaybill(waybillData, locale);
    } catch (error) {
      console.error('Error printing waybill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const waybillData = {
        trackingNumber: shipment.trackingNumber,
        barcode: shipment.barcode,
        createdAt: shipment.createdAt,
        customerName: shipment.customerName,
        customerPhone: shipment.customerPhone,
        customerAddress: shipment.customerAddress,
        customerCity: shipment.customerCity,
        customerZone: shipment.customerZone,
        description: shipment.description,
        weight: shipment.weight,
        dimensions: shipment.dimensions,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        codAmount: shipment.codAmount,
        status: shipment.status,
        notes: shipment.notes,
        merchantName: shipment.merchant?.name || '',
        merchantCompany: shipment.merchant?.companyName || '',
        merchantPhone: shipment.merchant?.phone || '',
      };
      
      downloadWaybill(waybillData, locale);
    } catch (error) {
      console.error('Error downloading waybill:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">
              {locale === 'en' ? 'SHIPPING WAYBILL' : 'بوليصة شحن'}
            </h2>
            <p className="text-gray-600">
              {locale === 'en' 
                ? 'Shipping & Logistics Management System'
                : 'نظام إدارة الشحن والنقل'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{locale === 'en' ? 'Download' : 'تحميل'}</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{locale === 'en' ? 'Print' : 'طباعة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Company & Tracking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              {locale === 'en' ? 'Company Information' : 'معلومات الشركة'}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Fast Shipping Co.</p>
              <p className="text-gray-600">Cairo, Egypt</p>
              <p className="text-gray-600">Phone: +201234567890</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {locale === 'en' ? 'Tracking Information' : 'معلومات التتبع'}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <span className="font-medium">
                  {locale === 'en' ? 'Tracking #:' : 'رقم التتبع:'}
                </span>{' '}
                {shipment.trackingNumber}
              </p>
              <p>
                <span className="font-medium">
                  {locale === 'en' ? 'Created:' : 'تاريخ الإنشاء:'}
                </span>{' '}
                {formatDate(shipment.createdAt)}
              </p>
              <p>
                <span className="font-medium">
                  {locale === 'en' ? 'Barcode:' : 'الباركود:'}
                </span>{' '}
                {shipment.barcode}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Merchant Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {locale === 'en' ? 'Receiver Information' : 'معلومات المستلم'}
            </h3>
            <div className="border rounded-lg p-4">
              <p className="font-medium">{shipment.customerName}</p>
              <p className="text-gray-600">{shipment.customerPhone}</p>
              <p className="text-gray-600">{shipment.customerAddress}</p>
              <p className="text-gray-600">
                {shipment.customerCity}, {shipment.customerZone}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {locale === 'en' ? 'Sender Information' : 'معلومات المرسل'}
            </h3>
            <div className="border rounded-lg p-4">
              <p className="font-medium">{shipment.merchant?.name}</p>
              <p className="text-gray-600">{shipment.merchant?.companyName}</p>
              <p className="text-gray-600">{shipment.merchant?.phone}</p>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            {locale === 'en' ? 'Shipment Details' : 'تفاصيل الشحنة'}
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {locale === 'en' ? 'Description' : 'الوصف'}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {locale === 'en' ? 'Weight (kg)' : 'الوزن (كجم)'}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {locale === 'en' ? 'Dimensions' : 'الأبعاد'}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {locale === 'en' ? 'Status' : 'الحالة'}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3">{shipment.description}</td>
                  <td className="px-4 py-3">{shipment.weight || '-'}</td>
                  <td className="px-4 py-3">{shipment.dimensions || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {shipment.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Details */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {locale === 'en' ? 'Financial Details' : 'التفاصيل المالية'}
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {locale === 'en' ? 'Item' : 'البند'}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {locale === 'en' ? 'Amount (EGP)' : 'المبلغ (جنية)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3">
                    {locale === 'en' ? 'Declared Value' : 'القيمة المعلنة'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(shipment.declaredValue, 'EGP')}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">
                    {locale === 'en' ? 'Shipping Cost' : 'تكلفة الشحن'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(shipment.shippingCost, 'EGP')}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">
                    {locale === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(shipment.codAmount, 'EGP')}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 font-bold">
                    {locale === 'en' ? 'Total' : 'المجموع'}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {formatCurrency(shipment.shippingCost + shipment.codAmount, 'EGP')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {shipment.notes && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              {locale === 'en' ? 'Notes' : 'ملاحظات'}
            </h3>
            <div className="border rounded-lg p-4 bg-yellow-50">
              <p className="text-gray-700">{shipment.notes}</p>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            {locale === 'en' ? 'Terms & Conditions' : 'الشروط والأحكام'}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {locale === 'en' ? (
              <>
                <p>1. Shipment must be inspected upon delivery.</p>
                <p>2. Any damage must be reported within 24 hours.</p>
                <p>3. Cash on Delivery must be paid in cash.</p>
                <p>4. The company is not responsible for delays due to unforeseen circumstances.</p>
              </>
            ) : (
              <>
                <p>1. يجب فحص الشحنة عند الاستلام.</p>
                <p>2. أي ضرر يجب الإبلاغ عنه خلال 24 ساعة.</p>
                <p>3. الدفع عند الاستلام يجب أن يكون نقداً.</p>
                <p>4. الشركة غير مسئولة عن التأخير بسبب ظروف غير متوقعة.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}