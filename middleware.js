import { NextResponse } from 'next/server';

export function middleware(request) {
  // Mevcut URL'i al
  const { pathname } = request.nextUrl;
  
  // Admin sayfalarını kontrol et
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // AdminUser token'ını kontrol et
    const adminToken = request.cookies.get('adminToken')?.value;
    
    // Eğer token yoksa login sayfasına yönlendir
    if (!adminToken) {
      console.log('Middleware: Yetkisiz erişim engellendi. Yönlendiriliyor:', pathname);
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Login sayfasındaysa ve zaten giriş yapmışsa admin paneline yönlendir
  if (pathname === '/admin/login') {
    const adminToken = request.cookies.get('adminToken')?.value;
    if (adminToken) {
      console.log('Middleware: Kullanıcı zaten giriş yapmış. Ana sayfaya yönlendiriliyor.');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

// Admin path'lerinde middleware'i çalıştır
export const config = {
  matcher: ['/admin/:path*']
}; 