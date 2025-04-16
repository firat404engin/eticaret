"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sayfa yüklendiğinde local storage'dan kullanıcı bilgilerini kontrol et
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAdminPage = pathname?.startsWith('/admin');
      const isLoginPage = pathname === '/admin/login';
      
      // Eğer admin sayfasındaysa ve giriş yapmamışsa login'e yönlendir
      if (isAdminPage && !user && !isLoginPage) {
        router.push('/admin/login');
      }
      
      // Eğer login sayfasındaysa ve zaten giriş yapmışsa dashboard'a yönlendir
      if (isLoginPage && user) {
        router.push('/admin');
      }
    }
  }, [loading, user, pathname, router]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
