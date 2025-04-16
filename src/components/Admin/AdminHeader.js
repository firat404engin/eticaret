"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaSearch, 
  FaMoon, 
  FaSun, 
  FaUser 
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../../src/utils/supabase';

const AdminHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();

  // Canlı bildirim abonesi
  useEffect(() => {
    console.log('[DEBUG] Supabase canlı bildirim bağlantısı başlatıldı');
    let mounted = true;
    const orderChannel = supabase.channel('orders-header-bell')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        if (!mounted) return;
        console.log('[DEBUG] Yeni sipariş bildirimi:', payload);
        setNotifications(prev => [
          { id: `order-${payload.new.id}`, message: 'Yeni sipariş oluşturuldu!', read: false, ts: Date.now() },
          ...prev,
        ]);
      })
      .subscribe();
    const msgChannel = supabase.channel('messages-header-bell')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, payload => {
        if (!mounted) return;
        console.log('[DEBUG] Yeni mesaj bildirimi:', payload);
        setNotifications(prev => [
          { id: `msg-${payload.new.id}`, message: 'Yeni mesaj alındı!', read: false, ts: Date.now() },
          ...prev,
        ]);
      })
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(msgChannel);
    };
  }, []);

  // Menü açılınca okundu işaretle
  useEffect(() => {
    if (showNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [showNotifications]);

  // Click dışında menüleri kapatmak için event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu) {
        if (!event.target.closest('.user-menu')) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow z-30">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Right Side - User Profile & Notifications */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Notifications */}
          <div className="relative notification-menu">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
              aria-label="Notifications"
            >
              <FaBell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span
                  className={`notification-badge ${!showNotifications && 'animate-bounce-badge'}`}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    minWidth: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ff3b3b',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 12,
                    borderRadius: 10,
                    boxShadow: '0 1px 6px rgba(255,60,60,0.15)',
                    zIndex: 2,
                    padding: '0 5px',
                    lineHeight: 1,
                    transition: 'transform 0.15s',
                  }}
                >
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
              <style>{`
                @keyframes bounce-badge {
                  0%   { transform: scale(1) translateY(0); }
                  20%  { transform: scale(1.15) translateY(-3px); }
                  40%  { transform: scale(0.98) translateY(1px); }
                  60%  { transform: scale(1.08) translateY(-2px); }
                  80%  { transform: scale(1.03) translateY(0); }
                  100% { transform: scale(1) translateY(0); }
                }
                .animate-bounce-badge {
                  animation: bounce-badge 0.7s cubic-bezier(.36,1.5,.6,1) 1;
                }
                .notification-badge {
                  user-select: none;
                  pointer-events: none;
                }
              `}</style>
            </button>
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                <div className="px-4 py-2 border-b dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Bildirimler</h3>
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Tümünü okundu işaretle
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          !notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notification.ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      Bildirim bulunmuyor
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>

          

          {/* User Menu */}
          <div className="relative user-menu">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
              }}
              className="flex items-center focus:outline-none"
              aria-label="User Menu"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <FaUser className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                {user?.name || 'Admin User'}
              </span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profilim
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Ayarlar
                </a>
                <div className="border-t dark:border-gray-700"></div>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
