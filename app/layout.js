import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import CartProvider from './components/CartProvider';
import Navbar from './components/Navbar';

// Font tanımlamaları
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata = {
  title: 'AI Code Solutions | Modern Yazılım Çözümleri',
  description: 'Yapay zeka destekli profesyonel yazılım çözümleri ile işletmenizi dijital dünyada öne çıkarın.',
  keywords: 'yazılım, web geliştirme, mobil uygulama, masaüstü yazılım, api, veritabanı, yapay zeka',
  authors: [{ name: 'AI Code Solutions' }],
  creator: 'AI Code Solutions',
  publisher: 'AI Code Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body suppressHydrationWarning={true} className={`${inter.className} ${poppins.variable} dark:bg-gray-900 dark:text-gray-100 antialiased min-h-screen bg-gradient-to-b from-gray-50 to-white transition-all duration-300`}>
        <CartProvider>
          <Navbar />
          <main className="pt-16 md:pt-20">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8 mt-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Code Solutions</h3>
                  <p className="text-gray-400 text-sm">
                    Yapay zeka destekli profesyonel yazılım çözümleri.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hızlı Erişim</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="/" className="hover:text-blue-400 transition-colors">Ana Sayfa</a></li>
                    <li><a href="/products" className="hover:text-blue-400 transition-colors">Çözümlerimiz</a></li>
                    <li><a href="/about" className="hover:text-blue-400 transition-colors">Hakkımızda</a></li>
                    <li><a href="/contact" className="hover:text-blue-400 transition-colors">İletişim</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>İstanbul-çe, Türkiye</li>
                    <li>info@aicodesolitions.com</li>
                    <li>+90 555 123 45 67</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bana Ulaşın</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.linkedin.com/in/firatengin404/" target="_blank" rel="noopener" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62zm-10.5-10h-.03c-.01 0-.02 0-.03 0z"/></svg>
                    </a>
                    <a href="https://github.com/firat404engin" target="_blank" rel="noopener" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="GitHub">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.188 6.839 9.525.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.565 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.207 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"/></svg>
                    </a>
                    <a href="https://www.instagram.com/firatengin404/" target="_blank" rel="noopener" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Instagram">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-14a6 6 0 100 12A6 6 0 0012 6zm0 10a4 4 0 110-8 4 4 0 010 8z"/></svg>
                    </a>
                    <a href="https://firatengin-henna.vercel.app/" target="_blank" rel="noopener" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Kişisel Website">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-14a6 6 0 100 12A6 6 0 0012 6zm0 10a4 4 0 110-8 4 4 0 010 8z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} Tasarım & Kodlama: <a href="https://firatengin-henna.vercel.app/" target="_blank" rel="noopener" className="text-blue-400 hover:underline">Fırat Engin</a> <span className='text-red-500'>♥</span> Tüm hakları saklıdır.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}