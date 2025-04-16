"use client";

import React, { useEffect } from 'react';
import { useAuth, requireAuth } from '../../src/contexts/AuthContext';
import { FaShoppingBag, FaUsers, FaComments, FaChartLine, FaBox, FaTag } from 'react-icons/fa';
import Link from 'next/link';

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Hoş Geldiniz, {user?.name || 'Admin'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Siparişler Kartı */}
        <Link href="/admin/orders" className="bg-gray-700 hover:bg-gray-600 p-6 rounded-xl shadow transition-all flex items-start space-x-4">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <FaShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Siparişler</h3>
            <p className="text-gray-300 text-sm">Sipariş durumlarını görüntüle ve yönet</p>
          </div>
        </Link>
        
        {/* Ürünler Kartı */}
        <Link href="/admin/products" className="bg-gray-700 hover:bg-gray-600 p-6 rounded-xl shadow transition-all flex items-start space-x-4">
          <div className="bg-emerald-600 p-3 rounded-lg">
            <FaBox className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Ürünler</h3>
            <p className="text-gray-300 text-sm">Ürün ekle, düzenle veya kaldır</p>
          </div>
        </Link>
        
        {/* İletişim Mesajları Kartı */}
        <Link href="/admin/messages" className="bg-gray-700 hover:bg-gray-600 p-6 rounded-xl shadow transition-all flex items-start space-x-4">
          <div className="bg-amber-600 p-3 rounded-lg">
            <FaComments className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Mesajlar</h3>
            <p className="text-gray-300 text-sm">İletişim formundan gelen mesajları görüntüle</p>
          </div>
        </Link>
      </div>
      
      <div className="bg-gray-700 rounded-xl shadow mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">İyi Günler!</h2>
        <p className="text-gray-300">
          Mağaza yönetim paneline hoş geldiniz. Burada siparişlerinizi takip edebilir, ürünlerinizi yönetebilir 
          ve müşteri iletişimlerini görüntüleyebilirsiniz.
        </p>
        <p className="text-gray-300 mt-2">
          Herhangi bir sorunuz varsa, lütfen teknik destek ekibimizle iletişime geçin.
        </p>
      </div>
    </div>
  );
}

// requireAuth HOC ile bileşeni sar
export default requireAuth(AdminDashboard);