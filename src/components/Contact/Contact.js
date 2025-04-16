"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import Image from 'next/image';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Form verilerini konsola yazdırma - debug için
      console.log('Gönderilen form verileri:', formData);
      
      // API'ya iletişim formu verilerini gönder
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log('API yanıtı:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }
      
      // Başarılı gönderim
      setSubmitStatus({ 
        success: true, 
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' 
      });
      
      // Form alanlarını temizle
      setFormData({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        message: '' 
      });
      
      // Başarılı gönderimlerde animasyon için element'e scroll yap
      const successMessage = document.querySelector('.success-animation');
      if (successMessage) {
        successMessage.classList.add('animate-success');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error('İletişim formu gönderilirken hata:', error);
      setSubmitStatus({ 
        success: false, 
        message: `Hata oluştu: ${error.message}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white py-10 px-4 transition-colors duration-300">
      {/* Başlık */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        İletişim
      </h1>
      
      {/* Ana İçerik */}
      <div className="max-w-6xl mx-auto bg-gray-100 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-blue-900/30 hover:shadow-blue-900/20 transition-all">
        <div className="flex flex-col md:flex-row">
          
          {/* Sol Panel - Koyu Mavi alan */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:bg-black dark:!text-white p-8 md:p-12 md:w-5/12 relative transition-colors duration-300">
            {/* Üst köşe süsü */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full -mr-20 -mt-20 blur-xl"></div>
            
            <div className="mb-12 relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bizimle İletişime Geçin</h2>
              <div className="w-16 h-1 bg-blue-400 mb-6"></div>
              <p className="text-blue-700 dark:text-white mb-8 text-lg">
                Formu doldurun, ekibimiz 24-48 saat içinde size geri dönüş yapacaktır!
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center group">
                <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30">
                  <FaPhone className="text-blue-300 dark:text-blue-200" />
                </div>
                <span className="text-blue-700 dark:text-white text-lg">0123456789</span>
              </div>
              <div className="flex items-center group">
                <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30">
                  <FaEnvelope className="text-blue-300 dark:text-blue-200" />
                </div>
                <span className="text-blue-700 dark:text-white text-lg">info@yazilimcozumleri.com</span>
              </div>
            </div>
            
            {/* Alt köşe süsü */}
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-xl"></div>
          </div>
          
          {/* Sağ Panel - Form */}
          <div className="p-8 md:p-12 md:w-7/12 bg-white text-gray-900 dark:bg-black dark:!text-white backdrop-blur-md transition-colors duration-300">
            {submitStatus && (
              <div className={`p-5 mb-8 rounded-xl flex items-center ${
                submitStatus.success 
                  ? 'bg-gradient-to-r from-green-900/50 to-green-700/30 text-green-200 border border-green-700/30 success-animation' 
                  : 'bg-gradient-to-r from-red-900/50 to-red-700/30 text-red-200 border border-red-700/30'
              }`}>
                {submitStatus.success && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-300 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-blue-700 dark:text-white mb-1">
                    Adınız
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-[#23272f] text-gray-900 dark:text-[#e3e8ee] placeholder-gray-500 dark:placeholder:text-gray-400 border border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all shadow-inner"
                    style={{caretColor: 'black'}}
                    placeholder="Ahmet"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-blue-700 dark:text-white mb-1">
                    Soyadınız
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-[#23272f] text-gray-900 dark:text-[#e3e8ee] placeholder-gray-500 dark:placeholder:text-gray-400 border border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all shadow-inner"
                    style={{caretColor: 'black'}}
                    placeholder="Yılmaz"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-700 dark:text-white mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-[#23272f] text-gray-900 dark:text-[#e3e8ee] placeholder-gray-500 dark:placeholder:text-gray-400 border border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all shadow-inner"
                    style={{caretColor: 'black'}}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-700 dark:text-white mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-[#23272f] text-gray-900 dark:text-[#e3e8ee] placeholder-gray-500 dark:placeholder:text-gray-400 border border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all shadow-inner"
                    style={{caretColor: 'black'}}
                    placeholder="+90 555 123 4567"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-700 dark:text-white mb-1">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 bg-gray-100 dark:bg-black text-gray-900 dark:!text-white placeholder-gray-500 dark:placeholder:text-gray-400 border border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all shadow-inner"
                  style={{caretColor: 'black'}}
                  placeholder="Mesajınızı buraya yazınız..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto md:px-16 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center relative overflow-hidden group"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </span>
                ) : (
                  <span className="flex items-center relative z-10">
                    <FaPaperPlane className="mr-2" /> Mesaj Gönder
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 