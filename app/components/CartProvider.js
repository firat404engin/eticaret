"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  // LocalStorage'dan sepeti getir
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error);
        setCart([]);
      }
    }
  }, []);
  
  // Sepet değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Sepete ürün ekle
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Ürün zaten sepette var mı kontrol et
      const existingProductIndex = prevCart.findIndex(
        item => item.product.id === product.id
      );
      
      if (existingProductIndex >= 0) {
        // Ürün zaten sepette ise miktarını güncelle
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Ürün sepette yoksa yeni ürün olarak ekle
        return [...prevCart, { product, quantity }];
      }
    });
  };
  
  // Sepetteki ürün miktarını güncelle
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      // Miktar 0 veya daha azsa ürünü sepetten kaldır
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Sepetten ürün kaldır
  const removeFromCart = (productId) => {
    setCart(prevCart => 
      prevCart.filter(item => item.product.id !== productId)
    );
  };
  
  // Sepeti temizle
  const clearCart = () => {
    setCart([]);
  };
  
  // Sepetteki toplam ürün sayısı
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider 
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 