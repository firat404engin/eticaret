"use client";

import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../../src/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Demo login logic - replace with actual authentication
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        setTimeout(() => {
          setIsLoading(false);
          // AuthContext aracılığıyla giriş yap
          login({ name: 'Admin User', email: credentials.email, role: 'admin' });
          // AuthContext router yönlendirmesini zaten halledecek
        }, 1000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setError('Geçersiz e-posta veya şifre');
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      setError('Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl flex">
        {/* Left Side - Illustration */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-12 relative">
          <div className="absolute inset-0 bg-black opacity-10 pattern-dots-lg"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
              <p className="text-indigo-100 mt-4 max-w-sm">
                Mağaza yönetimi için modern admin panelinize hoş geldiniz.
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="relative">
              <div className="w-64 h-64 bg-white bg-opacity-10 absolute -bottom-20 -left-20 rounded-full"></div>
              <div className="w-40 h-40 bg-white bg-opacity-10 absolute -top-10 -right-10 rounded-full"></div>
              
              {/* Center Illustration */}
              <div className="relative z-10 mt-10">
                <div className="w-72 mx-auto">
                  <svg viewBox="0 0 711 602" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
                    <path fillRule="evenodd" clipRule="evenodd" d="M283.566 171.647C254.586 171.647 231.066 195.167 231.066 224.147V376.353C231.066 405.333 254.586 428.854 283.566 428.854H479.934C508.914 428.854 532.434 405.333 532.434 376.353V224.147C532.434 195.167 508.914 171.647 479.934 171.647H283.566Z" fill="white" fillOpacity="0.2"/>
                    <rect x="267.5" y="216.5" width="227" height="167" rx="12.5" stroke="white" strokeOpacity="0.4" strokeWidth="5"/>
                    <rect x="267.5" y="258.5" width="227" height="83" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.4" strokeWidth="5"/>
                    <path d="M345 341H417" stroke="white" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round"/>
                    <circle cx="306" cy="300" r="16" fill="white" fillOpacity="0.4"/>
                    <path d="M381 216V160" stroke="white" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M411 155C411 171.569 397.569 185 381 185C364.431 185 351 171.569 351 155C351 138.431 364.431 125 381 125C397.569 125 411 138.431 411 155Z" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.4" strokeWidth="5"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="text-white text-sm opacity-70 mt-auto">
              © 2025 Örnek Ticaret. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Girişi</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Yönetim panelinize erişmek için giriş yapın</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={credentials.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Beni hatırla
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Şifremi unuttum
                  </a>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş Yapılıyor...
                    </>
                  ) : "Giriş Yap"}
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Demo giriş bilgileri: <span className="font-semibold">admin@example.com / password</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
