'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Building,
  DollarSign,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useLocale } from '../../../src/app/contexts/LocaleContext';

// Simple translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      nav: {
        dashboard: 'Dashboard',
        shipments: 'Shipments',
        customers: 'Customers',
        drivers: 'Drivers',
        merchants: 'Merchants',
        warehouses: 'Warehouses',
        financial: 'Financial',
        analytics: 'Analytics',
        settings: 'Settings',
      },
      notifications: {
        title: 'Notifications',
        markAllRead: 'Mark all as read',
        viewAll: 'View all notifications',
        noNotifications: 'No new notifications',
        types: {
          shipment: 'Shipment',
          payment: 'Payment',
          system: 'System',
          driver: 'Driver',
          merchant: 'Merchant',
        },
      },
      general: {
        logout: 'Logout',
        adminPanel: 'Admin Panel',
        admin: 'Admin',
        administrator: 'Administrator',
        english: 'English',
        arabic: 'العربية',
      },
    },
    ar: {
      nav: {
        dashboard: 'لوحة التحكم',
        shipments: 'الشحنات',
        customers: 'العملاء',
        drivers: 'المناديب',
        merchants: 'التجار',
        warehouses: 'التخزين',
        financial: 'المالية',
        analytics: 'التحليلات',
        settings: 'الإعدادات',
      },
      notifications: {
        title: 'الإشعارات',
        markAllRead: 'تحديد الكل كمقروء',
        viewAll: 'عرض جميع الإشعارات',
        noNotifications: 'لا توجد إشعارات جديدة',
        types: {
          shipment: 'شحنة',
          payment: 'دفعة',
          system: 'نظام',
          driver: 'سائق',
          merchant: 'تاجر',
        },
      },
      general: {
        logout: 'تسجيل الخروج',
        adminPanel: 'لوحة الإدارة',
        admin: 'مدير',
        administrator: 'مسؤول',
        english: 'English',
        arabic: 'العربية',
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

// Enhanced notifications data with better structure
const mockNotifications = [
  {
    id: '1',
    type: 'shipment',
    title: 'Shipment Delivered',
    message: 'Shipment #TRK0012345 has been successfully delivered',
    time: '10 minutes ago',
    read: false,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    accentColor: 'border-green-500',
    status: 'success',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of EGP 1,500 received from Merchant ABC',
    time: '1 hour ago',
    read: false,
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    accentColor: 'border-emerald-500',
    status: 'success',
  },
  {
    id: '3',
    type: 'system',
    title: 'System Alert',
    message: 'Warehouse capacity is at 85%. Consider redistribution.',
    time: '2 hours ago',
    read: true,
    icon: AlertCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    accentColor: 'border-amber-500',
    status: 'warning',
  },
  {
    id: '4',
    type: 'driver',
    title: 'Driver Status Changed',
    message: 'Driver Mohamed Ahmed is now offline',
    time: '3 hours ago',
    read: true,
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    accentColor: 'border-blue-500',
    status: 'info',
  },
  {
    id: '5',
    type: 'merchant',
    title: 'New Merchant Request',
    message: 'New merchant registration request pending approval',
    time: '5 hours ago',
    read: true,
    icon: ShoppingBag,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    accentColor: 'border-purple-500',
    status: 'info',
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { locale, toggleLocale } = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const pathname = usePathname();
  const isRTL = locale === 'ar';

  const navigation = [
    { name: getTranslation(locale, 'nav.dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
    { name: getTranslation(locale, 'nav.shipments'), href: '/admin/shipments', icon: Package },
    { name: getTranslation(locale, 'nav.customers'), href: '/admin/customers', icon: Users },
    { name: getTranslation(locale, 'nav.drivers'), href: '/admin/drivers', icon: Truck },
    { name: getTranslation(locale, 'nav.merchants'), href: '/admin/merchants', icon: Users },
    { name: getTranslation(locale, 'nav.warehouses'), href: '/admin/warehouses', icon: Building },
    { name: getTranslation(locale, 'nav.financial'), href: '/admin/financial', icon: DollarSign },
    { name: getTranslation(locale, 'nav.analytics'), href: '/admin/analytics', icon: BarChart3 },
    { name: getTranslation(locale, 'nav.settings'), href: '/admin/settings', icon: Settings },
  ];

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shipment': return CheckCircle;
      case 'payment': return DollarSign;
      case 'system': return AlertCircle;
      case 'driver': return Truck;
      case 'merchant': return ShoppingBag;
      default: return Bell;
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsOpen && !(event.target as Element).closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  // Format notification message with emphasis
  const formatMessage = (message: string) => {
    // Extract parts that should be bold (like amounts, codes, names)
    const boldParts = message.match(/(#TRK\d+|EGP\s[\d,]+|Merchant\s\w+|Driver\s\w+|85%)/g);
    
    if (!boldParts) return message;

    let formatted = message;
    boldParts.forEach(part => {
      formatted = formatted.replace(
        part, 
        `<span class="font-semibold text-gray-900">${part}</span>`
      );
    });
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-gray-800">
              {getTranslation(locale, 'general.adminPanel')}
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          {/* Logout in mobile sidebar */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>{getTranslation(locale, 'general.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="flex items-center h-16 px-6 border-b">
            <span className="text-xl font-bold text-gray-800">
              {getTranslation(locale, 'general.adminPanel')}
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          {/* Logout in desktop sidebar */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>{getTranslation(locale, 'general.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-30 flex items-center h-16 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between flex-1 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {navigation.find((item) => item.href === pathname)?.name || getTranslation(locale, 'nav.dashboard')}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications dropdown */}
              <div className="relative notifications-dropdown">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50">
                    {/* Notifications header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {getTranslation(locale, 'notifications.title')}
                        </h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {getTranslation(locale, 'notifications.markAllRead')}
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-sm text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
                              title={locale === 'en' ? 'Clear all' : 'مسح الكل'}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            const formattedMessage = formatMessage(notification.message);
                            
                            return (
                              <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                                  !notification.read ? 'bg-blue-50/50' : ''
                                } ${notification.accentColor} ${
                                  !notification.read ? 'border-l-4' : 'border-l-2 border-transparent'
                                }`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex gap-3">
                                  <div className={`flex-shrink-0 w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${notification.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-semibold text-gray-900">
                                            {notification.title}
                                          </p>
                                          {!notification.read && (
                                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                          )}
                                        </div>
                                        <p 
                                          className="text-sm text-gray-600 mt-1 leading-relaxed"
                                          dangerouslySetInnerHTML={{ __html: formattedMessage }}
                                        />
                                      </div>
                                      <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {notification.time}
                                      </span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                      <span className={`text-xs px-2 py-1 rounded-full ${notification.bgColor} ${notification.color} font-medium`}>
                                        {getTranslation(locale, `notifications.types.${notification.type}`)}
                                      </span>
                                      {notification.status === 'success' && (
                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" />
                                          {locale === 'en' ? 'Success' : 'نجاح'}
                                        </span>
                                      )}
                                      {notification.status === 'warning' && (
                                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          {locale === 'en' ? 'Alert' : 'تنبيه'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">
                            {getTranslation(locale, 'notifications.noNotifications')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Notifications footer */}
                    {notifications.length > 0 && (
                      <div className="p-4 border-t">
                        <Link
                          href="/admin/notifications"
                          className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          {getTranslation(locale, 'notifications.viewAll')}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Language toggle */}
              <button
                onClick={toggleLocale}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {locale === 'en' ? getTranslation(locale, 'general.arabic') : getTranslation(locale, 'general.english')}
              </button>

              {/* User info dropdown */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {getTranslation(locale, 'general.admin')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getTranslation(locale, 'general.administrator')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}