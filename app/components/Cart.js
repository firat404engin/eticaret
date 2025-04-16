"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaArrowLeft, FaCheck, FaShoppingBag } from 'react-icons/fa';
import { useCart } from './CartProvider';
import { useRouter } from 'next/navigation';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
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
          <FaCheck className="text-green-500 text-3xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-4 text-center">Siparişiniz Alındı!</h2>
        <p className="text-gray-600 text-center mb-6">
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
          <FaShoppingBag className="text-gray-400 text-3xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 text-center">Sepetiniz Boş</h2>
        <p className="text-gray-600 mb-6 text-center">Alışverişe başlamak için ürünler sayfasına göz atın.</p>
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
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Sipariş Bilgileri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adres</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Sipariş Notu (İsteğe bağlı)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h4 className="font-medium mb-2">Kart Bilgileri (Demo - ödeme alınmaz)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Kart Numarası</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      maxLength={19}
                      required
                      value={formData.cardNumber}
                      onChange={e => setFormData({ ...formData, cardNumber: e.target.value.replace(/[^\d]/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                      placeholder="0000 0000 0000 0000"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">Son Kullanma</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        maxLength={5}
                        required
                        value={formData.cardExpiry}
                        onChange={e => setFormData({ ...formData, cardExpiry: e.target.value.replace(/[^\d\/]/g, '').replace(/(\d{2})(\d{0,2})/, (m, m1, m2) => m2 ? m1 + '/' + m2 : m1) })}
                        placeholder="AA/YY"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="text"
                        id="cardCvv"
                        name="cardCvv"
                        maxLength={4}
                        required
                        value={formData.cardCvv}
                        onChange={e => setFormData({ ...formData, cardCvv: e.target.value.replace(/[^\d]/g, '') })}
                        placeholder="123"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Bu bilgiler demo amaçlıdır, ödeme alınmaz ve kaydedilmez.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
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
          
          <div>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Sipariş Özeti</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="font-medium text-sm sm:text-base">{item.product.name}</span>
                      <span className="ml-2 text-xs sm:text-sm text-gray-500">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base">
                      {(item.product.price * item.quantity).toLocaleString('tr-TR')} TL
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Toplam</span>
                  <span>{totalPrice.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 mt-4 sm:mt-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Sepetim</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex-shrink-0 mr-4 mb-4 sm:mb-0">
                    {item.product.image && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 relative overflow-hidden rounded">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <Link href={`/products/${item.product.id}`} className="hover:text-blue-500 transition-colors">
                      <h3 className="text-base sm:text-lg font-medium">{item.product.name}</h3>
                    </Link>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">{item.product.price.toLocaleString('tr-TR')} TL</p>
                  </div>
                  
                  <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center border rounded mr-4 flex-1 sm:flex-none">
                      <button
                        className="px-2 sm:px-3 py-1 border-r text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Ürün miktarını azalt"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                        className="w-8 sm:w-12 text-center py-1 border-0 focus:ring-0 focus:outline-none text-sm"
                        aria-label="Ürün miktarı"
                      />
                      
                      <button
                        className="px-2 sm:px-3 py-1 border-l text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Ürün miktarını artır"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 sm:p-2"
                      aria-label="Ürünü sepetten çıkar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow sticky top-20">
            <h2 className="text-lg font-medium mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-3 mb-6 max-h-[30vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm sm:text-base pb-2 border-b border-gray-100">
                  <span className="truncate pr-2 max-w-[60%]">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.product.price * item.quantity).toLocaleString('tr-TR')} TL
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Toplam</span>
                <span>{totalPrice.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Siparişi Tamamla
            </button>
            
            <Link 
              href="/products" 
              className="flex items-center justify-center mt-4 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 