'use client';

import { useEffect, useState } from 'react';

export type Locale = 'en' | 'ar';

const translations = {
  en: {
    common: {
      welcome: 'Welcome back! Please sign in to your account.',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions',
      dashboard: 'Dashboard',
      shipments: 'Shipments',
      drivers: 'Drivers',
      merchants: 'Merchants',
      warehouses: 'Warehouses',
      reports: 'Reports',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      login: 'Sign In',
    },
    messages: {
      success: {
        saved: 'Saved successfully',
        created: 'Created successfully',
        updated: 'Updated successfully',
        deleted: 'Deleted successfully',
      },
      error: {
        generic: 'Something went wrong. Please try again.',
        required: 'This field is required',
        invalidEmail: 'Invalid email address',
      },
    },
    navigation: {
      overview: 'Overview',
      newShipments: 'New Shipments',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      returns: 'Returns',
      financial: 'Financial',
      notifications: 'Notifications',
      users: 'Users',
      analytics: 'Analytics',
    },
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
  },
  ar: {
    common: {
      welcome: 'مرحباً بعودتك! يرجى تسجيل الدخول لحسابك.',
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      search: 'بحث',
      filter: 'تصفية',
      actions: 'الإجراءات',
      dashboard: 'لوحة التحكم',
      shipments: 'الشحنات',
      drivers: 'المناديب',
      merchants: 'التجار',
      warehouses: 'التخزين',
      reports: 'التقارير',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      
    },
    auth: {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      login: 'تسجيل الدخول',
    },
    messages: {
      success: {
        saved: 'تم الحفظ بنجاح',
        created: 'تم الإنشاء بنجاح',
        updated: 'تم التحديث بنجاح',
        deleted: 'تم الحذف بنجاح',
      },
      error: {
        generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
        required: 'هذا الحقل مطلوب',
        invalidEmail: 'بريد إلكتروني غير صالح',
      },
    },
    navigation: {
      overview: 'نظرة عامة',
      newShipments: 'شحنات جديدة',
      inTransit: 'قيد النقل',
      delivered: 'تم التسليم',
      returns: 'المرتجعات',
      financial: 'المالية',
      notifications: 'الإشعارات',
      users: 'المستخدمون',
      analytics: 'التحليلات',
    },
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
  },
};

export function useTranslation(locale: Locale) {
  const [t, setT] = useState(() => translations[locale]);

  useEffect(() => {
    setT(translations[locale]);
  }, [locale]);

  return {
    t,
    isRTL: locale === 'ar',
  };
}