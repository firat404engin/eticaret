"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import './contact.css'; // Özel CSS dosyası import edilecek

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
      console.log('Gönderilen form verileri:', formData);
      
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
      
      setSubmitStatus({ 
        success: true, 
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' 
      });
      
      setFormData({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        message: '' 
      });
      
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
    <div className="contact-page">
      <div className="contact-inner">
        <h1 className="contact-header">
          İletişim
        </h1>
        
        <div className="contact-box">
          <div className="contact-flex">
            
            {/* Sol Panel - İletişim Bilgileri */}
            <div className="contact-info">
              <div className="info-content">
                <h2 className="info-title">Bizimle İletişime Geçin</h2>
                <div className="info-divider"></div>
                <p className="info-text">
                  Formu doldurun, ekibimiz 24-48 saat içinde size geri dönüş yapacaktır!
                </p>
              </div>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <span className="contact-text">0123456789</span>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <span className="contact-text">info@yazilimcozumleri.com</span>
                </div>
              </div>
            </div>
            
            {/* Sağ Panel - Form */}
            <div className="contact-form">
              {submitStatus && (
                <div className={`status-message ${submitStatus.success ? 'success-message' : 'error-message'}`}>
                  {submitStatus.success && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="form-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      Adınız
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Ahmet"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Soyadınız
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Yılmaz"
                    />
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="form-textarea"
                    placeholder="Mesajınızı buraya yazınız..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="form-button"
                >
                  {isSubmitting ? (
                    <span className="button-content">
                      <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    <span className="button-content">
                      <FaPaperPlane className="button-icon" /> Mesaj Gönder
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 