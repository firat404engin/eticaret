"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import AdminSidebar from '../../src/components/Admin/AdminSidebar';
import AdminHeader from '../../src/components/Admin/AdminHeader';
import { AuthProvider } from '../../src/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      {isLoginPage ? (
        <div className={`${inter.className} min-h-screen`}>
          {children}
        </div>
      ) : (
        <div className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main content */}
            <div className="flex flex-col flex-1 ml-0 lg:ml-64 transition-all duration-300 ease-in-out">
              <AdminHeader />
              <main className="flex-1 p-6 sm:p-8 md:p-10 bg-white dark:bg-gray-800 rounded-tl-3xl shadow-inner transition-all">
                {children}
              </main>
            </div>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
