"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaTimes,
  FaSave,
  FaSpinner,
  FaStar,
  FaTags,
  FaImage,
  FaCheck,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTh,
  FaThList,
  FaBox,
  FaSyncAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaMoneyBillWave,
  FaPercent,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: 0,
    sales: 0,
    image_url: '',
    rating: 0,
    reviewcount: 0,
    features: [],
    category: '',
    popular: false
  });
  const [featureInput, setFeatureInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState(['all']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 12;

  // ÃœrÃ¼nleri yÃ¼kle
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products?search=${searchTerm}&category=${selectedCategory}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ÃœrÃ¼nler alÄ±namadÄ±');
      }
      
      setProducts(data.products || []);
      
      // Kategorileri Ã§Ä±kart
      const uniqueCategories = ['all', ...new Set((data.products || []).map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('ÃœrÃ¼nler yÃ¼klenirken hata:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Sayfa yÃ¼klendiÄŸinde ve filtreler deÄŸiÅŸtiÄŸinde Ã¼rÃ¼nleri getir
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  // ÃœrÃ¼n ekle
  const addProduct = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ÃœrÃ¼n eklenemedi');
      }
      
      setProducts([data.product, ...products]);
      setShowModal(false);
      resetForm();
      fetchProducts(); // Listeyi yenile
    } catch (error) {
      console.error('ÃœrÃ¼n eklenirken hata:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ÃœrÃ¼n gÃ¼ncelle
  const updateProduct = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedProduct.id,
          ...formData
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ÃœrÃ¼n gÃ¼ncellenemedi');
      }
      
      setProducts(products.map(p => p.id === data.product.id ? data.product : p));
      setShowModal(false);
      resetForm();
      fetchProducts(); // Listeyi yenile
    } catch (error) {
      console.error('ÃœrÃ¼n gÃ¼ncellenirken hata:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ÃœrÃ¼n sil
  const handleDelete = async (id) => {
    console.log('Sil butonuna tıklandı, id:', id);
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ÃœrÃ¼n silinemedi');
      }
      
      setProducts(products.filter(p => p.id !== id));
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('ÃœrÃ¼n silinirken hata:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form verilerini sıfırla
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      stock: 0,
      sales: 0,
      image_url: '',
      rating: 0,
      reviewcount: 0,
      features: [],
      category: '',
      popular: false
    });
    setSelectedProduct(null);
    setFeatureInput('');
  };

  // Form alanlarını değiştir
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'features') {
      // Özellikler için özel işleme - virgülle ayrılmış değerleri diziye dönüştür
      const featuresArray = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({
        ...prev,
        features: featuresArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Modal işlemleri
  const openModal = (type, product = null) => {
    setModalType(type);
    // Silme modalı için mutlaka product olması gerekir
    if (type === 'delete') {
      if (!product || !product.id) {
        alert('Silinecek ürün bulunamadı (product null)!');
        return;
      }
      setSelectedProduct(product);
      setShowModal(true);
      return;
    }
    setSelectedProduct(product);
    if (product && (type === 'edit' || type === 'view')) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock || 0,
        sales: product.sales || 0,
        image_url: product.image_url || '',
        rating: product.rating || 0,
        reviewcount: product.reviewcount || 0,
        features: product.features || [],
        category: product.category || '',
        popular: product.popular || false
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Ürün formunu gönder
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      addProduct();
    } else if (modalType === 'edit') {
      updateProduct();
    } else if (modalType === 'delete') {
      if (!selectedProduct || !selectedProduct.id) {
        alert('Silinecek ürün bulunamadı veya ürün ID eksik! Lütfen sayfayı yenileyin veya tekrar deneyin.');
        return;
      }
      handleDelete(selectedProduct.id);
    }
  };

  // Ürünleri filtrele
  const filteredProducts = products.filter(product => {
    const searchMatch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    
    return searchMatch && categoryMatch;
  });

  // Ürünleri sırala
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Sayısal değerler için
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // String değerler için
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Tarih değerleri için
    if (sortField === 'created_at' || sortField === 'updated_at') {
      const dateA = aValue ? new Date(aValue) : new Date(0);
      const dateB = bValue ? new Date(bValue) : new Date(0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });

  // Sayfalama
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Fiyat formatla
  const formatPrice = (price) => {
    if (!price) return '₺0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(numPrice);
  };

  // Stok durumuna göre stil
  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Stokta Yok', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
    if (stock < 10) return { text: 'Sınırlı Stok', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
    return { text: 'Stokta', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <FaBox className="mr-2 text-indigo-600" /> Ürün Yönetimi
          <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
            {products.length} ürün
          </span>
        </h1>
        <button
          onClick={() => openModal('add')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
        >
          <FaPlus className="mr-2" size={14} />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Arama */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Ürün adı, kategorisi veya açıklaması..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Kategori Filtresi */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <select
              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tüm Kategoriler' : category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sıralama */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <select
              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="name">Ad</option>
              <option value="price">Fiyat</option>
              <option value="stock">Stok</option>
              <option value="sales">Satış</option>
              <option value="rating">Puanlama</option>
              <option value="created_at">Eklenme Tarihi</option>
            </select>
          </div>
          
          {/* Sıralama Yönü */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              title={sortOrder === 'asc' ? 'Artan' : 'Azalan'}
            >
              {sortOrder === 'asc' ? <FaSortAmountUp size={16} /> : <FaSortAmountDown size={16} />}
            </button>
          </div>
          
          {/* Görünüm Değiştir */}
          <div className="flex-shrink-0 flex space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2.5 border rounded-lg ${viewMode === 'cards' 
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-500' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`
              }
              title="Kart Görünümü"
            >
              <FaTh size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 border rounded-lg ${viewMode === 'table' 
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-500' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`
              }
              title="Tablo Görünümü"
            >
              <FaThList size={16} />
            </button>
          </div>
          
          {/* Yenile */}
          <div className="flex-shrink-0">
            <button
              onClick={() => fetchProducts()}
              className="p-2.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 rounded-lg"
              title="Yenile"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" size={16} /> : <FaSyncAlt size={16} />}
            </button>
          </div>
        </div>
      </div>
      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg shadow-sm flex items-center">
          <FaExclamationTriangle className="mr-2" size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Yükleniyor */}
      {loading && !error && (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin mx-auto mb-3 text-indigo-600" size={36} />
          <p className="text-gray-500 dark:text-gray-400">Ürünler yükleniyor...</p>
        </div>
      )}

      {/* Ürün Listesi */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Kart Görünümü */}
          {viewMode === 'cards' && (
            <div className="p-4">
              {currentProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600 dark:text-gray-400">Hiç ürün bulunamadı.</p>
                  <p className="text-sm mt-2 text-gray-500 dark:text-gray-500">Farklı arama kriterleri kullanarak tekrar deneyin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div key={product.id} className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                        {/* Ürün Görseli */}
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          {product.image_url ? (
                            <div className="relative h-full w-full">
                              <Image 
                                src={product.image_url} 
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FaImage className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                          {/* Kategori etiketi */}
                          {product.category && (
                            <span className="absolute top-2 right-2 bg-gray-800/70 text-white text-xs font-medium px-2 py-1 rounded">
                              {product.category}
                            </span>
                          )}
                          {/* Popüler etiketi */}
                          {product.popular && (
                            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                              Popüler
                            </span>
                          )}
                        </div>
                        
                        {/* Ürün Detayları */}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-md font-medium text-gray-900 dark:text-white line-clamp-2">
                              {product.name}
                            </h3>
                            <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          
                          {/* Kısa Açıklama */}
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {product.description || '-'}
                          </p>
                          
                          {/* Özellikler */}
                          {(() => {
                            let featuresArr = [];
                            if (Array.isArray(product.features)) {
                              featuresArr = product.features;
                            } else if (typeof product.features === 'string' && product.features.trim() !== '') {
                              featuresArr = product.features.split(',').map(f => f.trim()).filter(Boolean);
                            }
                            return featuresArr.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {featuresArr.map((feature, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            ) : null;
                          })()}

                          
                          {/* Alt Bilgiler */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <FaShoppingCart className="mr-1" size={12} />
                              <span>{product.stock || 0} adet</span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 justify-end">
                              <FaStar className="mr-1 text-yellow-400" size={12} />
                              <span>{product.rating || 0} ({product.reviewcount || 0})</span>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stockStatus.class}`}>
                                {stockStatus.text}
                              </span>
                            </div>
                            <div className="flex items-center justify-end text-gray-500 dark:text-gray-400">
                              <FaShoppingCart className="mr-1 text-indigo-400" size={12} />
                              <span>{product.sales || 0} satış</span>
                            </div>
                          </div>
                          
                          {/* Butonlar */}
                          <div className="mt-4 flex space-x-1 justify-end">
                            <button
                              onClick={() => openModal('view', product)}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                              title="Görüntüle"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => openModal('edit', product)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                              title="Düzenle"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => openModal('delete', product)}
                              className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                              title="Sil"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          {/* Tablo Görünümü */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ürün
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fiyat
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stok
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Satış
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg">Hiç ürün bulunamadı.</p>
                        <p className="text-sm mt-2">Filtreleri değiştirerek tekrar deneyin.</p>
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 mr-3 overflow-hidden">
                                {product.image_url ? (
                                  <div className="relative h-full w-full">
                                    <Image 
                                      src={product.image_url} 
                                      alt={product.name}
                                      width={40}
                                      height={40}
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <FaImage className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="max-w-xs">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {product.popular && (
                                    <span className="inline-flex items-center mr-2 text-xs text-yellow-600 dark:text-yellow-400">
                                      <FaStar className="mr-1" size={10} /> Popüler
                                    </span>
                                  )}
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {product.category || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {product.stock}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {product.sales || 0}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium ${stockStatus.class}`}>
                              {stockStatus.text}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                            <button 
                              onClick={() => openModal('view', product)}
                              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300"
                              title="Görüntüle"
                            >
                              <FaEye size={16} />
                            </button>
                            <button 
                              onClick={() => openModal('edit', product)}
                              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300"
                              title="Düzenle"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button 
                              onClick={() => openModal('delete', product)}
                              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-300"
                              title="Sil"
                            >
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 mt-4 px-4 py-3 flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                <span className="font-medium">{indexOfFirstProduct + 1}</span>
                {' '}-{' '}
                <span className="font-medium">{Math.min(indexOfLastProduct, sortedProducts.length)}</span>
                {' '}/ {' '}
                <span className="font-medium">{sortedProducts.length}</span>
                {' '}ürün gösteriliyor
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page 
                        ? 'z-10 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
          <div className="flex sm:hidden justify-between w-full">
            <button
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Önceki
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}

      {/* Ürün Modal */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Modal Panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                {/* Modal Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {modalType === 'add' ? 'Yeni Ürün Ekle' : 
                     modalType === 'edit' ? 'Ürün Düzenleme' : 
                     modalType === 'view' ? 'Ürün Detayları' : ''}
                  </h3>
                  {modalType === 'delete' && 'Ürünü Sil'}
                  <button 
                    type="button" 
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="sr-only">Kapat</span>
                    <FaTimes size={20} />
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {/* Silme Modalı */}
                  {modalType === 'delete' && (
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                        <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          Ürünü Sil
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>{selectedProduct?.name}</strong> adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Görüntüleme, Ekleme ve Düzenleme Modalı */}
                  {modalType !== 'delete' && (
                    <div className="grid grid-cols-1 gap-4">
                      {/* Ürün Görseli */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ürün Görseli
                        </label>
                        {modalType === 'view' ? (
                          <div className="flex items-center justify-center w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                            {selectedProduct?.image_url ? (
                              <div className="relative h-40 w-40">
                                <Image
                                  src={selectedProduct.image_url}
                                  alt={selectedProduct.name || 'Ürün görseli'}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="h-40 w-40 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                                <FaImage className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center">
                            <input
                              type="text"
                              name="image_url"
                              id="image_url"
                              placeholder="https://example.com/resim.jpg"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              value={formData.image_url}
                              onChange={handleChange}
                              disabled={modalType === 'view'}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Ürün Adı */}
                      <div className="col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ürün Adı <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Ürün adını girin"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={modalType === 'view'}
                          required
                        />
                      </div>
                      
                      {/* Kategori ve Fiyat */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kategori
                          </label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            placeholder="Ürün kategorisini girin"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={modalType === 'view'}
                          />
                        </div>
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fiyat (₺) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            value={formData.price}
                            onChange={handleChange}
                            disabled={modalType === 'view'}
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Puanlama ve Popülerlik */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Puanlama (0-5)
                          </label>
                          <input
                            type="number"
                            name="rating"
                            id="rating"
                            placeholder="0"
                            min="0"
                            max="5"
                            step="0.1"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            value={formData.rating}
                            onChange={handleChange}
                            disabled={modalType === 'view'}
                          />
                        </div>
                        <div className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            name="popular"
                            id="popular"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                            checked={formData.popular}
                            onChange={handleChange}
                            disabled={modalType === 'view'}
                          />
                          <label htmlFor="popular" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Popüler Ürün
                          </label>
                        </div>
                      </div>
                      
                      {/* Stok ve Satış Adedi */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stok Adedi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="stock"
                            id="stock"
                            placeholder="0"
                            min="0"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            value={formData.stock}
                            onChange={handleChange}
                            disabled={modalType === 'view'}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="sales" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Satış Adedi
                          </label>
                          <input
                            type="number"
                            name="sales"
                            id="sales"
                            placeholder="0"
                            min="0"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            value={formData.sales}
                            onChange={handleChange}
                            disabled={modalType === 'view'}
                          />
                        </div>
                      </div>
                      
                      {/* Açıklama */}
                      <div className="col-span-1">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Açıklama
                        </label>
                        <textarea
                          rows="3"
                          name="description"
                          id="description"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          value={formData.description}
                          onChange={handleChange}
                          disabled={modalType === 'view'}
                          placeholder="Ürün açıklamasını girin"
                        />
                      </div>
                      
                      {/* Özellikler */}
                      <div className="col-span-1">
                        <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Özellikler
                        </label>
                        {modalType === 'view' ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.features && formData.features.length > 0 ? (
                              formData.features.map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                  {feature}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">Özellik eklenmemiş</span>
                            )}
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                name="featureInput"
                                value={featureInput || ''}
                                onChange={e => setFeatureInput(e.target.value)}
                                placeholder="Bir özellik girin (örn: 'Mobil Uyumlu')"
                                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-400 text-sm"
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (featureInput && featureInput.trim() !== '') {
                                      const arr = Array.isArray(formData.features) ? formData.features : (typeof formData.features === 'string' && formData.features.trim() !== '' ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : []);
                                      if (!arr.includes(featureInput.trim())) {
                                        setFormData(prev => ({
                                          ...prev,
                                          features: [...arr, featureInput.trim()]
                                        }));
                                      }
                                      setFeatureInput('');
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                                onClick={() => {
                                  if (featureInput && featureInput.trim() !== '') {
                                    const arr = Array.isArray(formData.features) ? formData.features : (typeof formData.features === 'string' && formData.features.trim() !== '' ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : []);
                                    if (!arr.includes(featureInput.trim())) {
                                      setFormData(prev => ({
                                        ...prev,
                                        features: [...arr, featureInput.trim()]
                                      }));
                                    }
                                    setFeatureInput('');
                                  }
                                }}
                              >Ekle</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                let featuresArr = [];
                                if (Array.isArray(formData.features)) {
                                  featuresArr = formData.features;
                                } else if (typeof formData.features === 'string' && formData.features.trim() !== '') {
                                  featuresArr = formData.features.split(',').map(f => f.trim()).filter(Boolean);
                                }
                                return featuresArr.length > 0 && featuresArr.map((feature, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    {feature}
                                    <button 
                                      type="button" 
                                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600 focus:outline-none"
                                      onClick={() => {
                                        const newFeatures = [...featuresArr];
                                        newFeatures.splice(index, 1);
                                        setFormData(prev => ({
                                          ...prev,
                                          features: newFeatures
                                        }));
                                      }}
                                    >
                                      <FaTimes size={10} />
                                    </button>
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {modalType === 'view' ? (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowModal(false)}
                    >
                      Kapat
                    </button>
                  ) : modalType === 'delete' ? (
                    <>
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaTrash className="mr-2" />} Sil
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowModal(false)}
                      >
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : modalType === 'add' ? <FaPlus className="mr-2" /> : <FaSave className="mr-2" />}
                        {modalType === 'add' ? 'Ekle' : 'Kaydet'}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowModal(false)}
                      >
                        İptal
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
