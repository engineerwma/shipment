import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatCurrency } from './utils';

interface WaybillData {
  trackingNumber: string;
  barcode: string;
  createdAt: Date;
  
  // Customer info
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerZone: string;
  
  // Merchant info
  merchantName: string;
  merchantCompany: string;
  merchantPhone: string;
  
  // Shipment details
  description: string;
  weight?: number;
  dimensions?: string;
  
  // Pricing
  declaredValue: number;
  shippingCost: number;
  codAmount: number;
  
  // Status
  status: string;
  notes?: string;
  
  // Barcode data URL
  barcodeImage?: string;
}

export async function generateWaybillPDF(data: WaybillData, locale: 'en' | 'ar' = 'en'): Promise<jsPDF> {
  const doc = new jsPDF();
  const isRTL = locale === 'ar';
  
  // Set document direction
  if (isRTL) {
    doc.setLanguage('ar');
  }

  // Header
  doc.setFontSize(20);
  doc.setTextColor(33, 150, 243); // Blue color
  doc.text(isRTL ? 'بوليصة شحن' : 'SHIPPING WAYBILL', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(isRTL ? 'نظام إدارة الشحن والنقل' : 'Shipping & Logistics Management System', 105, 28, { align: 'center' });

  // Company Info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(isRTL ? 'معلومات الشركة:' : 'Company Information:', 14, 40);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(isRTL ? 'شركة الشحن السريع' : 'Fast Shipping Co.', 14, 46);
  doc.text(isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt', 14, 52);
  doc.text(isRTL ? 'هاتف: +201234567890' : 'Phone: +201234567890', 14, 58);

  // Tracking Info
  const trackingY = 40;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(isRTL ? 'معلومات التتبع:' : 'Tracking Information:', 160, trackingY);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`${isRTL ? 'رقم التتبع:' : 'Tracking #:'} ${data.trackingNumber}`, 160, trackingY + 6);
  doc.text(`${isRTL ? 'تاريخ الإنشاء:' : 'Created:'} ${formatDate(data.createdAt)}`, 160, trackingY + 12);
  doc.text(`${isRTL ? 'الباركود:' : 'Barcode:'} ${data.barcode}`, 160, trackingY + 18);

  // Customer & Merchant Info
  const customerData = [
    [
      isRTL ? 'المستلم:' : 'Receiver:',
      `${data.customerName}\n${data.customerPhone}\n${data.customerAddress}\n${data.customerCity}, ${data.customerZone}`
    ],
    [
      isRTL ? 'المرسل:' : 'Sender:',
      `${data.merchantName}\n${data.merchantCompany}\n${data.merchantPhone}`
    ],
  ];

  autoTable(doc, {
    startY: 70,
    head: [[isRTL ? 'النوع' : 'Type', isRTL ? 'المعلومات' : 'Information']],
    body: customerData,
    theme: 'grid',
    headStyles: { fillColor: [33, 150, 243] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 140 },
    },
  });

  // Shipment Details
  const shipmentDetails = [
    [isRTL ? 'الوصف:' : 'Description:', data.description],
    [isRTL ? 'الوزن (كجم):' : 'Weight (kg):', data.weight?.toString() || '-'],
    [isRTL ? 'الأبعاد:' : 'Dimensions:', data.dimensions || '-'],
    [isRTL ? 'الحالة:' : 'Status:', data.status],
  ];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    body: shipmentDetails,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  // Financial Details
  const financialData = [
    [isRTL ? 'القيمة المعلنة:' : 'Declared Value:', formatCurrency(data.declaredValue, 'EGP')],
    [isRTL ? 'تكلفة الشحن:' : 'Shipping Cost:', formatCurrency(data.shippingCost, 'EGP')],
    [isRTL ? 'الدفع عند الاستلام:' : 'Cash on Delivery:', formatCurrency(data.codAmount, 'EGP')],
    [isRTL ? 'المجموع:' : 'Total:', formatCurrency(data.shippingCost + data.codAmount, 'EGP')],
  ];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    body: financialData,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 100 },
    },
  });

  // Notes
  if (data.notes) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(isRTL ? 'ملاحظات:' : 'Notes:', 14, (doc as any).lastAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(data.notes, 14, (doc as any).lastAutoTable.finalY + 26, { maxWidth: 170 });
  }

  // Terms and Conditions
  const termsY = doc.internal.pageSize.height - 50;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  if (isRTL) {
    doc.text('الشروط والأحكام:', 14, termsY);
    doc.text('1. يجب فحص الشحنة عند الاستلام.', 14, termsY + 6);
    doc.text('2. أي ضرر يجب الإبلاغ عنه خلال 24 ساعة.', 14, termsY + 12);
    doc.text('3. الدفع عند الاستلام يجب أن يكون نقداً.', 14, termsY + 18);
  } else {
    doc.text('Terms & Conditions:', 14, termsY);
    doc.text('1. Shipment must be inspected upon delivery.', 14, termsY + 6);
    doc.text('2. Any damage must be reported within 24 hours.', 14, termsY + 12);
    doc.text('3. Cash on Delivery must be paid in cash.', 14, termsY + 18);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(isRTL ? 'تم إنشاء هذه البوليصة بواسطة نظام إدارة الشحن' : 'This waybill was generated by Logistics Management System', 105, doc.internal.pageSize.height - 10, { align: 'center' });

  return doc;
}

export function downloadWaybill(data: WaybillData, locale: 'en' | 'ar' = 'en'): void {
  generateWaybillPDF(data, locale).then((doc) => {
    doc.save(`waybill-${data.trackingNumber}.pdf`);
  });
}

export function printWaybill(data: WaybillData, locale: 'en' | 'ar' = 'en'): void {
  generateWaybillPDF(data, locale).then((doc) => {
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  });
}