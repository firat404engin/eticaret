"use client";

import React, { useState } from 'react';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Varsayılan ürün bilgisi
  const defaultProduct = {
    id: 1,
    name: "Örnek Ürün",
    description: "Bu bir örnek ürün açıklamasıdır. Gerçek ürün bilgileri burada detaylı olarak yer alacaktır.",
    price: 149.99,
    image_url: "/product-placeholder.jpg",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ingredients: [
      "Bileşen 1",
      "Bileşen 2",
      "Bileşen 3",
      "Bileşen 4",
      "Bileşen 5"
    ]
  };

  const productData = product || defaultProduct;
  
  // Sepete ürün ekleme işlemi
  const addToCart = () => {
    // Yerel depolamadan mevcut sepeti al
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Ürünün sepette olup olmadığını kontrol et
    const existingItemIndex = existingCart.findIndex(item => item.id === productData.id);
    
    if (existingItemIndex >= 0) {
      // Ürün zaten sepetteyse miktarını güncelle
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Ürün sepette değilse yeni ekle
      existingCart.push({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        quantity: quantity,
        image_url: productData.image_url
      });
    }
    
    // Sepeti local storage'a kaydet
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Kullanıcıya geri bildirim ver
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  
  // Malzemeler varsa göster
  const ingredients = productData.ingredients || [];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img 
              src={productData.image_url || '/product-placeholder.jpg'} 
              alt={productData.name} 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{productData.name}</h1>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-4">{productData.price} TL</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{productData.description}</p>
            
            {ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">İçindekiler:</h3>
                <ul className="list-disc list-inside">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium text-gray-900 dark:text-white">Adet:</span>
              <div className="flex items-center border rounded-md border-gray-300 dark:border-gray-600">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 text-lg text-gray-900 dark:text-white"
                >
                  -
                </button>
                <span className="px-3 py-1 text-gray-900 dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1 text-lg text-gray-900 dark:text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              onClick={addToCart}
              className={`bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mt-6 ${
                addedToCart ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              {addedToCart ? 'Sepete Eklendi ✓' : 'Sepete Ekle'}
            </button>
          </div>
        </div>

        {/* Video Bölümü */}
        {productData.video_url && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">İlgili Video</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={productData.video_url} 
                title={`${productData.name} videosu`}
                className="w-full h-96 rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 