"use client";

import React from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import { useEffect, useState } from "react";
import supabase from "../../src/utils/supabase";

export default function AdminPage() {
  const [stats, setStats] = useState({
    orderCount: 0,
    productCount: 0,
    totalSales: 0,
    topProducts: [],
    messageCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    // Siparişler
    const { data: orders, error: orderErr } = await supabase.from("orders").select("items, total");
    // Ürünler
    const { data: products, error: productErr } = await supabase.from("products").select("id, name");
    // Mesajlar (varsa)
    const { data: messages, error: msgErr } = await supabase.from("contact_messages").select("id");

    // Toplam satış
    const totalSales = orders?.reduce((sum, o) => sum + (Number(o.total) || 0), 0) || 0;
    // En çok satan ürünler (isim ve toplam adet)
    const productSales = {};
    orders?.forEach(o => {
      let items = o.items;
      if (typeof items === 'string') {
        // Yeni format: "Ürün, 2 | Diğer, 1"
        items = items.split(' | ').map(s => {
          const [name, qty] = s.split(',').map(x => x.trim());
          return { name, quantity: Number(qty) };
        });
      } else if (Array.isArray(items)) {
        // Eski format
        items = items.map(i => ({ name: i.product_name, quantity: i.quantity }));
      } else {
        items = [];
      }
      items.forEach(i => {
        if (!i.name) return;
        productSales[i.name] = (productSales[i.name] || 0) + (Number(i.quantity) || 0);
      });
    });
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    setStats({
      orderCount: orders?.length || 0,
      productCount: products?.length || 0,
      totalSales,
      topProducts,
      messageCount: messages?.length || 0
    });
    setLoading(false);
  }

  // Modern renkler
  const cardColors = [
    'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)', // Mavi
    'linear-gradient(135deg, #f59e42 0%, #fbbf24 100%)', // Turuncu
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)', // Yeşil
    'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', // Kırmızı
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#1e2230] dark:to-[#232a36] px-2 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 animate-fade-in">Yönetim Paneli</h1>
        <p className="text-lg text-gray-500 dark:text-gray-300 mb-8 animate-fade-in">Hoş geldiniz! Sipariş, ürün ve mesaj istatistiklerinizi buradan takip edebilirsiniz.</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            <style>{`
              .loader {
                border-top-color: #6366f1;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              .animate-fade-in {
                animation: fadeIn 0.7s cubic-bezier(.36,1.5,.6,1);
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                icon={<FaShoppingCart size={32} />}
                title="Toplam Sipariş"
                value={stats.orderCount}
                color={cardColors[0]}
              />
              <StatCard
                icon={<FaBox size={32} />}
                title="Toplam Ürün"
                value={stats.productCount}
                color={cardColors[1]}
              />
              <StatCard
                icon={<FaMoneyBillWave size={32} />}
                title="Toplam Satış"
                value={stats.totalSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                color={cardColors[2]}
              />
              <StatCard
                icon={<FaUsers size={32} />}
                title="Mesajlar"
                value={stats.messageCount}
                color={cardColors[3]}
              />
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-[#232a36] rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">En Çok Satan Ürünler</h2>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.topProducts.map((p, i) => (
                  <li key={p.name} className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                    <span>{i + 1}. {p.name}</span>
                    <span className="font-semibold">{p.quantity} adet</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div
      className="rounded-xl shadow-md p-6 flex flex-col items-center justify-center animate-fade-in"
      style={{
        background: color,
        color: '#fff',
        minHeight: 120,
        boxShadow: '0 4px 24px rgba(60,60,120,0.11)',
        transition: 'transform 0.18s',
      }}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-lg font-bold mb-1">{value}</div>
      <div className="text-base opacity-80 font-medium">{title}</div>
    </div>
  );
}