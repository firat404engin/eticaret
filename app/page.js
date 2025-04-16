"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './components/ProductCard';
import { FaArrowRight, FaShoppingBag, FaLaptopCode, FaCode, FaServer, FaUsers, FaRocket, FaMobileAlt, FaLightbulb, FaHeadset, FaRegCheckCircle, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lldesfeuqsqwinofyzbk.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZGVzZmV1cXNxd2lub2Z5emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODUwODIsImV4cCI6MjA1OTk2MTA4Mn0.bPSJWbUIOy-1PpJfGC7YG0_40sqoEzAjLh1XmwQd0gI";

// Supabase bağlantı bilgileri kontrolü
console.log('Ana sayfa - Supabase URL:', supabaseUrl);
console.log('Ana sayfa - Supabase Key:', supabaseKey ? 'Mevcut (gizli)' : 'Eksik!');

// Hero görselinin URL'i - tek bir yerden yönetmek için
const heroImageUrl = 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

// Supabase client'ı bileşen dışında oluştur
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        console.log('Ana sayfa - Ürünler yükleniyor...');
        
        // Popüler ürünleri getir
        const { data, error: supabaseErr } = await supabase
          .from('products')
          .select('*')
          .eq('popular', true)
          .limit(6);
          
        if (supabaseErr) throw supabaseErr;
        
        console.log('Ana sayfa - Popüler ürünler:', data?.length || 0);
        
        // Component hala mount edilmiş ise state güncelle
        if (isMounted) {
          setFeaturedProducts(data || []);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Ana sayfa - Ürünler yüklenirken hata:', err.message);
        
        // Component hala mount edilmiş ise hata state'ini güncelle
        if (isMounted) {
          if (err.message.includes('Supabase bağlantısı')) {
            setError(err.message || 'Supabase bağlantı hatası. Lütfen daha sonra tekrar deneyin.');
          } else {
            setError(err.message || 'Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
          }
          setLoading(false);
        }
      }
    };
    
    fetchProducts();
    
    // Cleanup fonksiyonu
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Servis özellikleri
  const services = [
    {
      icon: <FaCode />,
      title: 'Web Geliştirme',
      description: 'Responsive ve modern web siteleri, e-ticaret çözümleri ve web uygulamaları.'
    },
    {
      icon: <FaMobileAlt />,
      title: 'Mobil Uygulamalar',
      description: 'iOS ve Android için performanslı, kullanıcı dostu mobil uygulamalar.'
    },
    {
      icon: <FaLaptopCode />,
      title: 'Masaüstü Yazılımları',
      description: 'Kapsamlı ve özelleştirilebilir masaüstü uygulamaları.'
    },
    {
      icon: <FaServer />,
      title: 'API Servisleri',
      description: 'Hızlı, güvenli ve ölçeklenebilir API çözümleri.'
    },
    {
      icon: <FaDatabase />,
      title: 'Veritabanı Çözümleri',
      description: 'Karmaşık veri yapıları için optimize edilmiş veritabanı sistemleri.'
    }
  ];
  
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section - Modern Tasarım */}
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 dark:bg-[#181c20] overflow-hidden min-h-[90vh] flex items-center">
        {/* Arka plan desenleri */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Animasyonlu grid deseni */}
          <div className="absolute inset-0 bg-[url('https://cdn.jsdelivr.net/gh/htmlstrap/assets@main/grid.svg')] bg-center opacity-[0.15]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-slideInLeft">
              <div className="inline-block mb-3 px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20">
                Dijital Dönüşüm Uzmanınız
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white dark:text-[#e3e8ee] leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-shine bg-[length:400%_100%]">
                  Yazılım Çözümleri
                </span>
                <br />
                <span className="text-white dark:text-[#e3e8ee]">ile Geleceğe Adım Atın</span>
              </h1>
              
              <p className="text-gray-300 dark:text-[#e3e8ee] text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
                Özel geliştirilmiş yazılım çözümleri ile işletmenizi dijital dünyada öne çıkarın. 
                <span className="text-indigo-300 font-medium">Yapay zeka destekli</span> modern uygulamalarımız ile iş süreçlerinizi optimize edin.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <Link 
                  href="/products" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 flex items-center group hover:-translate-y-1"
                >
                  Çözümleri Keşfet
                  <FaArrowRight className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
                
                <Link 
                  href="/contact" 
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl backdrop-blur-md transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1"
                >
                  Bize Ulaşın
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative animate-slideInRight">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                {/* Görsel üzerindeki efektler */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent z-10 opacity-60"></div>
                
                {/* Ana görsel */}
                <Image
                  src={heroImageUrl}
                  alt="Yazılım Çözümleri"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Öne çıkan özellikler */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-sm text-white border border-white/10">
                      <FaLaptopCode className="inline mr-2" /> Modern Arayüzler
                    </div>
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-sm text-white border border-white/10">
                      <FaRocket className="inline mr-2" /> Yüksek Performans
                    </div>
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-sm text-white border border-white/10">
                      <FaShieldAlt className="inline mr-2" /> Güvenli Altyapı
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dekoratif elementler */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Servisler Section - Modern Tasarım */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/80 relative overflow-hidden">
        {/* Dekoratif elementler */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-300/10 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium">
              Profesyonel Hizmetlerimiz
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-poppins">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Yazılım Çözümlerimiz
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              İşletmenizin ihtiyaçlarına özel olarak geliştirdiğimiz yazılım hizmetlerimiz ile dijital dönüşümünüzü hızlandırın.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-700/50 group hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-poppins">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {service.description}
                </p>
                <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Detaylı Bilgi
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <a href="/contact" className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 group">
              Tüm Hizmetlerimizi Keşfedin
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      {/* Ürünler Section - Modern Tasarım */}
      <section className="py-24 relative overflow-hidden">
        {/* Dekoratif elementler */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-300/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-300/5 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
              Öne Çıkan Çözümler
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-poppins">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Popüler Ürünlerimiz
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              En çok tercih edilen yazılım çözümlerimizi keşfedin ve işletmeniz için en uygun olan ürünü seçin.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="ml-4 text-gray-500 dark:text-gray-400">Ürünler yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-6 rounded-lg shadow text-center max-w-lg mx-auto">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-lg font-medium mb-2">Yükleme Hatası</h3>
              <p>{error}</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center max-w-lg mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Henüz ürün bulunmamaktadır
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Yakında yeni ürünlerimiz eklenecektir. Lütfen daha sonra tekrar kontrol edin.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-16">
                <Link 
                  href="/products" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
                >
                  Tüm Ürünleri Görüntüle 
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/category/web" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
                    #Web Uygulamaları
                  </Link>
                  <Link href="/category/mobile" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
                    #Mobil Uygulamalar
                  </Link>
                  <Link href="/category/desktop" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
                    #Masaüstü Yazılımlar
                  </Link>
                  <Link href="/category/ecommerce" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
                    #E-Ticaret Çözümleri
                  </Link>
                </div>
              </div>
            </>
          )}
          
        </div>
      </section>

      {/* CTA Section - Modern Tasarım */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
        {/* Dekoratif elementler */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          
          {/* Animasyonlu grid deseni */}
          <div className="absolute inset-0 bg-[url('https://cdn.jsdelivr.net/gh/htmlstrap/assets@main/grid.svg')] bg-center opacity-[0.07]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg p-8 md:p-12 lg:p-16 rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-block mb-3 px-4 py-1.5 bg-white/10 text-indigo-200 rounded-full text-sm font-medium">
                  Ücretsiz Danışmanlık
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight font-poppins">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 animate-shine bg-[length:400%_100%]">
                    İşletmeniz İçin Doğru Yazılım Çözümünü
                  </span>{' '}
                  <span className="text-white">Birlikte Bulalım</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Ücretsiz danışmanlık hizmetimizden yararlanın ve işletmenizin ihtiyaçlarına en uygun yazılım çözümünü birlikte belirleyelim.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="px-8 py-4 bg-white text-indigo-900 font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                  >
                    <FaHeadset className="mr-2" /> Ücretsiz Danışmanlık Alın
                  </Link>
                  
                  <Link
                    href="/products"
                    className="px-8 py-4 bg-indigo-700/50 hover:bg-indigo-700 text-white font-medium rounded-xl backdrop-blur-md transition-all duration-300 border border-indigo-500/50 hover:border-indigo-500 hover:-translate-y-1 flex items-center justify-center"
                  >
                    Çözümleri İnceleyin
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
              
              {/* Özellikler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <FaRegCheckCircle className="text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Hızlı Entegrasyon</h3>
                    <p className="text-gray-300 text-sm">Mevcut sistemlerinizle sorunsuz entegrasyon</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <FaRegCheckCircle className="text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">7/24 Destek</h3>
                    <p className="text-gray-300 text-sm">Teknik ekibimizden kesintisiz destek</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <FaRegCheckCircle className="text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Güvenli Altyapı</h3>
                    <p className="text-gray-300 text-sm">En yüksek güvenlik standartları</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS için gerekli stilleri ekle */}
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </main>
  );
} 