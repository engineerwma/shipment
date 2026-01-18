'use client';

import { useState } from 'react';
import { 
  Bell, 
  Package, 
  DollarSign, 
  AlertCircle, 
  Truck, 
  Users,
  Check,
  Trash2,
  Filter,
  Search,
  CheckCircle,
  Clock,
  MessageSquare,
  ShoppingBag,
  X,
  MoreVertical,
  Mail,
  Smartphone,
  Globe,
  FileText,
  Save,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useLocale } from '@/app/contexts/LocaleContext';

type NotificationType = 'shipment' | 'payment' | 'system' | 'driver' | 'merchant' | 'general';
type NotificationStatus = 'all' | 'unread' | 'read';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  icon: any;
  color: string;
  bgColor: string;
}

// Translation function
const getTranslation = (locale: 'en' | 'ar', key: string): string => {
  const translations = {
    en: {
      common: {
        search: 'Search',
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        view: 'View',
        delete: 'Delete',
        actions: 'Actions',
        loading: 'Loading...',
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
        new: 'New',
        save: 'Save',
        settings: 'Settings',
        clearAll: 'Clear all',
        markAsRead: 'Mark as read',
        markAsUnread: 'Mark as unread',
        deleteSelected: 'Delete selected',
        selectAll: 'Select all',
        selected: 'selected',
        clearFilters: 'Clear all filters',
        filters: 'Filters',
      },
      notifications: {
        title: 'Notifications Center',
        description: 'Manage and monitor all system notifications',
        notifications: 'Notifications',
        markAllAsRead: 'Mark All as Read',
        notificationSettings: 'Notification Settings',
        totalNotifications: 'Total Notifications',
        unreadNotifications: 'Unread Notifications',
        highPriority: 'High Priority',
        searchPlaceholder: 'Search notifications...',
        status: 'Status:',
        type: 'Type:',
        priority: 'Priority:',
        allTypes: 'All',
        shipment: 'Shipment',
        payment: 'Payment',
        system: 'System',
        driver: 'Driver',
        merchant: 'Merchant',
        general: 'General',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        allStatus: 'All',
        unread: 'Unread',
        read: 'Read',
        noNotifications: 'No notifications found',
        noNotificationsDescription: 'Try adjusting your filters or check back later for new notifications.',
        showingResults: 'Showing 1-{count} of {total} notifications',
        emailNotifications: 'Email notifications',
        pushNotifications: 'Push notifications',
        smsNotifications: 'SMS notifications',
        highPriorityAlerts: 'High priority alerts',
        shipmentUpdates: 'Shipment updates',
        systemAlerts: 'System alerts',
        paymentNotifications: 'Payment notifications',
        weeklyReports: 'Weekly reports',
        driverUpdates: 'Driver updates',
        saveSettings: 'Save Settings',
      },
    },
    ar: {
      common: {
        search: 'بحث',
        previous: 'السابق',
        next: 'التالي',
        showing: 'عرض',
        to: 'إلى',
        of: 'من',
        view: 'عرض',
        delete: 'حذف',
        actions: 'الإجراءات',
        loading: 'جاري التحميل...',
        all: 'الكل',
        active: 'نشط',
        inactive: 'غير نشط',
        new: 'جديد',
        save: 'حفظ',
        settings: 'الإعدادات',
        clearAll: 'مسح الكل',
        markAsRead: 'تحديد كمقروء',
        markAsUnread: 'تحديد كغير مقروء',
        deleteSelected: 'حذف المحدد',
        selectAll: 'تحديد الكل',
        selected: 'محدد',
        clearFilters: 'مسح جميع الفلاتر',
        filters: 'الفلاتر',
      },
      notifications: {
        title: 'مركز الإشعارات',
        description: 'إدارة ومراقبة جميع إشعارات النظام',
        notifications: 'الإشعارات',
        markAllAsRead: 'تحديد الكل كمقروء',
        notificationSettings: 'إعدادات الإشعارات',
        totalNotifications: 'إجمالي الإشعارات',
        unreadNotifications: 'إشعارات غير مقروءة',
        highPriority: 'أولوية عالية',
        searchPlaceholder: 'ابحث في الإشعارات...',
        status: 'الحالة:',
        type: 'النوع:',
        priority: 'الأولوية:',
        allTypes: 'الكل',
        shipment: 'الشحن',
        payment: 'الدفع',
        system: 'النظام',
        driver: 'السائق',
        merchant: 'التاجر',
        general: 'عام',
        high: 'عالي',
        medium: 'متوسط',
        low: 'منخفض',
        allStatus: 'الكل',
        unread: 'غير مقروء',
        read: 'مقروء',
        noNotifications: 'لم يتم العثور على إشعارات',
        noNotificationsDescription: 'حاول تعديل الفلاتر الخاصة بك أو تحقق لاحقًا للحصول على إشعارات جديدة.',
        showingResults: 'عرض 1-{count} من {total} إشعار',
        emailNotifications: 'إشعارات البريد الإلكتروني',
        pushNotifications: 'إشعارات الدفع',
        smsNotifications: 'إشعارات الرسائل القصيرة',
        highPriorityAlerts: 'تنبيهات أولوية عالية',
        shipmentUpdates: 'تحديثات الشحن',
        systemAlerts: 'تنبيهات النظام',
        paymentNotifications: 'إشعارات الدفع',
        weeklyReports: 'التقارير الأسبوعية',
        driverUpdates: 'تحديثات السائقين',
        saveSettings: 'حفظ الإعدادات',
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

export default function NotificationsPage() {
  const { locale, setLocale } = useLocale();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'shipment',
      title: 'Shipment Delivered Successfully',
      message: 'Shipment #TRK0012345 has been delivered to Ahmed Mohamed in Cairo',
      time: 'Just now',
      timestamp: new Date(),
      read: false,
      priority: 'high',
      actionUrl: '/admin/shipments/TRK0012345',
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of EGP 2,500 received from Tech Store merchant',
      time: '10 minutes ago',
      timestamp: new Date(Date.now() - 10 * 60000),
      read: false,
      priority: 'high',
      actionUrl: '/admin/financial',
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Alert: High Warehouse Capacity',
      message: 'Main warehouse is at 92% capacity. Consider immediate redistribution.',
      time: '30 minutes ago',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      priority: 'high',
      actionUrl: '/admin/warehouses',
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      id: '4',
      type: 'driver',
      title: 'Driver Status Changed',
      message: 'Driver Mohamed Ahmed has been offline for more than 2 hours',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
      priority: 'medium',
      actionUrl: '/admin/drivers',
      icon: Truck,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      id: '5',
      type: 'merchant',
      title: 'New Merchant Registration',
      message: 'New merchant "Fashion Hub" has registered and needs approval',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 120 * 60000),
      read: true,
      priority: 'medium',
      actionUrl: '/admin/merchants',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      id: '6',
      type: 'shipment',
      title: 'Shipment Delayed',
      message: 'Shipment #TRK0012346 is delayed due to weather conditions',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 180 * 60000),
      read: true,
      priority: 'medium',
      actionUrl: '/admin/shipments/TRK0012346',
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      id: '7',
      type: 'payment',
      title: 'Withdrawal Request',
      message: 'Merchant "Electro World" requested withdrawal of EGP 5,000',
      time: '5 hours ago',
      timestamp: new Date(Date.now() - 300 * 60000),
      read: true,
      priority: 'low',
      actionUrl: '/admin/financial',
      icon: DollarSign,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
    {
      id: '8',
      type: 'system',
      title: 'System Update Available',
      message: 'New system version 2.5.0 is available for installation',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60000),
      read: true,
      priority: 'low',
      actionUrl: '/admin/settings',
      icon: AlertCircle,
      color: 'text-teal-500',
      bgColor: 'bg-teal-100',
    },
    {
      id: '9',
      type: 'general',
      title: 'Weekly Report Generated',
      message: 'Weekly performance report for last week is ready to view',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 48 * 60 * 60000),
      read: true,
      priority: 'low',
      actionUrl: '/admin/analytics',
      icon: FileText,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
    },
    {
      id: '10',
      type: 'driver',
      title: 'Driver Performance Alert',
      message: 'Driver Ali Hassan has low delivery success rate this month',
      time: '3 days ago',
      timestamp: new Date(Date.now() - 72 * 60 * 60000),
      read: true,
      priority: 'medium',
      actionUrl: '/admin/drivers',
      icon: Truck,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
  ]);

  const [filter, setFilter] = useState<NotificationStatus>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const isRTL = locale === 'ar';

  // Calculate statistics
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  // Filter notifications based on selected filters
  const filteredNotifications = notifications.filter(notification => {
    // Status filter
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    
    // Type filter
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    // Priority filter
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.type.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setSelectedNotifications(prev => prev.filter(notifId => notifId !== id));
  };

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    setSelectedNotifications(prev => prev.filter(notifId => notifId !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setSelectedNotifications([]);
  };

  const markSelectedAsRead = () => {
    setNotifications(notifications.map(notif => 
      selectedNotifications.includes(notif.id) ? { ...notif, read: true } : notif
    ));
    setSelectedNotifications([]);
  };

  const deleteSelected = () => {
    setNotifications(notifications.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'shipment': return Package;
      case 'payment': return DollarSign;
      case 'system': return AlertCircle;
      case 'driver': return Truck;
      case 'merchant': return Users;
      default: return Bell;
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Clock;
    }
  };

  const t = (key: string) => getTranslation(locale, key);

  return (
    <DashboardLayout 
      role="ADMIN"
      locale={locale}
      onLocaleChange={setLocale}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t('notifications.title')}
              </h1>
              <p className="text-gray-600">
                {t('notifications.description')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t('notifications.markAllAsRead')}
              </button>
              <button
                onClick={deleteSelected}
                disabled={selectedNotifications.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {t('common.deleteSelected')}
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {t('notifications.totalNotifications')}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">{totalNotifications}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {t('notifications.unreadNotifications')}
                  </p>
                  <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {t('notifications.highPriority')}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">{highPriorityCount}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('notifications.searchPlaceholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'pr-10' : 'pl-10'}`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-2 border rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>{t('common.filters')}</span>
            </button>

            {/* Filters - Desktop */}
            <div className={`lg:flex lg:items-center lg:gap-4 ${showMobileFilters ? 'block' : 'hidden lg:flex'}`}>
              <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
                {/* Status filter */}
                <div className="space-x-2">
                  <span className="text-sm text-gray-600">{t('notifications.status')}</span>
                  {(['all', 'unread', 'read'] as NotificationStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        filter === status
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' 
                        ? t('notifications.allStatus')
                        : status === 'unread' 
                          ? t('notifications.unread')
                          : t('notifications.read')
                      }
                    </button>
                  ))}
                </div>

                {/* Type filter */}
                <div className="space-x-2">
                  <span className="text-sm text-gray-600">{t('notifications.type')}</span>
                  {(['all', 'shipment', 'payment', 'system', 'driver', 'merchant'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        typeFilter === type
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' 
                        ? t('notifications.allTypes')
                        : t(`notifications.${type}`)
                      }
                    </button>
                  ))}
                </div>

                {/* Priority filter */}
                <div className="space-x-2">
                  <span className="text-sm text-gray-600">{t('notifications.priority')}</span>
                  {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        priorityFilter === priority
                          ? priority === 'high' ? 'bg-red-100 text-red-600' :
                            priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t(`notifications.${priority}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications list */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Header with select all */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t('common.selectAll')}
                  </span>
                </label>
                {selectedNotifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedNotifications.length} {t('common.selected')}
                    </span>
                    <button
                      onClick={markSelectedAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {t('common.markAsRead')}
                    </button>
                    <button
                      onClick={deleteSelected}
                      className="text-sm text-red-600 hover:text-red-800 hover:underline"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredNotifications.length} {t('notifications.notifications')}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="divide-y">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const Icon = getTypeIcon(notification.type);
                const PriorityIcon = getPriorityIcon(notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleSelectNotification(notification.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 ${notification.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${notification.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {t('common.new')}
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                <PriorityIcon className="w-3 h-3 mr-1" />
                                {t(`notifications.${notification.priority}`)}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Icon className="w-4 h-4" />
                                {t(`notifications.${notification.type}`)}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {notification.time}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                              >
                                {t('common.view')}
                              </Link>
                            )}
                            
                            <div className="relative group">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10 hidden group-hover:block">
                                <div className="py-1">
                                  {notification.read ? (
                                    <button
                                      onClick={() => markAsUnread(notification.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      {t('common.markAsUnread')}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      {t('common.markAsRead')}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  >
                                    {t('common.delete')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {t('notifications.noNotifications')}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t('notifications.noNotificationsDescription')}
                </p>
                <button
                  onClick={() => {
                    setFilter('all');
                    setTypeFilter('all');
                    setPriorityFilter('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('common.clearFilters')}
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredNotifications.length > 0 && (
            <div className="px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {t('notifications.showingResults')
                    .replace('{count}', Math.min(filteredNotifications.length, 10).toString())
                    .replace('{total}', filteredNotifications.length.toString())
                  }
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 transition-colors">
                    {t('common.previous')}
                  </button>
                  <button className="px-3 py-1 border rounded-lg text-sm bg-blue-600 text-white">
                    1
                  </button>
                  <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 text-sm transition-colors">
                    2
                  </button>
                  <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 text-sm transition-colors">
                    {t('common.next')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification settings section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('notifications.notificationSettings')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  {t('notifications.emailNotifications')}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  {t('notifications.pushNotifications')}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">
                  {t('notifications.smsNotifications')}
                </span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  {t('notifications.highPriorityAlerts')}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  {t('notifications.shipmentUpdates')}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">
                  {t('notifications.systemAlerts')}
                </span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  {t('notifications.paymentNotifications')}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">
                  {t('notifications.weeklyReports')}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  {t('notifications.driverUpdates')}
                </span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              {t('notifications.saveSettings')}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}