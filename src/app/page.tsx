'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      switch (userData.role) {
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
          router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}