'use client';

import { ReactNode } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'ADMIN' | 'MERCHANT' | 'DRIVER' | 'OPERATIONS';
  locale: 'en' | 'ar';
  onLocaleChange: (locale: 'en' | 'ar') => void;
}

export default function DashboardLayout({
  children,
  role,
  locale,
  onLocaleChange,
}: DashboardLayoutProps) {
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Simplified header for now */}
      <header className="sticky top-0 z-30 flex items-center h-16 bg-white border-b shadow-sm px-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={() => onLocaleChange(locale === 'en' ? 'ar' : 'en')}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              {locale === 'en' ? 'العربية' : 'English'}
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">{children}</main>
    </div>
  );
}