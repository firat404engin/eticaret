import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaShoppingCart, FaRegStar, FaStar, FaCheck, FaShieldAlt, FaHeadset, FaRegClock } from 'react-icons/fa';
import supabase from '../../../src/utils/supabase';

// Gerçek uygulamada bu fonksiyon Supabase API'den ürün bilgilerini alır
async function getProduct(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Ürün alınırken hata oluştu:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Ürün alınırken bir hata oluştu:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);
  
  // Ürün bulunamadıysa kullanıcıya bilgi verelim
  if (!product) {
    return (
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız ürün bulunamadı veya artık mevcut değil.</p>
          <a href="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Tüm Ürünlere Dön
          </a>
        </div>
      </main>
    );
  }
  
  return (
    <main>
      <ProductDetail product={product} />
    </main>
  );
} 