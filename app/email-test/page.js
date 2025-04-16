"use client";

import { useState } from 'react';

export default function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [testMode, setTestMode] = useState('basic'); // basic veya order

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let payload;
      
      if (testMode === 'basic') {
        payload = {
          email: email,
          name: "Test Kullanıcı",
          productName: "Test Ürünü",
        };
      } else {
        // Order test modu - daha kapsamlı test
        payload = {
          email: email,
          name: "Test Kullanıcı",
          productName: "Test Ürünü",
          orderData: {
            customer_name: "Test Kullanıcı",
            email: email,
            phone: "555-123-4567",
            address: "Test Adres, İstanbul",
            date: new Date().toISOString(),
            total: 1250.00,
            items: [
              {
                name: "Premium Ürün",
                quantity: 2,
                price: 500,
                image_url: "/images/product-placeholder.jpg"
              },
              {
                name: "Ekonomik Ürün",
                quantity: 1,
                price: 250,
                image_url: "/images/product-placeholder.jpg"
              }
            ]
          }
        };
      }

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        data: data
      });
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">E-posta Gönderim Testi</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Alıcı E-posta Adresi
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="ornek@email.com"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="basic"
                name="testMode"
                value="basic"
                checked={testMode === 'basic'}
                onChange={() => setTestMode('basic')}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="basic" className="ml-2 block text-sm text-gray-700">
                Basit E-posta
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="order"
                name="testMode"
                value="order"
                checked={testMode === 'order'}
                onChange={() => setTestMode('order')}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="order" className="ml-2 block text-sm text-gray-700">
                Sipariş E-postası
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'E-posta Gönder'}
            </button>
          </div>
        </form>

        {result && (
          <div className={`mt-4 p-3 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success 
                ? `E-posta başarıyla gönderildi! Mesaj ID: ${result.data.messageId || 'N/A'}` 
                : `Hata: ${result.data?.error || result.error || 'Bilinmeyen hata'}`}
            </p>
            {!result.success && result.data && (
              <details className="mt-2">
                <summary className="text-sm text-red-700 cursor-pointer">Detaylı hata bilgisi</summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>Not: Bu test sayfası, e-posta gönderim API'nizi canlı ortamda test etmenizi sağlar.</p>
        <p className="mt-2">Outlook SMTP ayarlarınızı kontrol etmeyi unutmayın.</p>
      </div>
    </div>
  );
} 