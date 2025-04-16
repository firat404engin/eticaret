"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../../src/utils/supabase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // LocalStorage'dan sepeti getir
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // LocalStorage'dan yüklenen sepet öğeleri için görsel URL'leri güncelle
        loadProductImages(parsedCart);
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error);
        setCart([]);
      }
    }
  }, []);
  
  // Supabase'den ürün görsellerini yükle
  const loadProductImages = async (cartItems) => {
    setIsLoading(true);
    try {
      // Sepetteki ürün ID'lerini al
      const productIds = cartItems.map(item => item.product.id);
      
      if (productIds.length === 0) {
        setCart([]);
        setIsLoading(false);
        return;
      }
      
      // Supabase'den ürün bilgilerini al
      const { data, error } = await supabase
        .from('products')
        .select('id, image_url')
        .in('id', productIds);
        
      if (error) {
        console.error('Ürün görselleri yüklenirken hata:', error);
        setCart(cartItems); // Hata durumunda mevcut sepeti kullan
      } else {
        // Ürün bilgilerini eşleştir ve sepeti güncelle
        const updatedCart = cartItems.map(item => {
          const productData = data.find(p => p.id === item.product.id);
          if (productData && productData.image_url) {
            return {
              ...item,
              product: {
                ...item.product,
                image_url: productData.image_url
              }
            };
          }
          return item;
        });
        
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Ürün görselleri işlenirken hata:', error);
      setCart(cartItems);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sepet değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Stok durumunu kontrol et
  const checkStock = async (productId, requestedQuantity) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();
        
      if (error) {
        console.error('Stok kontrolü sırasında hata:', error);
        return false;
      }
      
      return data.stock >= requestedQuantity;
    } catch (error) {
      console.error('Stok kontrolü başarısız:', error);
      return false;
    }
  };
  
  // Stok miktarını güncelle
  const updateStock = async (productId, quantity, isRemove = false) => {
    try {
      // Önce mevcut stok miktarını al
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();
        
      if (productError) {
        console.error('Ürün bilgisi alınırken hata:', productError);
        return false;
      }
      
      // Yeni stok miktarını hesapla (ekleme için - çıkarma, silme için + ekleme)
      const newStock = isRemove 
        ? productData.stock + quantity 
        : productData.stock - quantity;
      
      // Stok 0'dan küçük olamaz
      if (newStock < 0) {
        console.error('Yetersiz stok!');
        return false;
      }
      
      // Stok miktarını güncelle
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
        
      if (error) {
        console.error('Stok güncellenirken hata:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Stok güncelleme başarısız:', error);
      return false;
    }
  };
  
  // Sepete ürün ekle
  const addToCart = async (product, quantity = 1) => {
    // Stok kontrolü yap
    const hasStock = await checkStock(product.id, quantity);
    if (!hasStock) {
      alert('Bu ürün için yeterli stok bulunmamaktadır!');
      return false;
    }
    
    // Mevcut ürün sepette mi kontrol et
    const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Ürün zaten sepette ise miktarını güncelle
      const currentQuantity = cart[existingProductIndex].quantity;
      const newQuantity = currentQuantity + quantity;
      
      // Toplam miktar için stok kontrolü
      const hasEnoughStock = await checkStock(product.id, newQuantity);
      if (!hasEnoughStock) {
        alert('Bu miktar için yeterli stok bulunmamaktadır!');
        return false;
      }
      
      // Stoktan düş
      const stockUpdated = await updateStock(product.id, quantity);
      if (!stockUpdated) {
        alert('Stok güncellenirken bir hata oluştu!');
        return false;
      }
      
      // Sepeti güncelle
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity = newQuantity;
      setCart(updatedCart);
    } else {
      // Supabase'den güncel ürün verilerini al
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('id', product.id)
        .single();
        
      if (error) {
        console.error('Ürün bilgileri alınırken hata:', error);
        return false;
      }
      
      // Stoktan düş
      const stockUpdated = await updateStock(product.id, quantity);
      if (!stockUpdated) {
        alert('Stok güncellenirken bir hata oluştu!');
        return false;
      }
      
      // Sepete ekle
      const updatedProduct = {
        ...product,
        image_url: data.image_url
      };
      
      setCart(prevCart => [...prevCart, { product: updatedProduct, quantity }]);
    }
    
    return true;
  };
  
  // Sepetteki ürün miktarını güncelle
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Miktar 0 veya daha azsa ürünü sepetten kaldır
      removeFromCart(productId);
      return true;
    }
    
    // Mevcut miktarı bul
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) {
      console.error('Güncellenecek ürün sepette bulunamadı!');
      return false;
    }
    
    const currentQuantity = cartItem.quantity;
    
    // Stok kontrolü yap
    if (newQuantity > currentQuantity) {
      // Miktar artırılıyorsa
      const diff = newQuantity - currentQuantity;
      const hasStock = await checkStock(productId, newQuantity);
      
      if (!hasStock) {
        alert('Bu miktar için yeterli stok bulunmamaktadır!');
        return false;
      }
      
      // Stoktan düş
      const stockUpdated = await updateStock(productId, diff);
      if (!stockUpdated) {
        alert('Stok güncellenirken bir hata oluştu!');
        return false;
      }
    } else if (newQuantity < currentQuantity) {
      // Miktar azaltılıyorsa, stoka ekle
      const diff = currentQuantity - newQuantity;
      const stockUpdated = await updateStock(productId, diff, true);
      
      if (!stockUpdated) {
        alert('Stok güncellenirken bir hata oluştu!');
        return false;
      }
    }
    
    // Sepeti güncelle
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
    
    return true;
  };
  
  // Sepetten ürün kaldır
  const removeFromCart = async (productId) => {
    // Ürünün mevcut miktarını bul
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) {
      console.error('Kaldırılacak ürün sepette bulunamadı!');
      return false;
    }
    
    // Stoka geri ekle
    const stockUpdated = await updateStock(productId, cartItem.quantity, true);
    if (!stockUpdated) {
      alert('Stok güncellenirken bir hata oluştu!');
      return false;
    }
    
    // Sepetten kaldır
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    return true;
  };
  
  // Sepeti temizle
  const clearCart = async () => {
    // Tüm ürünleri stoka geri ekle
    for (const item of cart) {
      await updateStock(item.product.id, item.quantity, true);
    }
    
    setCart([]);
    return true;
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
        getTotalItems,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 