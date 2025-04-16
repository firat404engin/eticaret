import { NextResponse } from 'next/server';

export function middleware(request) {
  // Admin rotaları için kontrol
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Admin Cookie'sini kontrol et
    const adminCookie = request.cookies.get('admin');
    
    if (!adminCookie) {
      // Cookie yoksa login sayfasına yönlendir
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // Cookie'nin içeriğini kontrol et
      const admin = JSON.parse(adminCookie.value);
      
      // Admin bilgileri eksikse veya geçersizse login'e yönlendir
      if (!admin || !admin.id || !admin.email) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
    } catch (error) {
      // JSON parse hatası durumunda login'e yönlendir
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Bu middleware'in hangi yollarda çalışacağını belirten config
export const config = {
  matcher: ['/admin/:path*']
}; 