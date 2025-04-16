"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaArrowLeft, FaCheck, FaShoppingBag } from 'react-icons/fa';
import { useCart } from './CartProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

// Ürün kartı bileşeni
const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const { product, quantity } = item;
  const productTotal = product.price * quantity;
  
  // Ürün resmi için fallback görseli
  const defaultImage = '/images/product-placeholder.jpg';
  
  // Ürün görseli
  const productImage = product.image_url || defaultImage;

  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center p-4 border-b border-gray-200 last:border-b-0">
      {/* Ürün Görseli - Supabase'den geliyor */}
      <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden mr-4 mb-3 md:mb-0 border border-gray-200">
        <Image 
          src={productImage}
          alt={product.name}
          width={96}
          height={96}
          className="w-full h-full object-cover transition-all hover:scale-110"
        />
      </div>
      
      {/* Ürün Bilgileri */}
      <div className="flex-grow mb-3 md:mb-0">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.price.toFixed(2)} TL</p>
      </div>
      
      {/* Miktar */}
      <div className="flex items-center mr-6">
        <button 
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-l-md border border-gray-300 text-gray-700 transition-colors"
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-gray-800">
          {quantity}
        </span>
        <button 
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-r-md border border-gray-300 text-gray-700 transition-colors"
        >
          +
        </button>
      </div>
      
      {/* Toplam Fiyat */}
      <div className="text-right md:w-24 mb-3 md:mb-0 font-medium text-gray-900">
        {productTotal.toFixed(2)} TL
      </div>
      
      {/* Kaldır Butonu */}
      <button 
        onClick={() => removeFromCart(product.id)}
        className="md:ml-4 text-red-500 hover:text-red-700 transition-colors"
        aria-label="Ürünü kaldır"
      >
        <FaTrash />
      </button>
    </div>
  );
};

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Toplam tutarı hesapla
  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Kart bilgileri validasyonu (örnek, gerçek ödeme yok)
    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      alert('Geçerli bir kart numarası giriniz (16 haneli)');
      return;
    }
    if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      alert('Geçerli bir son kullanma tarihi giriniz (AA/YY)');
      return;
    }
    if (!formData.cardCvv || !/^\d{3,4}$/.test(formData.cardCvv)) {
      alert('Geçerli bir CVV giriniz (3 veya 4 haneli)');
      return;
    }

    try {
      // Sipariş bilgilerini API'ye gönder
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          date: new Date().toISOString(),
          total: totalPrice,
          status: 'Beklemede',
          items: cart.map(item => `${item.product.name}, ${item.quantity}`).join(' | '),
          note: formData.notes
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Hatası:', errorText);
        throw new Error('Sipariş işlenirken bir hata oluştu');
      }
      
      // Sipariş başarılı olduğunda stok güncelleme
      for (const item of cart) {
        // Önce ürünün mevcut stoğunu ve satış miktarını alıyoruz
        const { data: productData, error: fetchError } = await supabase
          .from('products')
          .select('stock, sales')
          .eq('id', item.product.id)
          .single();
          
        if (fetchError) {
          console.error(`${item.product.name} ürün bilgisi alınırken hata:`, fetchError);
          continue;
        }
        
        // Mevcut sales değeri yoksa 0 olarak başlatalım
        const currentSales = productData.sales || 0;
        
        // Stok ve satış miktarı güncelleme
        const newStock = Math.max(0, productData.stock - item.quantity);
        const newSales = currentSales + item.quantity;
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock: newStock,
            sales: newSales 
          })
          .eq('id', item.product.id);
          
        if (updateError) {
          console.error(`${item.product.name} ürün güncellemesi sırasında hata:`, updateError);
        }
      }
      
      // E-posta gönderimi - Sepet temizlenmeden önce gönderelim
      try {
        console.log("Sipariş e-postası gönderimine başlanıyor...");
        
        // Sipariş ürünlerini ve detaylarını hazırla
        const orderItems = cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image_url: item.product.image_url
        }));
        
        // Sipariş verilerini hazırla
        const orderDetails = {
          customer_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          date: new Date().toISOString(),
          total: totalPrice,
          items: orderItems
        };
        
        console.log("Sipariş detayları hazır, API'ye gönderiliyor:", 
          JSON.stringify({
            email: formData.email,
            name: formData.fullName
          })
        );
        
        const emailResponse = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.fullName,
            productName: cart.map(item => item.product.name).join(', '),
            orderData: orderDetails
          }),
        });
        
        const emailResult = await emailResponse.json();
        
        if (!emailResponse.ok) {
          console.error('E-posta gönderiminde hata oluştu:', emailResult);
        } else {
          console.log('Sipariş e-postası başarıyla gönderildi:', emailResult);
        }
      } catch (emailError) {
        console.error('E-posta gönderilirken hata:', emailError);
      }
      
      // Sipariş başarılı olduğunda
      setIsOrderPlaced(true);
      // Sepeti temizle
      setTimeout(() => {
        clearCart();
        setIsOrderPlaced(false);
        setIsCheckingOut(false);
      }, 3000);
    } catch (error) {
      console.error('Sipariş sırasında bir hata oluştu:', error);
      alert('Siparişiniz alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-8">
        <div className="bg-green-100 border border-green-200 rounded-full p-4 mb-4">
          <FaCheck className="text-black text-3xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-4 text-center">Siparişiniz Alındı!</h2>
        <p className="text-black text-center mb-6">
          Siparişiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <Link 
          href="/products" 
          className="flex items-center justify-center px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <FaShoppingBag className="mr-2" /> Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-8">
        <div className="bg-gray-100 border border-gray-200 rounded-full p-4 mb-4">
          <FaShoppingBag className="text-black text-3xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">Sepetiniz Boş</h2>
        <p className="text-black mb-6 text-center">Alışverişe başlamak için ürünler sayfasına göz atın.</p>
        <Link 
          href="/products" 
          className="flex items-center justify-center px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Ürünlere Dön
        </Link>
      </div>
    );
  }

  if (isCheckingOut) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 mt-4 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-black">Sipariş Bilgileri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* SOL TARAF - Kişisel Bilgi Girişi */}
          <div>
            <form id="orderForm" onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">Ad Soyad</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">E-posta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-900">Adres</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-900">Sipariş Notu (İsteğe bağlı)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 md:hidden">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-gray-900 hover:text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FaArrowLeft className="mr-2" /> Sepete Dön
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Siparişi Tamamla
                </button>
              </div>
            </form>
          </div>
          
          {/* SAĞ TARAF - Sipariş Özeti ve Ödeme Bilgileri */}
          <div className="space-y-4">
            {/* Sipariş Özeti Kutusu */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg shadow-md border border-blue-100">
              <h4 className="font-semibold mb-3 text-indigo-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
                Sipariş Özeti
              </h4>
              
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center text-base mb-3">
                  <span className="text-gray-700">Ara Toplam</span>
                  <span className="text-gray-900">{totalPrice.toLocaleString('tr-TR')} TL</span>
                </div>
                
                <div className="flex justify-between items-center text-base mb-4 pb-3 border-b border-dashed border-gray-300">
                  <span className="text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Kargo Ücreti
                  </span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-800">Toplam</span>
                  <span className="text-xl text-blue-700 font-medium">{totalPrice.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>
            </div>
            
            {/* Ödeme Bilgileri Kutusu */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg shadow-md border border-blue-100">
              <h4 className="font-semibold mb-3 text-indigo-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Ödeme Bilgileri
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-900">Kart Numarası</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    maxLength={19}
                    required
                    form="orderForm"
                    value={formData.cardNumber}
                    onChange={e => setFormData({ ...formData, cardNumber: e.target.value.replace(/[^\d]/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                    placeholder="0000 0000 0000 0000"
                    className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-900">Son Kullanma</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      maxLength={5}
                      required
                      form="orderForm"
                      value={formData.cardExpiry}
                      onChange={e => setFormData({ ...formData, cardExpiry: e.target.value.replace(/[^\d\/]/g, '').replace(/(\d{2})(\d{0,2})/, (m, m1, m2) => m2 ? m1 + '/' + m2 : m1) })}
                      placeholder="AA/YY"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-900">CVV</label>
                    <input
                      type="text"
                      id="cardCvv"
                      name="cardCvv"
                      maxLength={4}
                      required
                      form="orderForm"
                      value={formData.cardCvv}
                      onChange={e => setFormData({ ...formData, cardCvv: e.target.value.replace(/[^\d]/g, '') })}
                      placeholder="123"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-indigo-600 mt-2 italic">Bu bilgiler demo amaçlıdır, ödeme alınmaz ve kaydedilmez.</p>
            </div>
            
            {/* Butonlar - Sadece geniş ekranlarda sağ tarafta görünecek */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 hidden md:flex">
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-gray-900 hover:text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FaArrowLeft className="mr-2" /> Sepete Dön
              </button>
              <button
                type="submit"
                form="orderForm"
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Siparişi Tamamla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Alışveriş Sepeti</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {cart.length > 0 ? (
            <>
              <div className="p-6">
                {cart.map((item) => (
                  <CartItem 
                    key={item.product.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
              </div>
              
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Toplam:</span>
                  <span className="text-2xl font-bold text-gray-900">{totalPrice.toFixed(2)} TL</span>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                  <button 
                    onClick={clearCart}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <FaTrash className="mr-2" /> Sepeti Temizle
                  </button>
                  
                  <button 
                    onClick={handleCheckout}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    Siparişi Tamamla
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
              <Link 
                href="/products"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Alışverişe Başla
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Ürün Önerileri veya İlgili Ürünler */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">İlginizi Çekebilecek Ürünler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Burada ilgili ürün önerileri gösterilebilir */}
        </div>
      </div>
    </div>
  );
};

export default Cart; 





