'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ar';

interface LocaleContextType {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale) {
      setLocale(savedLocale);
    }
    setMounted(true);
  }, []);

  // Save locale to localStorage and update HTML lang attribute
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('locale', locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale, mounted]);

  const toggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}