import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '../../src/app/contexts/LocaleContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Logistics Dashboard',
  description: 'Admin dashboard for logistics management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}