"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    // Sayfa yüklendiğinde çerez ve localStorage'dan kullanıcı bilgilerini kontrol et
    const checkAuth = () => {
      // İlk olarak cookie'de admin var mı kontrol et
      const adminCookie = Cookies.get('admin');
      
      if (!adminCookie) {
        // Cookie yoksa kullanıcı giriş yapmamış demektir
        localStorage.removeItem('admin'); // Yanlış veri durumunu temizle
        setUser(null);
        setLoading(false);
        setIsAuthChecked(true);
        return;
      }
      
      // Admin verisi varsa parse et
      try {
        const adminData = JSON.parse(adminCookie);
        if (adminData && adminData.id && adminData.email) {
          setUser(adminData);
        } else {
          // Eksik veri, çıkış yap
          handleLogout();
        }
      } catch (error) {
        // JSON parse hatası, çıkış yap
        handleLogout();
      }
      
      setLoading(false);
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);
  
  // Çıkış yapmak için yardımcı fonksiyon
  const handleLogout = () => {
    Cookies.remove('admin', { path: '/' });
    localStorage.removeItem('admin');
    setUser(null);
  };

  // Sayfa yönlendirmelerini yönet
  useEffect(() => {
    // Kimlik kontrolü tamamlandıktan sonra yönlendirme yap
    if (!loading && isAuthChecked) {
      const isAdminPage = pathname?.startsWith('/admin');
      const isLoginPage = pathname === '/admin/login';
      
      // Eğer admin sayfasındaysa ve giriş yapmamışsa login'e yönlendir
      if (isAdminPage && !user && !isLoginPage) {
        console.log('Yetkisiz erişim, login sayfasına yönlendiriliyor...');
        router.push('/admin/login');
      }
      
      // Eğer login sayfasındaysa ve zaten giriş yapmışsa dashboard'a yönlendir
      if (isLoginPage && user) {
        console.log('Zaten giriş yapılmış, admin paneline yönlendiriliyor...');
        router.push('/admin');
      }
    }
  }, [loading, user, pathname, router, isAuthChecked]);

  // Giriş yap
  const login = (userData) => {
    if (!userData || !userData.email) {
      console.error('Geçersiz kullanıcı verisi');
      return;
    }
    
    console.log('Giriş yapılıyor:', userData.email);
    
    // Kullanıcı bilgilerini ayarla
    setUser(userData);
    
    // Cookie'ye kaydet (localStorage yerine sadece cookie kullanılacak)
    Cookies.set('admin', JSON.stringify(userData), { expires: 7, path: '/' });
    localStorage.setItem('admin', JSON.stringify(userData));
    
    // Admin paneline yönlendir
    router.push('/admin');
  };

  // Çıkış yap
  const logout = () => {
    console.log('Çıkış yapılıyor');
    
    // Tüm oturum verilerini temizle
    handleLogout();
    
    // Login sayfasına yönlendir
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Yetki kontrolü için bir yardımcı fonksiyon - CLIENT tarafında koruma
export function requireAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!loading && !user) {
        router.push('/admin/login');
      }
    }, [user, loading, router]);
    
    // Yüklenme durumunda veya kullanıcı yoksa bir şey gösterme
    if (loading || !user) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
    }
    
    return <Component {...props} />;
  };
}
