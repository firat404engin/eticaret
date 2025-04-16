"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaCheck, FaCode, FaLaptopCode, FaMobileAlt, FaServer, FaDatabase, FaCloud, FaBrain, FaRobot, FaCogs, FaArrowRight, FaTimes, FaTag, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { useCart } from './CartProvider';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal açıldığında scroll'u kilitle
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Kategori bilgilerini getir (ikon, renk, isim)
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'web': {
        name: 'Web Uygulaması',
        icon: <FaLaptopCode />,
        gradient: 'from-blue-500 to-indigo-600',
        lightGradient: 'from-blue-400/10 to-indigo-400/10',
        textColor: 'text-blue-600'
      },
      'mobile': {
        name: 'Mobil Uygulama',
        icon: <FaMobileAlt />,
        gradient: 'from-emerald-500 to-teal-600',
        lightGradient: 'from-emerald-400/10 to-teal-400/10',
        textColor: 'text-emerald-600'
      },
      'desktop': {
        name: 'Masaüstü Yazılım',
        icon: <FaServer />,
        gradient: 'from-amber-500 to-orange-600',
        lightGradient: 'from-amber-400/10 to-orange-400/10',
        textColor: 'text-amber-600'
      },
      'api': {
        name: 'API Servisi',
        icon: <FaCode />,
        gradient: 'from-purple-500 to-violet-600',
        lightGradient: 'from-purple-400/10 to-violet-400/10',
        textColor: 'text-purple-600'
      },
      'database': {
        name: 'Veritabanı',
        icon: <FaDatabase />,
        gradient: 'from-cyan-500 to-blue-600',
        lightGradient: 'from-cyan-400/10 to-blue-400/10',
        textColor: 'text-cyan-600'
      },
      'cloud': {
        name: 'Bulut Hizmeti',
        icon: <FaCloud />,
        gradient: 'from-sky-500 to-blue-600',
        lightGradient: 'from-sky-400/10 to-blue-400/10',
        textColor: 'text-sky-600'
      },
      'ai': {
        name: 'Yapay Zeka',
        icon: <FaBrain />,
        gradient: 'from-pink-500 to-rose-600',
        lightGradient: 'from-pink-400/10 to-rose-400/10',
        textColor: 'text-pink-600'
      },
      'automation': {
        name: 'Otomasyon',
        icon: <FaRobot />,
        gradient: 'from-fuchsia-500 to-purple-600',
        lightGradient: 'from-fuchsia-400/10 to-purple-400/10',
        textColor: 'text-fuchsia-600'
      }
    };

    return categoryMap[category] || {
      name: 'Yazılım Çözümü',
      icon: <FaCogs />,
      gradient: 'from-gray-500 to-slate-600',
      lightGradient: 'from-gray-400/10 to-slate-400/10',
      textColor: 'text-gray-600'
    };
  };

  // Özellikleri doğru formata getirme fonksiyonu
  const getFeatures = (featuresData) => {
    if (!featuresData) return [];
    
    try {
      if (typeof featuresData === 'string') {
        if (featuresData.startsWith('[') && featuresData.endsWith(']')) {
          return JSON.parse(featuresData);
        } else {
          return featuresData.split(',').map(f => f.trim());
        }
      } else if (Array.isArray(featuresData)) {
        return featuresData;
      }
    } catch (error) {
      console.error("Features formatı hatalı:", error);
    }
    
    return typeof featuresData === 'string' 
      ? featuresData.split(',').map(f => f.trim()) 
      : [];
  };

  // Ek özellikler oluşturalım (modal için detaylı özellikler)
  const getDetailedFeatures = (category) => {
    // Kategoriye göre detaylı özellikler oluşturalım
    const detailedFeatures = {
      'web': [
        'Responsive Tasarım',
        'Modern UI/UX',
        'SEO Optimizasyonu',
        'Hızlı Sayfa Yükleme',
        'Browser Uyumluluğu',
        'API Entegrasyonu',
        'Admin Paneli',
        'Güvenlik Protokolleri'
      ],
      'mobile': [
        'iOS & Android Desteği',
        'Offline Çalışma Modu',
        'Push Bildirimleri',
        'Konum Bazlı Hizmetler',
        'Kamera Entegrasyonu',
        'Sosyal Medya Bağlantıları',
        'İleri Düzey Güvenlik',
        'Hızlı Açılış Süresi'
      ],
      'desktop': [
        'Çoklu İşletim Sistemi Desteği',
        'Veritabanı Entegrasyonu',
        'Otomatik Güncelleme',
        'Özelleştirilebilir Arayüz',
        'Performans Optimizasyonu',
        'Bellek Yönetimi',
        'Çoklu Dil Desteği',
        'Dosya Sistemi Entegrasyonu'
      ],
      'api': [
        'REST API Mimarisi',
        'GraphQL Desteği',
        'OAuth2 Entegrasyonu',
        'Rate Limiting',
        'Webhook Entegrasyonu',
        'JSON/XML Formatları',
        'Mikroservis Uyumluluğu',
        'API Dokümantasyonu'
      ],
      'database': [
        'Yüksek Veri Güvenliği',
        'Ölçeklenebilir Mimari',
        'Otomatik Yedekleme',
        'İlişkisel/NoSQL Seçenekleri',
        'Veri Analiz Araçları',
        'Performans İzleme',
        'Veri Migrasyonu',
        'Çoklu Erişim Kontrolü'
      ],
      'cloud': [
        'Çoklu Bulut Desteği',
        'Otomatik Ölçeklendirme',
        'Yük Dengeleme',
        'Coğrafi Redundancy',
        'Kesintisiz Hizmet',
        '99.9% Uptime Garantisi',
        'DDoS Koruması',
        'Veri Şifreleme'
      ],
      'ai': [
        'Doğal Dil İşleme (NLP)',
        'Makine Öğrenmesi Algoritmaları',
        'Görüntü Tanıma',
        'Ses Tanıma ve Sentezleme',
        'Anomali Tespiti',
        'Tahminsel Analitik',
        'Gerçek Zamanlı İşleme',
        'Özelleştirilebilir AI Modelleri'
      ],
      'automation': [
        'İş Akışı Otomasyonu',
        'Zamanlanmış Görevler',
        'Tetikleyici Olaylar',
        'Entegrasyon Seçenekleri',
        'Uzaktan Yönetim',
        'Otomatik Raporlama',
        'Hata Yönetimi',
        'Ölçeklenebilir Mimari'
      ]
    };
    
    // Kategori için detaylı özellikler yoksa varsayılanları kullan
    return detailedFeatures[category] || [
      'Güvenlik Sertifikaları',
      'Teknik Destek',
      'Güncel Dokümantasyon',
      'Eğitim Materyalleri',
      'Düzenli Güncellemeler',
      'Performans Optimizasyonu',
      'Entegrasyon API\'leri',
      'Özelleştirilebilir Çözümler'
    ];
  };

  const categoryInfo = getCategoryInfo(product.category);
  const features = getFeatures(product.features);
  const detailedFeatures = getDetailedFeatures(product.category);

  return (
    <>
      <div 
        className="group relative overflow-hidden bg-white dark:bg-gray-900/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 h-[540px] transform hover:-translate-y-2 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Arka plan efektleri */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${categoryInfo.lightGradient} rounded-full -mr-16 -mt-16 blur-xl`}></div>
          <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${categoryInfo.lightGradient} rounded-full -ml-16 -mb-16 blur-xl`}></div>
        </div>
        
        {/* Ürün resmi ve gradient overlay */}
        <div className="relative w-full h-52 overflow-hidden">
          {/* Kategori etiketi - Daha modern tasarım */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white backdrop-blur-md bg-gradient-to-r ${categoryInfo.gradient} shadow-lg`}>
              <span>{categoryInfo.icon}</span>
              {categoryInfo.name}
            </span>
          </div>
          
          {/* Görsel */}
          <Image
            src={product.image_url || 'https://via.placeholder.com/300x200?text=Ürün+Görseli'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay gradient efekti */}
          <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-80`}></div>
          
          {/* Fiyat etiket - Görsel üzerinde */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white font-bold shadow-lg">
              {typeof product.price === 'number' 
                ? `${product.price.toLocaleString('tr-TR')}₺` 
                : product.price}
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-6 flex flex-col flex-grow z-10 relative">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-xl text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 line-clamp-3 h-[4.5rem]">
            {product.description}
          </p>
          
          {/* Özellikler - Badge tarzı modern tasarım */}
          <div className="mb-5">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${categoryInfo.gradient} flex items-center justify-center text-white`}>
                <FaCheck className="text-[8px]" />
              </span>
              Yazılım Özellikleri
            </div>
            
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index} 
                  className={`inline-flex items-center text-xs py-1 px-2.5 rounded-full ${categoryInfo.textColor} bg-gradient-to-r ${categoryInfo.lightGradient} border border-gray-100 dark:border-gray-700`}
                >
                  <FaCheck className="text-[8px] mr-1.5" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          {/* Butonlar - Alt kısım */}
          <div className="mt-auto flex justify-between items-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm font-medium flex items-center group/link text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Detayları Gör
              <FaArrowRight className="ml-1.5 transform group-hover/link:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => addToCart(product)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors text-sm font-medium flex items-center shadow-md hover:shadow-lg"
            >
              <FaShoppingCart className="mr-1.5" />
              Sepete Ekle
            </button>
          </div>
        </div>
        
        {/* Alt kısım ışıltısı */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${categoryInfo.gradient} opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
      </div>

      {/* Detay Modal - Modern ve Stabil Tasarım */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center p-4 md:p-6">
          {/* Arka plan overlay */}
          <div 
            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          ></div>

          {/* Modal içeriği - Daha büyük boyut */}
          <div 
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden transform transition-all duration-300 scale-100"
            style={{maxHeight: 'calc(100vh - 40px)'}}
          >
            {/* Kapat butonu */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 dark:bg-white/10 dark:hover:bg-white/20 text-white dark:text-gray-300 transition-colors"
              aria-label="Kapat"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex flex-col overflow-hidden">
              {/* Ürün görseli - Daha büyük */}
              <div className="w-full h-72 relative">
                <Image
                  src={product.image_url || 'https://via.placeholder.com/800x400?text=Ürün+Görseli'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Kategori etiketi */}
                <div className="absolute top-4 left-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white backdrop-blur-md bg-gradient-to-r ${categoryInfo.gradient} shadow-md`}>
                    <span>{categoryInfo.icon}</span>
                    {categoryInfo.name}
                  </span>
                </div>
                
                {/* Başlık - Görsel üzerinde */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-white md:pr-12">{product.name}</h3>
                    <div className="text-lg font-bold px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-white">
                      {typeof product.price === 'number' ? `${product.price.toLocaleString('tr-TR')}₺` : product.price}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* İçerik bölümü - Scroll edilebilir ve daha büyük */}
              <div className="p-5 overflow-y-auto" style={{maxHeight: 'calc(100vh - 380px)'}}>
                {/* Ürün açıklaması */}
                <div className="mb-5">
                  <p className="text-gray-700 dark:text-gray-300">
                    {product.description}
                  </p>
                </div>
                
                {/* Özellikler - İki sütun grid */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-gradient-to-r ${categoryInfo.gradient}`}>
                      <FaCheck className="text-white text-[8px]" />
                    </span>
                    Özellikler
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Daha fazla özellik göster */}
                    {[...features, ...detailedFeatures.slice(0, 10 - features.length)].map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-center text-sm py-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Alt butonlar - Sadece sepete ekle butonu */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
                <button
                  onClick={() => {
                    addToCart(product);
                    setShowModal(false);
                  }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium flex items-center justify-center shadow-md"
                >
                  <FaShoppingCart className="mr-2" size={18} />
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;