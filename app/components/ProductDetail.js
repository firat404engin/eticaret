"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaCheck, FaShoppingCart, FaCode, FaDesktop, FaMobileAlt, FaServer } from 'react-icons/fa';
import { useCart } from './CartProvider';

const ProductDetail = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('features');
  
  // Kategori ikonu seçimi
  const getCategoryIcon = () => {
    switch (product.category) {
      case 'web':
        return <FaCode className="text-blue-500 text-xl" />;
      case 'desktop':
        return <FaDesktop className="text-purple-500 text-xl" />;
      case 'mobile':
        return <FaMobileAlt className="text-green-500 text-xl" />;
      case 'service':
        return <FaServer className="text-yellow-500 text-xl" />;
      default:
        return <FaCode className="text-gray-500 text-xl" />;
    }
  };

  // Kategori adını Türkçe'ye çevirme
  const getCategoryName = (category) => {
    switch (category) {
      case 'web':
        return 'Web Tasarım';
      case 'desktop':
        return 'Masaüstü Uygulama';
      case 'mobile':
        return 'Mobil Uygulama';
      case 'service':
        return 'Dijital Hizmet';
      default:
        return 'Diğer';
    }
  };
  
  // Screenshot yönetimi
  const screenshots = product.screenshot_urls || [];
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  if (!product) return <div className="text-center p-12">Ürün yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Üst kısım - Ana görsel ve temel bilgiler */}
        <div className="flex flex-col md:flex-row">
          {/* Sol taraf - Görsel */}
          <div className="md:w-1/2 p-4 sm:p-6">
            <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden">
              <Image 
                src={screenshots[activeScreenshot] || product.image_url || '/images/placeholder.jpg'} 
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* Ekran görüntüleri galerisi */}
            {screenshots.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {screenshots.map((screenshot, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveScreenshot(idx)}
                    className={`relative w-16 sm:w-20 h-12 sm:h-16 flex-shrink-0 rounded-md overflow-hidden ${activeScreenshot === idx ? 'ring-2 ring-blue-500' : 'opacity-70'}`}
                  >
                    <Image 
                      src={screenshot} 
                      alt={`${product.name} ekran görüntüsü ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sağ taraf - Ürün bilgileri */}
          <div className="md:w-1/2 p-4 sm:p-6">
            <div className="flex items-center mb-3">
              {getCategoryIcon()}
              <span className="ml-2 text-sm font-medium text-gray-600">{getCategoryName(product.category)}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{product.name}</h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{product.description}</p>
            
            <div className="flex items-center mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{product.price.toLocaleString('tr-TR')} TL</span>
              {product.stock > 0 ? (
                <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Stokta
                </span>
              ) : (
                <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Stokta Yok
                </span>
              )}
            </div>
            
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    aria-label="Azalt"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock}
                    className="w-12 text-center border-x"
                    aria-label="Miktar"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    aria-label="Arttır"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 flex items-center justify-center font-medium text-sm sm:text-base"
                >
                  <FaShoppingCart className="mr-2" />
                  Sepete Ekle
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Alt kısım - Sekmeler */}
        <div className="border-t border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'features' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Özellikler
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Teknik Detaylar
            </button>
            {product.video_url && (
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'video' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Video
              </button>
            )}
          </div>
          
          <div className="p-4 sm:p-6">
            {activeTab === 'features' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Öne Çıkan Özellikler</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Teknik Detaylar</h2>
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{product.technical_details || 'Bu ürün için teknik detaylar henüz girilmemiştir.'}</p>
              </div>
            )}
            
            {activeTab === 'video' && product.video_url && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ürün Videosu</h2>
                <div className="aspect-video w-full">
                  <iframe
                    src={product.video_url.replace('watch?v=', 'embed/')}
                    title={`${product.name} Tanıtım Videosu`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 