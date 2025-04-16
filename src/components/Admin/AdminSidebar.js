"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaShoppingBag, 
  FaBox, 
  FaComments, 
  FaChartLine, 
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaShoppingCart,
  FaEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaChartBar
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin/dashboard' },
    { name: 'Ürünler', icon: <FaBox />, path: '/admin/products' },
    { name: 'Siparişler', icon: <FaShoppingCart />, path: '/admin/orders' },
    { name: 'Adminler', icon: <FaUsers />, path: '/admin/admins' },
    { name: 'İletişim Formları', icon: <FaEnvelope />, path: '/admin/contacts' },
    { name: 'İstatistikler', icon: <FaChartBar />, path: '/admin/stats' },
    { name: 'Profil', icon: <FaUserCircle />, path: '/admin/profile' }
  ];

  return (
    <div 
      className={`bg-gray-800 fixed h-full transition-all z-40 overflow-hidden ${
        collapsed ? 'w-16' : 'w-64'
      } lg:relative`}
    >
      <div className="h-full flex flex-col">
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between bg-gray-900 p-4 h-16">
          <Link href="/admin" className="text-white text-lg font-semibold truncate">
            {!collapsed && 'Admin Panel'}
          </Link>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label={collapsed ? 'Genişlet' : 'Daralt'}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    pathname === item.path ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-sm text-gray-300 hover:bg-gray-700"
              >
                <span className="mr-3"><FaSignOutAlt /></span>
                Çıkış Yap
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
