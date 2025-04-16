import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserTag, FaTimes, FaSpinner } from 'react-icons/fa';

export default function AdminEditModal({ isOpen, onClose, onSubmit, isLoading, admin }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin'
  });
  
  const [errors, setErrors] = useState({});
  
  // Modal açıldığında admin bilgilerini forma doldur
  useEffect(() => {
    if (isOpen && admin) {
      setFormData({
        first_name: admin.first_name || '',
        last_name: admin.last_name || '',
        email: admin.email || '',
        password: '', // Şifre alanını boş bırak
        phone: admin.phone || '',
        role: admin.role || 'admin'
      });
      setErrors({});
    }
  }, [isOpen, admin]);
  
  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Anlık doğrulama için hataları temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Ad alanı zorunludur';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Soyad alanı zorunludur';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    // Şifre alanı doldurulmuşsa kontrol et
    if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Şifre alanı boşsa güncellenecek verilerden çıkar
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      
      onSubmit(admin.id, updatedData);
    }
  };
  
  // Eğer modal kapalıysa hiçbir şey render etme
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 animate-fadeIn">
        {/* Modal Başlık */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Düzenle
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Ad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaUser className="inline-block mr-1" /> Ad
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                placeholder="Ad"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>
            
            {/* Soyad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaUser className="inline-block mr-1" /> Soyad
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                placeholder="Soyad"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
              )}
            </div>
          </div>
          
          {/* E-posta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaEnvelope className="inline-block mr-1" /> E-posta
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="E-posta adresi"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* Şifre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaLock className="inline-block mr-1" /> Şifre (Değiştirmek istemiyorsanız boş bırakın)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Yeni şifre"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Şifre en az 6 karakter olmalıdır. Boş bırakırsanız şifre değişmez.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Telefon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaPhone className="inline-block mr-1" /> Telefon (İsteğe Bağlı)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="+90 555 123 4567"
              />
            </div>
            
            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaUserTag className="inline-block mr-1" /> Rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Süper Admin</option>
              </select>
            </div>
          </div>
          
          {/* Butonlar */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Güncelleniyor...
                </>
              ) : (
                'Güncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 