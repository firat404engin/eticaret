"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { FaFilter, FaTag, FaShoppingCart, FaCode, FaLaptopCode, FaMobileAlt, FaServer, FaTools, FaSort, FaChevronDown, FaCircle, FaGithub, FaStar, FaArrowRight, FaLayerGroup, FaSlidersH, FaThList, FaThLarge, FaRegLightbulb, FaDatabase, FaCloud, FaBrain, FaRobot, FaCogs, FaCheck } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { useCart } from '../components/CartProvider';

// Supabase bağlantı bilgileri - Tek bir yerden yönetim için
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lldesfeuqsqwinofyzbk.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZGVzZmV1cXNxd2lub2Z5emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODUwODIsImV4cCI6MjA1OTk2MTA4Mn0.bPSJWbUIOy-1PpJfGC7YG0_40sqoEzAjLh1XmwQd0gI";

// Supabase client - Her seferinde yeniden oluşturulmaması için
const supabase = createClient(supabaseUrl, supabaseKey);

// Hero görsel URL'i - tek bir yerden yönetmek için
const heroImageUrl = "https://images.unsplash.com/photo-1607798748738-e15847dd5fda?q=80&w=1200&auto=format&fit=crop";

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('popular');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'all', name: 'Tüm Çözümler', icon: <FaLayerGroup /> },
    { id: 'web', name: 'Web Uygulamaları', icon: <FaLaptopCode /> },
    { id: 'mobile', name: 'Mobil Uygulamalar', icon: <FaMobileAlt /> },
    { id: 'desktop', name: 'Masaüstü Yazılımlar', icon: <FaServer /> },
    { id: 'api', name: 'API Servisleri', icon: <FaCode /> },
    { id: 'database', name: 'Veritabanı', icon: <FaDatabase /> },
    { id: 'cloud', name: 'Bulut Hizmetleri', icon: <FaCloud /> },
    { id: 'ai', name: 'Yapay Zeka', icon: <FaBrain /> },
    { id: 'automation', name: 'Otomasyon', icon: <FaRobot /> },
  ];
  
  const sortOptions = [
    { id: 'popular', name: 'Popülerlik', icon: <FaStar /> },
    { id: 'price-asc', name: 'Fiyat: Düşükten Yükseğe', icon: <FaSort /> },
    { id: 'price-desc', name: 'Fiyat: Yüksekten Düşüğe', icon: <FaSort /> },
    { id: 'newest', name: 'En Yeni', icon: <FaArrowRight /> },
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase.from('products').select('*');
        
        // Kategori filtresi uygula
        if (activeFilter !== 'all') {
          query = query.eq('category', activeFilter);
        }
        
        // Sıralama seçeneği uygula
        switch (activeSort) {
          case 'popular':
            query = query.order('popular', { ascending: false });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('popular', { ascending: false });
        }
        
        const { data, error: supabaseError } = await query;
        
        if (supabaseError) {
          throw new Error(supabaseError.message || 'Çözümler alınırken bir hata oluştu');
        }
        
        if (isMounted) {
          setProducts(data || []);
          setError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Çözümler yüklenirken hata:', error);
        if (isMounted) {
          setError(error.message || 'Çözümler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [activeFilter, activeSort]);

  // Ürün özelliklerini doğru formatta alma
  const getFeatures = (featuresString) => {
    if (!featuresString) return [];
    
    try {
      if (typeof featuresString === 'string') {
        if (featuresString.startsWith('[') && featuresString.endsWith(']')) {
          return JSON.parse(featuresString);
        } else {
          return featuresString.split(',').map(f => f.trim());
        }
      } else if (Array.isArray(featuresString)) {
        return featuresString;
      }
    } catch (error) {
      console.error("Features formatı hatalı:", error);
      // Hata durumunda string olarak ele alıp virgülle ayırma
      return typeof featuresString === 'string' 
        ? featuresString.split(',').map(f => f.trim()) 
        : [];
    }
    
    return [];
  };

  const calculateTotalPages = () => {
    return Math.ceil(products.length / 12);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= calculateTotalPages(); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Modern Tasarım */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Arka plan desenleri ve efektleri */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('https://cdn.jsdelivr.net/gh/htmlstrap/assets@main/pattern-grid.svg')] bg-center opacity-[0.15]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-blue-100 rounded-full text-sm font-medium border border-white/10">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Yenilikçi Yazılım Çözümleri
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200">
                Yazılım Çözümlerimiz
              </span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              İşletmeniz için özel olarak tasarlanmış yazılım çözümlerimizi keşfedin. 
              Yenilikçi, ölçeklenebilir ve güvenli uygulamalarımız dijital dönüşümünüze katkıda bulunur.
            </p>
            
            {/* Kategori butonları */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {categories.slice(0, 5).map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    activeFilter === category.id
                      ? 'bg-white text-indigo-700 shadow-lg shadow-indigo-700/20 font-medium scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Dalgalı alt kenar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full dark:block hidden">
            <path fill="#111827" fillOpacity="1" d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Mobil Filtreler Butonu */}
        <div className="md:hidden mb-6">
          <button 
            className="w-full py-3 px-4 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-xl flex items-center justify-center font-medium text-gray-700 dark:text-gray-300 transition-all border border-gray-100 dark:border-gray-700"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          >
            <FaSlidersH className="mr-2" />
            Filtreler ve Sıralama
            <FaChevronDown className={`ml-2 transition-transform ${showFiltersMobile ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtreler */}
          <div className={`md:w-1/4 lg:w-1/5 md:block ${showFiltersMobile ? 'block' : 'hidden'}`}>
            <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Kategoriler - Modern Tasarım */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white mr-2.5">
                    <FaFilter className="text-sm" />
                  </span>
                  Kategoriler
                </h3>
                
                <div className="space-y-1.5">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all flex items-center ${
                        activeFilter === category.id 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-sm' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setActiveFilter(category.id)}
                    >
                      <span className={`flex items-center justify-center w-7 h-7 rounded-full mr-2.5 ${
                        activeFilter === category.id 
                          ? 'bg-white/20 backdrop-blur-sm text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.icon}
                      </span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sıralama - Modern Tasarım */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white mr-2.5">
                    <FaSort className="text-sm" />
                  </span>
                  Sıralama
                </h3>
                
                <div className="space-y-1.5">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all flex items-center ${
                        activeSort === option.id 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-sm' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setActiveSort(option.id)}
                    >
                      <span className={`flex items-center justify-center w-7 h-7 rounded-full mr-2.5 ${
                        activeSort === option.id 
                          ? 'bg-white/20 backdrop-blur-sm text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.icon}
                      </span>
                      <span className="text-sm">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Ürün Listesi */}
          <div className="md:w-3/4 lg:w-4/5">
            {/* Özet Bilgisi */}
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="mb-2 md:mb-0">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {activeFilter === 'all' 
                    ? `${products.length} çözüm listeleniyor` 
                    : `${getCategoryName(activeFilter)} - ${products.length} çözüm listeleniyor`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">Görünüm:</span>
                <button 
                  className={`p-2 rounded-md ${viewMode === 'grid' 
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FaThLarge size={14} />
                </button>
                <button 
                  className={`p-2 rounded-md ${viewMode === 'list' 
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setViewMode('list')}
                >
                  <FaThList size={14} />
                </button>
              </div>
            </div>
            
            {/* Yükleme, Hata ve Boş Durumlar */}
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Çözümler Yükleniyor</h3>
                <p className="text-gray-500 dark:text-gray-400">Lütfen bekleyin, yazılım çözümlerimiz hazırlanıyor...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Yükleme Hatası</h3>
                <p className="text-red-700 dark:text-red-400 mb-6">{error}</p>
                <button 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center"
                  onClick={() => window.location.reload()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Yeniden Dene
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <FaRegLightbulb className="text-4xl text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Bu kategoride henüz çözüm bulunmamaktadır
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-colors inline-flex items-center shadow-md hover:shadow-lg"
                >
                  <FaLayerGroup className="mr-2" />
                  Tüm Çözümleri Göster
                </button>
              </div>
            ) : (
              <>
                {/* Grid görünümü */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
                
                {/* Liste görünümü */}
                {viewMode === 'list' && (
                  <div className="space-y-6">
                    {products.map(product => (
                      <div key={product.id} className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1 duration-300">
                        {/* Kategori etiketi */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryBadge(product.category)} shadow-sm`}>
                            <span className="mr-1">{getCategoryIcon(product.category)}</span>
                            {getCategoryName(product.category)}
                          </span>
                        </div>
                        
                        {/* Ürün resmi */}
                        <div className="relative w-full sm:w-48 h-48">
                          <Image
                            src={product.image_url || "https://via.placeholder.com/300x200?text=Ürün+Görseli"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 240px"
                          />
                        </div>
                        
                        {/* Ürün bilgileri */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <Link href={`/products/${product.id}`}>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                  {product.name}
                                </h3>
                              </Link>
                              <span className="text-lg font-bold text-gray-800 dark:text-white bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-3 py-1 rounded-lg">
                                {typeof product.price === 'number' 
                                  ? `${product.price.toLocaleString('tr-TR')}₺` 
                                  : product.price}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{product.description}</p>
                            
                            {/* Özellikler - Modern liste görünümü */}
                            {getFeatures(product.features).length > 0 && (
                              <div className="mb-4">
                                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <FaTag className="mr-2 text-indigo-500" />
                                  Yazılım Özellikleri
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {getFeatures(product.features).slice(0, 5).map((feature, index) => (
                                    <div key={index} 
                                      className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-xs font-medium text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30"
                                    >
                                      <FaCheck className="text-[8px] mr-1.5 text-green-500" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link 
                              href={`/products/${product.id}`}
                              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center"
                            >
                              Detaylar
                              <FaArrowRight className="ml-2" />
                            </Link>
                            
                            <button 
                              onClick={() => addToCart(product)}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors text-sm font-medium flex items-center shadow-sm hover:shadow-md"
                            >
                              Sepete Ekle
                              <FaShoppingCart className="ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Sayfalama */}
                {products.length > 0 && (
                  <div className="mt-12 flex justify-center">
                    {/* Dinamik sayfalama - Sadece birden fazla sayfa varsa göster */}
                    {calculateTotalPages() > 1 && (
                      <nav className="inline-flex items-center justify-center p-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <button 
                          className={`flex items-center justify-center w-9 h-9 rounded-lg mr-1 ${
                            currentPage === 1 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <FaChevronDown className="transform rotate-90" size={14} />
                        </button>
                        
                        {renderPageNumbers().map(page => (
                          <button 
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`flex items-center justify-center w-9 h-9 rounded-lg mx-0.5 text-sm font-medium transition-all ${
                              currentPage === page 
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button 
                          className={`flex items-center justify-center w-9 h-9 rounded-lg ml-1 ${
                            currentPage === calculateTotalPages() 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === calculateTotalPages()}
                        >
                          <FaChevronDown className="transform -rotate-90" size={14} />
                        </button>
                      </nav>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Kategori adını Türkçe'ye çevirme fonksiyonu
function getCategoryName(category) {
  switch (category) {
    case 'web':
      return 'Web Uygulamaları';
    case 'desktop':
      return 'Masaüstü Yazılımlar';
    case 'mobile':
      return 'Mobil Uygulamalar';
    case 'api':
      return 'API Servisleri';
    case 'database':
      return 'Veritabanı Çözümleri';
    case 'cloud':
      return 'Bulut Hizmetleri';
    case 'ai':
      return 'Yapay Zeka';
    case 'automation':
      return 'Otomasyon';
    default:
      return 'Tüm Çözümler';
  }
}

// Kategori ikonu getirme fonksiyonu
function getCategoryIcon(category) {
  switch (category) {
    case 'web':
      return <FaLaptopCode />;
    case 'mobile':
      return <FaMobileAlt />;
    case 'desktop':
      return <FaServer />;
    case 'api':
      return <FaCode />;
    case 'database':
      return <FaDatabase />;
    case 'cloud':
      return <FaCloud />;
    case 'ai':
      return <FaBrain />;
    case 'automation':
      return <FaRobot />;
    default:
      return <FaCogs />;
  }
}

// Kategori rengi getirme fonksiyonu
function getCategoryBadge(category) {
  switch (category) {
    case 'web':
      return 'from-blue-500 to-indigo-600';
    case 'mobile':
      return 'from-emerald-500 to-teal-600';
    case 'desktop':
      return 'from-amber-500 to-orange-600';
    case 'api':
      return 'from-purple-500 to-violet-600';
    case 'database':
      return 'from-cyan-500 to-blue-600';
    case 'cloud':
      return 'from-sky-500 to-blue-600';
    case 'ai':
      return 'from-pink-500 to-rose-600';
    case 'automation':
      return 'from-fuchsia-500 to-purple-600';
    default:
      return 'from-gray-500 to-slate-600';
  }
} 