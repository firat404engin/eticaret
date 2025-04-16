"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaTrash, 
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaInbox,
  FaCheckDouble
} from 'react-icons/fa';
import { useAuth } from '../../../src/contexts/AuthContext';
import supabase from '../../../src/utils/supabase';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'read', 'unread'
  const [mobileView, setMobileView] = useState(false); // Mobil görünüm için
  
  // Mesajları yükle
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Mesajlar alınamadı');
      }
      
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // İlk yükleme
  useEffect(() => {
    fetchMessages();
  }, []);
  
  // Gerçek zamanlı abonelik - Supabase realtime
  useEffect(() => {
    const channel = supabase
      .channel('realtime:contact_messages')
      .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        }, (payload) => {
          console.log('Yeni mesaj:', payload.new);
          setMessages(prev => [...prev, payload.new]);
        })
      .subscribe();

    return () => channel.unsubscribe();
  }, []);
  
  // Mesajın okundu durumunu güncelle
  const handleMarkAsRead = async (messageId, currentStatus) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: messageId,
          is_read: !currentStatus // Mevcut durumun tersine çevir
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Güncelleme başarısız oldu');
      }
      
      // Mesajları güncelle
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, is_read: !msg.is_read } : msg
        )
      );
      
      // Aktif mesaj seçiliyse onu da güncelle
      if (activeMessage && activeMessage.id === messageId) {
        setActiveMessage({ ...activeMessage, is_read: !activeMessage.is_read });
      }
    } catch (error) {
      console.error('Mesaj güncellenirken hata:', error);
      alert(`Hata: ${error.message}`);
    }
  };
  
  // Mesaj arama
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'read') return matchesSearch && message.is_read;
    if (filterStatus === 'unread') return matchesSearch && !message.is_read;
    return matchesSearch;
  });
  
  // Mesaj detayını görüntüle
  const handleViewMessage = (message) => {
    setActiveMessage(message);
    
    // Mesaj okunmamışsa okundu olarak işaretle
    if (message && !message.is_read) {
      handleMarkAsRead(message.id, false);
    }
  };
  
  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Yeni mesaj sayısı
  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FaInbox className="mr-2 text-indigo-500" /> İletişim Mesajları
            </h1>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-gray-500 dark:text-gray-400">
                Toplam {messages.length} mesaj
              </span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {unreadCount} okunmamış
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" size={14} />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Mesajlarda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 text-xs font-medium rounded-l-lg border ${filterStatus === 'all' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-500 dark:text-indigo-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilterStatus('unread')}
                className={`px-3 py-2 text-xs font-medium border-t border-b ${filterStatus === 'unread' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-500 dark:text-indigo-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Okunmamış
              </button>
              <button
                onClick={() => setFilterStatus('read')}
                className={`px-3 py-2 text-xs font-medium rounded-r-lg border ${filterStatus === 'read' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-500 dark:text-indigo-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Okunmuş
              </button>
            </div>
            
            <button
              onClick={() => fetchMessages()}
              className="p-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
              title="Yenile"
            >
              {loading ? <FaSpinner className="animate-spin" size={16} /> : <FaSyncAlt size={16} />}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center shadow-sm">
          <FaExclamationTriangle className="mr-2" size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Mobil görünüm için seçim butonları */}
      <div className="md:hidden mb-4 flex rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setMobileView(false)}
          className={`flex-1 p-3 ${!mobileView ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
        >
          <div className="flex justify-center items-center">
            <FaInbox className="mr-2" />
            <span>Mesaj Listesi</span>
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-medium">{unreadCount}</span>
            )}
          </div>
        </button>
        <button
          onClick={() => setMobileView(true)}
          className={`flex-1 p-3 ${mobileView ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
          disabled={!activeMessage}
        >
          <div className="flex justify-center items-center">
            <FaEnvelope className="mr-2" />
            <span>Mesaj Detayı</span>
          </div>
        </button>
      </div>
      
      {/* Ana İçerik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Mesaj Listesi - Mobilde sadece seçiliyse görünür */}
        <div className={`md:block ${mobileView ? 'hidden' : 'block'} bg-white dark:bg-gray-800 rounded-lg shadow-sm md:col-span-1 overflow-hidden h-full flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
            <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
              <span className="mr-2">{filteredMessages.length} mesaj</span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {unreadCount} yeni
                </span>
              )}
            </h2>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <FaSpinner className="animate-spin text-indigo-600 mr-2" />
                <span>Mesajlar yükleniyor...</span>
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${activeMessage?.id === message.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 dark:border-indigo-400' : !message.is_read ? 'border-l-4 border-blue-500 dark:border-blue-400' : ''}`}
                    onClick={() => {
                      handleViewMessage(message);
                      if (window.innerWidth < 768) {
                        setMobileView(true); // Mobilde mesaja tıklandığında detay görünümüne geç
                      }
                    }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-medium truncate flex-1 ${!message.is_read ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                          {message.name || 'İsimsiz'}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                          {formatDate(message.created_at).split(' ')[0]}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="truncate">{message.email}</span>
                        {!message.is_read && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                            Yeni
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <FaInbox className="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
                {searchTerm ? 'Aramanızla eşleşen mesaj bulunamadı.' : 'Henüz mesaj bulunmuyor.'}
              </div>
            )}
          </div>
        </div>
        
        {/* Mesaj Detayı - Mobilde sadece seçiliyse görünür */}
        <div className={`md:block ${!mobileView ? 'hidden' : 'block'} bg-white dark:bg-gray-800 rounded-lg shadow-sm md:col-span-2 h-full flex flex-col overflow-hidden`}>
          {activeMessage ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center">
                  {/* Mobil geri butonu */}
                  <button 
                    onClick={() => setMobileView(false)}
                    className="md:hidden mr-2 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  
                  <h2 className="font-medium text-gray-800 dark:text-white truncate">
                    {activeMessage.name || 'İsimsiz'}
                  </h2>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMarkAsRead(activeMessage.id, activeMessage.is_read)}
                    className={`p-2 rounded-lg ${
                      activeMessage.is_read 
                        ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' 
                        : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/30'
                    }`}
                    title={activeMessage.is_read ? "Okunmadı İşaretle" : "Okundu İşaretle"}
                  >
                    {activeMessage.is_read ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex-1 min-w-[200px]">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gönderen</h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activeMessage.name || 'İsimsiz'}</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex-1 min-w-[200px]">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">E-posta</h3>
                      <p className="text-sm text-gray-900 dark:text-white break-all">{activeMessage.email}</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex-1 min-w-[200px]">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tarih</h3>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(activeMessage.created_at)}</p>
                    </div>
                    
                    {activeMessage.phone && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex-1 min-w-[200px]">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Telefon</h3>
                        <p className="text-sm text-gray-900 dark:text-white">{activeMessage.phone}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-2 h-2 rounded-full mr-2 ${activeMessage.is_read ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white">Mesaj İçeriği</h3>
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        {activeMessage.is_read ? <FaCheckDouble className="mr-1" /> : <FaEnvelope className="mr-1" />}
                        {activeMessage.is_read ? 'Okundu' : 'Okunmadı'}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words">{activeMessage.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
              <FaEnvelope className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
              <p>Detayını görmek için bir mesaj seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
