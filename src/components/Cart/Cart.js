"use client";

import React, { useState, useEffect } from 'react';
import OrderForm from './OrderForm';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-4 border-gray-200 dark:border-gray-700 px-2">
      <div className="flex items-center mb-4 sm:mb-0">
        <img 
          src={item.image_url || '/product-placeholder.jpg'} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{item.name}</h3>
          <p className="text-gray-700 dark:text-gray-300 font-medium">{item.price} TL</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center border rounded-md mr-4">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="px-3 py-1 disabled:opacity-50 font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
          >
            -
          </button>
          <span className="px-3 py-1">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1 font-bold text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
          >
            +
          </button>
        </div>
        <button 
          onClick={() => removeItem(item.id)}
          className="ml-2 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:bg-red-900/40 dark:hover:bg-red-600 rounded px-3 py-1 font-semibold transition"
        >
          Kaldır
        </button>
      </div>
    </div>
  );
};

const OrderSuccess = ({ order }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-800">
      <div className="text-green-600 dark:text-green-400 text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Siparişiniz Başarıyla Alındı!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Teşekkürler, {order.customer_name}! Siparişiniz için onay e-postası {order.email} adresine gönderildi.
      </p>
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-left">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Sipariş Özeti:</h3>
        <ul className="mb-4">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} TL</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 font-bold flex justify-between border-gray-200 dark:border-gray-700">
          <span>Toplam:</span>
          <span>{order.total} TL</span>
        </div>
      </div>
      <a 
        href="/products" 
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 inline-block"
      >
        Alışverişe Devam Et
      </a>
    </div>
  );
};

const Cart = () => {
  // State'ler
  const [cartItems, setCartItems] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  // Sepet verilerini localStorage'dan al
  useEffect(() => {
    const loadCartFromLocalStorage = () => {
      try {
        // Tarayıcıda çalıştığından emin ol
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error);
      }
    };
    
    loadCartFromLocalStorage();
  }, []);
  
  // Sepeti localStorage'a kaydet
  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const handleOrderSubmit = (order) => {
    setOrderData(order);
    setOrderComplete(true);
    
    // Sipariş tamamlandıktan sonra sepeti temizle
    setCartItems([]);
    saveCartToLocalStorage([]);
  };

  if (orderComplete && orderData) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <OrderSuccess order={orderData} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-tight">
          {isCheckout ? 'Sipariş Bilgileri' : 'Sepetim'}
        </h2>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
            <a 
              href="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 inline-block"
            >
              Alışverişe Başla
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${isCheckout ? 'md:col-span-1 order-2 md:order-1' : 'md:col-span-3'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {isCheckout ? 'Sipariş Özeti' : 'Sepetinizdeki Ürünler'}
                </h3>
                
                <div className={`${isCheckout ? 'max-h-80 overflow-y-auto' : ''}`}>
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      updateQuantity={isCheckout ? null : updateQuantity} 
                      removeItem={isCheckout ? null : removeItem}
                    />
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Toplam:</span>
                    <span className="text-blue-600">{calculateTotal()} TL</span>
                  </div>
                  
                  {!isCheckout && (
                    <button 
                      onClick={handleCheckout}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                      Siparişi Tamamla
                    </button>
                  )}
                </div>
              </div>
              
              {!isCheckout && (
                <div className="bg-blue-50 rounded-lg p-4 text-blue-800 text-sm">
                  <p className="mb-2 font-semibold">Alışveriş Güvencesi</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hızlı ve güvenli teslimat</li>
                    <li>7/24 müşteri desteği</li>
                    <li>İade garantisi</li>
                  </ul>
                </div>
              )}
            </div>
            
            {isCheckout && (
              <div className="md:col-span-2 order-1 md:order-2">
                <OrderForm 
                  cartItems={cartItems} 
                  totalAmount={calculateTotal()} 
                  onOrderSubmit={handleOrderSubmit} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 