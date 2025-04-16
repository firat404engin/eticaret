"use client";
import { useEffect, useState } from "react";
import supabase from "../../../src/utils/supabase";
import { FaBox, FaRegClock, FaTruck, FaCheck, FaSearch, FaFilter, FaSync, FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInfoCircle, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { requireAuth } from '../../../src/contexts/AuthContext';

const STATUS_OPTIONS = [
  "Beklemede",
  "Hazırlanıyor",
  "Kargoda",
  "Teslim Edildi"
];

// Durum renklerini tanımla
const STATUS_COLORS = {
  "Beklemede": "bg-amber-100 text-amber-800 border-amber-200",
  "Hazırlanıyor": "bg-blue-100 text-blue-800 border-blue-200",
  "Kargoda": "bg-purple-100 text-purple-800 border-purple-200",
  "Teslim Edildi": "bg-emerald-100 text-emerald-800 border-emerald-200"
};

// Durum ikonlarını tanımla
const STATUS_ICONS = {
  "Beklemede": <FaRegClock className="mr-1.5" />,
  "Hazırlanıyor": <FaBox className="mr-1.5" />,
  "Kargoda": <FaTruck className="mr-1.5" />,
  "Teslim Edildi": <FaCheck className="mr-1.5" />
};

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      setError(error.message);
    } else {
    setOrders(data || []);
      
      // İstatistikleri hesapla
      if (data) {
        const stats = {
          total: data.length,
          pending: data.filter(o => o.status === "Beklemede").length,
          processing: data.filter(o => o.status === "Hazırlanıyor").length,
          shipped: data.filter(o => o.status === "Kargoda").length,
          delivered: data.filter(o => o.status === "Teslim Edildi").length,
          totalRevenue: data.reduce((total, order) => total + (Number(order.total) || 0), 0)
        };
        setStats(stats);
      }
    }
    
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    setUpdatingId(id);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (error) {
      alert("Durum güncellenemedi: " + error.message);
    } else {
      // Hem sipariş listesini hem istatistikleri güncelle
      setOrders(orders => {
        const updatedOrders = orders.map(o => (o.id === id ? { ...o, status: newStatus } : o));
        
        // İstatistikleri güncelle
        const newStats = {
          total: updatedOrders.length,
          pending: updatedOrders.filter(o => o.status === "Beklemede").length,
          processing: updatedOrders.filter(o => o.status === "Hazırlanıyor").length,
          shipped: updatedOrders.filter(o => o.status === "Kargoda").length,
          delivered: updatedOrders.filter(o => o.status === "Teslim Edildi").length,
          totalRevenue: updatedOrders.reduce((total, order) => total + (Number(order.total) || 0), 0)
        };
        setStats(newStats);
        
        return updatedOrders;
      });
    }
    
    setUpdatingId(null);
  }

  // Duruma göre arka plan rengini döndüren fonksiyon
  const getStatusClassName = (status) => {
    return STATUS_COLORS[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  
  // Duruma göre ikonu döndüren fonksiyon
  const getStatusIcon = (status) => {
    return STATUS_ICONS[status] || <FaInfoCircle className="mr-1.5" />;
  };
  
  // Filtrelenmiş siparişleri getir
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Tümü" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst İstatistik Kartları */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Sipariş Yönetimi</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Toplam Sipariş */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl shadow-sm border border-indigo-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">Toplam Sipariş</h3>
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <FaBox />
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            
            {/* Beklemede */}
            <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl shadow-sm border border-amber-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-amber-600 font-semibold">Beklemede</h3>
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <FaRegClock />
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pending}</p>
            </div>
            
            {/* Hazırlanıyor */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Hazırlanıyor</h3>
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <FaBox />
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.processing}</p>
            </div>
            
            {/* Kargoda */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-purple-600 font-semibold">Kargoda</h3>
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <FaTruck />
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.shipped}</p>
            </div>
            
            {/* Toplam Gelir */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl shadow-sm border border-emerald-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">Toplam Gelir</h3>
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <FaMoneyBillWave />
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalRevenue.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-6">
        {/* Arama ve Filtreleme */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama Alanı */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Müşteri, ürün veya adres ara..."
                className="pl-10 pr-3 py-2 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Durum Filtresi */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaFilter />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Tümü">Tüm Durumlar</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Yenile Butonu */}
            <div className="flex justify-end">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Yenile
              </button>
            </div>
          </div>
        </div>
        
        {loading && !orders.length && (
          <div className="flex items-center justify-center bg-white p-8 rounded-xl shadow-sm border">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-700">Siparişler yükleniyor...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="font-medium">Hata oluştu</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white p-8 text-center rounded-xl shadow-sm border">
            <p className="text-gray-500 text-lg">
              {orders.length === 0 
                ? "Henüz sipariş bulunmamaktadır." 
                : "Arama kriterlerinize uygun sipariş bulunamadı."}
            </p>
          </div>
        )}
        
        {/* Siparişler Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border overflow-hidden">
              {/* Kart Başlığı */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
                    <FaUser className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{order.customer_name}</h3>
                    <p className="text-sm text-gray-500">Sipariş #{order.id}</p>
                  </div>
                </div>
                
                {/* Durum Göstergesi */}
                <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusClassName(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              {/* Kart İçeriği */}
              <div className="p-6 grid gap-6">
                {/* İletişim Bilgileri */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Telefon */}
                  <div className="flex items-start">
                    <FaPhoneAlt className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Telefon</p>
                      <p className="text-sm text-black font-medium">{order.phone || "Belirtilmedi"}</p>
                    </div>
                  </div>
                  
                  {/* E-posta */}
                  <div className="flex items-start">
                    <FaEnvelope className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 font-medium">E-posta</p>
                      <p className="text-sm text-black font-medium">{order.email || "Belirtilmedi"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Adres */}
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Teslimat Adresi</p>
                    <p className="text-sm text-black">{order.address}</p>
                    {order.note && (
                      <p className="text-xs text-gray-600 mt-2 italic">Not: {order.note}</p>
                    )}
                  </div>
                </div>
                
                {/* Sipariş Detayları */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-sm font-medium text-black">
                      <FaBox className="mr-2" /> Sipariş Detayları
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2" /> {new Date(order.date).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Sipariş Öğeleri */}
                  <div className="text-sm text-black font-medium my-2">
                    {typeof order.items === 'string'
                  ? order.items
                  : Array.isArray(order.items)
                    ? order.items.map(i => `${i.product_name}, ${i.quantity}`).join(' | ')
                        : 'Ürün bilgisi bulunamadı'}
                  </div>
                  
                  {/* Tutar */}
                  <div className="flex justify-end mt-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Toplam Tutar</p>
                      <p className="text-lg font-bold text-black">{order.total} ₺</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Kart Altbilgisi */}
              <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Durum Güncelle</p>
                  
                  <div className="flex items-center">
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                      className={`pl-3 pr-8 py-2 rounded-md text-sm font-medium ${getStatusClassName(order.status)} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                    
                    {updatingId === order.id && (
                      <div className="animate-spin ml-2 h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Giriş yapmadan erişimi engelle
export default requireAuth(OrdersAdminPage);
