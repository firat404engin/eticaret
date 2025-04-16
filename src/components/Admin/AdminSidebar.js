"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaBox, 
  FaUsers, 
  FaShoppingCart, 
  FaEnvelope, 
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <FaHome size={20} />, text: 'Dashboard' },
    { path: '/admin/products', icon: <FaBox size={20} />, text: 'Ürünler' },
    { path: '/admin/users', icon: <FaUsers size={20} />, text: 'Kullanıcılar' },
    { path: '/admin/orders', icon: <FaShoppingCart size={20} />, text: 'Siparişler' },
    { path: '/admin/messages', icon: <FaEnvelope size={20} />, text: 'Mesajlar' },
    { path: '/admin/analytics', icon: <FaChartLine size={20} />, text: 'Analitik' },
    { path: '/admin/settings', icon: <FaCog size={20} />, text: 'Ayarlar' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 z-40 w-60 flex flex-col bg-[#181b24] dark:bg-[#232a36] shadow-xl transition-all duration-300
          top-16 h-[calc(100vh-64px)]
          ${isCollapsed ? 'w-0 -translate-x-full' : 'w-60 translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex flex-col gap-2 items-start h-auto px-6 pt-4 pb-2 border-b border-[#232a36]">
          <Link href="/admin" className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-2xl">A</div>
            <span className="text-white text-lg font-bold tracking-tight">Admin Panel</span>
          </Link>
          {/* Aktif sayfa başlığı/badge */}
          <SidebarPageTitle />
        </div>
        {/* Menu */}
        <nav className="flex-1 py-6 px-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-all
                    ${pathname === item.path
                      ? 'bg-indigo-600 text-white shadow-lg scale-[1.03]'
                      : 'text-gray-300 hover:bg-[#232a36] hover:text-white'}
                  `}
                  style={{ position: 'relative' }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                  {pathname === item.path && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-xl bg-yellow-400 animate-pulse"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t border-[#232a36]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-2 p-3 text-red-400 hover:bg-red-600/10 hover:text-red-200 rounded-lg transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
        <style jsx>{`
          aside::-webkit-scrollbar { width: 7px; background: transparent; }
          aside::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 8px; }
        `}</style>
      </aside>
    </>
  );
};

// Aktif sayfa başlığı/badge gösteren component

function SidebarPageTitle() {
  const pathname = usePathname();
  let title = '';
  let badge = '';
  switch (pathname) {
    case '/admin':
      title = 'Dashboard'; badge = 'Genel Bakış'; break;
    case '/admin/products':
      title = 'Ürünler'; badge = 'Envanter'; break;
    case '/admin/orders':
      title = 'Siparişler'; badge = 'Takip'; break;
    case '/admin/messages':
      title = 'Mesajlar'; badge = 'İletişim'; break;
    case '/admin/users':
      title = 'Kullanıcılar'; badge = 'Yönetim'; break;
    case '/admin/analytics':
      title = 'Analitik'; badge = 'Rapor'; break;
    case '/admin/settings':
      title = 'Ayarlar'; badge = 'Sistem'; break;
    default:
      title = '';
  }
  if (!title) return null;
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider bg-[#232a36] px-2 py-1 rounded-md">
        {title}
      </span>
      {badge && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold animate-pulse">{badge}</span>}
    </div>
  );
}

export default AdminSidebar;
