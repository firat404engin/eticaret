"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaLaptopCode, 
  FaSignOutAlt, 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaEnvelope, 
  FaChartLine,
  FaBars,
  FaTimes,
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSave,
  FaFilter
} from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Login Panel bileşeni - minimalist tasarım
const LoginPanel = ({ onLogin }) => {
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
      // Örnek giriş kontrolü
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        setTimeout(() => {
          setIsLoading(false);
          onLogin({ name: 'Admin User', email: credentials.email, role: 'admin' });
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-5">
      <div className="bg-gray-800 rounded-2xl overflow-hidden w-full max-w-5xl flex shadow-2xl">
        {/* İllüstrasyon Alanı - Sol Taraf */}
        <div className="w-0 md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-10 flex items-center justify-center relative hidden md:block">
          <div className="relative w-80">
            {/* Dekoratif Elementler */}
            <div className="absolute w-6 h-6 rounded-full bg-purple-200 opacity-30 top-0 left-20 animate-pulse"></div>
            <div className="absolute w-10 h-10 rounded-full bg-yellow-300 opacity-20 -top-10 -left-5"></div>
            <div className="absolute w-8 h-8 rounded-full bg-blue-300 opacity-20 bottom-0 right-10"></div>
            <div className="absolute w-5 h-5 rounded-full bg-red-300 opacity-30 -bottom-10 left-10"></div>
            
            {/* Merkez İllüstrasyon */}
            <div className="w-full h-72 border-2 border-purple-300/20 rounded-lg bg-gray-900/50 shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-400/90"></div>
              
              {/* Admin Simge */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 rounded-full bg-purple-100/90 flex items-center justify-center relative">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-purple-600" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-300 rounded flex items-center justify-center transform translate-x-1/4 translate-y-1/4">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-800" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex flex-col space-y-2">
                <div className="w-1/2 h-2.5 bg-white/30 rounded-full"></div>
                <div className="w-3/4 h-2.5 bg-white/20 rounded-full"></div>
              </div>
            </div>
            
            <div className="w-20 h-6 bg-gray-700 rounded-md mx-auto -mt-1"></div>
            <div className="w-12 h-4 bg-gray-600 rounded-b-lg mx-auto"></div>
            
            {/* Dekoratif Çizgiler */}
            <div className="absolute border-2 border-dashed border-purple-300/20 rounded-full w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
          </div>
        </div>
        
        {/* Form Alanı - Sağ Taraf */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <div className="h-1 w-20 bg-purple-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-medium text-white">Admin Kullanıcı Girişi</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="johndoe@xyz.com"
                  className="w-full px-4 py-3.5 bg-gray-700/50 text-white placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-gray-700/50 text-white placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-300 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-300 text-sm px-4 py-2 bg-red-500/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="!mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm uppercase font-medium py-3.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    GİRİŞ YAPILIYOR...
                  </span>
                ) : "GİRİŞ"}
              </button>
            </div>
            
            <div className="text-center text-gray-400 text-sm !mt-6">
              <p>Şifrenizi mi unuttunuz?</p>
              <p className="text-purple-400 mt-1">Yardım alın.</p>
            </div>
          </form>
          
          <div className="mt-10 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
            <p className="text-gray-400">Demo giriş bilgileri: admin@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Özet Kartları
const DashboardSummary = () => {
  const summaryData = [
    { 
      title: 'Toplam Ürün', 
      value: '24', 
      icon: FaBox, 
      color: 'from-blue-500 to-blue-600', 
      bgColor: 'bg-gray-800',
      increase: '+12%', 
      trend: 'up',
      iconColor: 'text-blue-500'
    },
    { 
      title: 'Toplam Sipariş', 
      value: '142', 
      icon: FaShoppingCart, 
      color: 'from-emerald-500 to-emerald-600', 
      bgColor: 'bg-gray-800',
      increase: '+18%', 
      trend: 'up',
      iconColor: 'text-emerald-500'
    },
    { 
      title: 'Müşteriler', 
      value: '89', 
      icon: FaUsers, 
      color: 'from-purple-500 to-purple-600', 
      bgColor: 'bg-gray-800',
      increase: '+7%',
      trend: 'up',
      iconColor: 'text-purple-500'
    },
    { 
      title: 'Mesajlar', 
      value: '16', 
      icon: FaEnvelope, 
      color: 'from-amber-500 to-amber-600', 
      bgColor: 'bg-gray-800',
      increase: '+24%', 
      trend: 'up',
      iconColor: 'text-amber-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {summaryData.map((item, index) => (
        <div key={index} className={`${item.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-700`}>
          <div className="p-5 relative">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                <item.icon className="text-lg" />
              </div>
              
              <div className={`flex items-center ${item.trend === 'up' ? 'text-emerald-400' : 'text-red-400'} text-xs font-medium px-2 py-1 rounded-full ${item.trend === 'up' ? 'bg-emerald-900/40' : 'bg-red-900/40'} border ${item.trend === 'up' ? 'border-emerald-800' : 'border-red-800'}`}>
                {item.trend === 'up' ? (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {item.increase}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-400">{item.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{item.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Aktivite Grafiği
const ActivityChart = () => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const values = [65, 45, 75, 50, 85, 35, 60];
  const maxValue = Math.max(...values);
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white">Haftalık Aktivite</h3>
        <div className="flex space-x-2">
          <select className="text-sm border border-gray-600 rounded px-2 py-1 bg-gray-700 text-gray-200">
            <option>Son Hafta</option>
            <option>Son Ay</option>
            <option>Son 3 Ay</option>
          </select>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-end h-48 space-x-4">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full rounded-t-md bg-gradient-to-t ${index === 4 ? 'from-blue-600 to-blue-400' : 'from-blue-500 to-blue-400'} relative group transition-all duration-200 hover:from-blue-700 hover:to-blue-500`}
                style={{ height: `${(values[index] / maxValue) * 80}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs transition-opacity whitespace-nowrap border border-gray-700">
                  {values[index]} işlem
                </div>
              </div>
              <div className="text-xs font-medium text-gray-400 mt-2">{day}</div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6 border-t border-gray-700 pt-4">
          <div className="flex space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Siparişler</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Ziyaretler</span>
            </div>
          </div>
          
          <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center">
            Detaylı Rapor
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Hızlı Bilgiler Bileşeni
const QuickInfo = () => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 h-full border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Hızlı Bilgiler</h3>
        <button className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full transition-colors flex items-center">
          Son Hafta
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800/50 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-blue-300">En Çok Satan Ürün</h4>
            <span className="text-xs text-blue-300 bg-blue-800/50 px-2 py-0.5 rounded-full">%32</span>
          </div>
          <p className="text-gray-300 text-sm">Mobil Uygulama Geliştirme</p>
        </div>
        
        <div className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-800/50 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-emerald-300">Bu Ayki Ciro</h4>
            <span className="text-xs text-emerald-300 bg-emerald-800/50 px-2 py-0.5 rounded-full">+18%</span>
          </div>
          <p className="text-gray-300 text-sm">42,850 TL</p>
        </div>
        
        <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-800/50 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-amber-300">Tamamlanma Oranı</h4>
            <span className="text-xs text-amber-300 bg-amber-800/50 px-2 py-0.5 rounded-full">%85</span>
          </div>
          <div className="relative w-full bg-amber-800/30 rounded-full h-2 mt-1">
            <div className="absolute top-0 left-0 h-full bg-amber-500 rounded-full" style={{width: '85%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Son Siparişler Tablosu
const RecentOrders = () => {
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      customer: 'Ali Yılmaz', 
      email: 'ali@example.com',
      products: 'Mobil Uygulama Geliştirme', 
      date: '2023-09-15', 
      total: '4,499 TL', 
      status: 'tamamlandı',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg' 
    },
    { 
      id: 2, 
      customer: 'Merve Demir', 
      email: 'merve@example.com',
      products: 'E-Ticaret Çözümleri', 
      date: '2023-09-14', 
      total: '8,999 TL', 
      status: 'işleniyor',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
    },
    { 
      id: 3, 
      customer: 'Ahmet Kaya', 
      email: 'ahmet@example.com',
      products: 'SEO Danışmanlığı', 
      date: '2023-09-12', 
      total: '1,499 TL', 
      status: 'beklemede',
      avatar: 'https://randomuser.me/api/portraits/men/59.jpg' 
    },
    { 
      id: 4, 
      customer: 'Zeynep Yıldız', 
      email: 'zeynep@example.com',
      products: 'Web Tasarım Paketi', 
      date: '2023-09-10', 
      total: '3,299 TL', 
      status: 'tamamlandı',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg' 
    },
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'beklemede': return 'bg-amber-900/30 text-amber-300 border border-amber-800/50';
      case 'işleniyor': return 'bg-blue-900/30 text-blue-300 border border-blue-800/50';
      case 'tamamlandı': return 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/50';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white">Son Siparişler</h3>
        <div className="flex items-center space-x-2">
          <button className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded transition-colors">
            <FaFilter className="inline mr-1 text-gray-400" size={12} /> Filtrele
          </button>
          <button className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded transition-colors">
            Bu hafta
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/40">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sipariş</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Müşteri</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ürün/Hizmet</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tarih</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tutar</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-700/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-400">#{order.id.toString().padStart(4, '0')}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover border border-gray-600" src={order.avatar} alt={order.customer} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{order.customer}</div>
                      <div className="text-sm text-gray-400">{order.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{order.products}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(order.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{order.total}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-2">
                    <button className="p-1.5 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 transition-colors">
                      <FaEye size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg bg-emerald-900/30 text-emerald-400 hover:bg-emerald-800/50 transition-colors">
                      <FaPencilAlt size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/40 flex justify-between items-center">
        <p className="text-sm text-gray-400">Toplam 24 siparişten 4 sipariş gösteriliyor</p>
        <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center">
          Tüm siparişleri görüntüle <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  );
};

// Ürün Yönetimi Bileşeni
const ProductsManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Mobil Uygulama Geliştirme', category: 'Yazılım', price: '4499', stock: 10 },
    { id: 2, name: 'E-Ticaret Çözümleri', category: 'Web', price: '8999', stock: 5 },
    { id: 3, name: 'SEO Danışmanlığı', category: 'Pazarlama', price: '1499', stock: 20 },
    { id: 4, name: 'Web Tasarım Paketi', category: 'Web', price: '3299', stock: 15 },
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white">Ürün Yönetimi</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-200 placeholder-gray-400"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors shadow-md"
            onClick={() => {
              setCurrentProduct({ id: '', name: '', category: '', price: '', stock: '' });
              setIsEditing(true);
            }}
          >
            <FaPlus className="mr-2" /> Yeni Ürün
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/40">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ürün Adı</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kategori</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fiyat</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stok</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">#{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 border border-blue-800/50 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.price} TL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="text-blue-400 hover:text-blue-300 p-1.5 bg-blue-900/30 rounded-lg hover:bg-blue-800/50 transition-colors inline-flex"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-300 p-1.5 bg-red-900/30 rounded-lg hover:bg-red-800/50 transition-colors inline-flex"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-white">
                {currentProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Kategori
                </label>
                <select
                  id="category"
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                >
                  <option value="">Kategori Seçin</option>
                  <option value="Yazılım">Yazılım</option>
                  <option value="Web">Web</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Pazarlama">Pazarlama</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                  Fiyat (TL)
                </label>
                <input
                  type="number"
                  id="price"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-1">
                  Stok
                </label>
                <input
                  type="number"
                  id="stock"
                  value={currentProduct.stock}
                  onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (currentProduct.id) {
                      setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
                    } else {
                      const newId = Math.max(...products.map(p => p.id), 0) + 1;
                      setProducts([...products, {...currentProduct, id: newId}]);
                    }
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center shadow-md"
                >
                  <FaSave className="mr-2" />
                  {currentProduct.id ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// İletişim Mesajları Yönetimi
const ContactMessagesManagement = () => {
  const [messages, setMessages] = useState([
    { id: 1, name: 'Ayşe Kılıç', email: 'ayse@example.com', message: 'Mobil uygulama geliştirme hizmetiniz hakkında bilgi almak istiyorum.', date: '2023-09-14', read: true },
    { id: 2, name: 'Mehmet Yıldız', email: 'mehmet@example.com', message: 'Web site tasarımı için fiyat teklifiniz nedir?', date: '2023-09-13', read: false },
    { id: 3, name: 'Zeynep Demir', email: 'zeynep@example.com', message: 'SEO danışmanlık hizmetiniz için görüşmek istiyorum.', date: '2023-09-12', read: false },
  ]);
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    // Mesajı okundu olarak işaretle
    if (!message.read) {
      setMessages(messages.map(m => 
        m.id === message.id ? {...m, read: true} : m
      ));
    }
  };
  
  const handleDeleteMessage = (id) => {
    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      setMessages(messages.filter(message => message.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="px-6 py-5 border-b border-gray-700">
        <h3 className="font-semibold text-white">İletişim Mesajları</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1 border-r border-gray-700">
          <div className="overflow-y-auto max-h-96">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                  selectedMessage && selectedMessage.id === message.id ? 'bg-gray-700/70' : ''
                } ${!message.read ? 'bg-blue-900/20' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white flex items-center">
                    {!message.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                    )}
                    {message.name}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(message.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2 p-6">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-white">{selectedMessage.name}</h4>
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1.5 bg-red-900/30 rounded-lg hover:bg-red-800/50"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-gray-200">E-posta:</strong> {selectedMessage.email}
                </p>
                <p className="text-sm text-gray-300">
                  <strong className="text-gray-200">Tarih:</strong> {new Date(selectedMessage.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg text-gray-300 border border-gray-600">
                {selectedMessage.message}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-md">
                  Yanıtla
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Görüntülemek için bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Ana Sidebar ve Dashboard
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPanel onLogin={handleLogin} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'products', label: 'Ürünler', icon: FaBox },
    { id: 'orders', label: 'Siparişler', icon: FaShoppingCart },
    { id: 'messages', label: 'Mesajlar', icon: FaEnvelope },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-10 border-b border-gray-700">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mr-2 transition-colors">
              <FaBars className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg">
                <FaLaptopCode />
              </div>
              <span className="font-semibold text-lg text-white">Admin</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Merhaba, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Çıkış
            </button>
          </div>
        </div>
      </header>
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-20 h-full pt-16 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="h-full bg-gray-800 shadow-lg overflow-y-auto py-8 border-r border-gray-700">
          <nav className="px-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className={`text-lg ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                    {isSidebarOpen && (
                      <span className="ml-4 font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`pt-20 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <div className="flex space-x-3">
                  <button className="flex items-center text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-colors">
                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Rapor İndir
                  </button>
                </div>
              </div>
              
              <DashboardSummary />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <ActivityChart />
                </div>
                <div className="lg:col-span-1">
                  <QuickInfo />
                </div>
              </div>
              
              <RecentOrders />
            </>
          )}
          
          {activeTab === 'products' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-6">Ürün Yönetimi</h1>
              <ProductsManagement />
            </>
          )}
          
          {activeTab === 'orders' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-6">Sipariş Yönetimi</h1>
              <RecentOrders />
            </>
          )}
          
          {activeTab === 'messages' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-6">İletişim Mesajları</h1>
              <ContactMessagesManagement />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 