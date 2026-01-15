'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Globe } from 'lucide-react';

type Locale = 'en' | 'ar';

const translations = {
  en: {
    common: {
      welcome: 'Welcome back! Please sign in to your account.',
      loading: 'Loading...',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      login: 'Sign In',
    },
    messages: {
      error: {
        generic: 'Something went wrong. Please try again.',
      },
    },
  },
  ar: {
    common: {
      welcome: 'مرحباً بعودتك! يرجى تسجيل الدخول لحسابك.',
      loading: 'جاري التحميل...',
    },
    auth: {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      login: 'تسجيل الدخول',
    },
    messages: {
      error: {
        generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
      },
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('en');
  const t = translations[locale];
  const isRTL = locale === 'ar';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set cookies for middleware
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=86400; SameSite=Lax`;
        
        // Redirect based on role
        switch (data.user.role) {
          case 'ADMIN':
            router.push('/admin/dashboard');
            break;
          case 'MERCHANT':
            router.push('/merchant/dashboard');
            break;
          case 'DRIVER':
            router.push('/driver/dashboard');
            break;
          case 'OPERATIONS':
            router.push('/operations/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setError(data.message || t.messages.error.generic);
      }
    } catch (err) {
      setError(t.messages.error.generic);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Language toggle */}
      <button
        onClick={toggleLocale}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
      >
        <Globe className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <span className="font-medium text-gray-700">{locale === 'en' ? 'العربية' : 'English'}</span>
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo and title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-200">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {locale === 'en' ? 'Logistics System' : 'نظام الشحن والنقل'}
          </h1>
          <p className="text-gray-600">
            {t.common.welcome}
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t.auth.email}
              </label>
              <div className="relative">
                <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'}`}
                  placeholder={locale === 'en' ? 'admin@example.com' : 'admin@example.com'}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`input ${isRTL ? 'pr-10' : 'pl-10'}`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.auth.rememberMe}</span>
              </label>
              
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                {t.auth.forgotPassword}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>{t.common.loading}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{t.auth.login}</span>
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-3">
              {locale === 'en' ? 'Demo Accounts:' : 'حسابات تجريبية:'}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <p className="font-semibold text-blue-900">Admin</p>
                <p className="text-blue-700">admin@logistics.com</p>
                <p className="text-blue-700">admin123</p>
              </div>
               <div className="bg-blue-50 p-2 rounded">
                <p className="font-semibold text-blue-900">driver</p>
                <p className="text-blue-700">driver1@logistics.com</p>
                <p className="text-blue-700">driver123</p>
              </div>
             <div className="bg-blue-50 p-2 rounded">
                <p className="font-semibold text-blue-900">merchant</p>
                <p className="text-blue-700">techstore@example.com</p>
                <p className="text-blue-700">merchant123</p>
              </div>
               <div className="bg-blue-50 p-2 rounded">
                <p className="font-semibold text-blue-900">operation</p>
                <p className="text-blue-700"> ops1@logistics.com</p>
                <p className="text-blue-700">ops123</p>
              </div>
            </div>
         
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {locale === 'en' ? '© 2024 Logistics System. All rights reserved.' : '© 2024 نظام الشحن والنقل. جميع الحقوق محفوظة.'}
        </p>
      </div>
    </div>
  );
}