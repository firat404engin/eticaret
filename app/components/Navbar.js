"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaShoppingCart, 
  FaCode, 
  FaGithub, 
  FaBars, 
  FaTimes,
  FaUserCircle,
  FaLaptopCode
} from 'react-icons/fa';
import { useCart } from './CartProvider';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  // Kaydırma olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobil menüyü kapatma işlevi
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Sepetteki ürün sayısı
  const cartItemCount = getTotalItems();

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#181c20] backdrop-blur-lg shadow-xl py-2'
          : 'bg-white dark:bg-[#181c20] py-3 md:py-4'
      } dark:text-[#e3e8ee]`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0 z-10 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-600/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-600/30 group-hover:scale-105">
              <FaLaptopCode className="text-xl md:text-2xl animate-float" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 font-poppins animate-shine bg-[length:400%_100%] transition-all duration-300 group-hover:scale-105">
              AI Code Solutions
            </span>
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-6 dark:text-[#e3e8ee]">
            <Link 
              href="/" 
              className="relative px-3 py-2 text-gray-700 dark:text-gray-200 font-medium transition-colors text-sm lg:text-base hover:text-blue-600 dark:hover:text-blue-400 group"
            >
              Ana Sayfa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/products" 
              className="relative px-3 py-2 text-gray-700 dark:text-gray-200 font-medium transition-colors text-sm lg:text-base hover:text-blue-600 dark:hover:text-blue-400 group"
            >
              Çözümlerimiz
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="relative px-3 py-2 text-gray-700 dark:text-gray-200 font-medium transition-colors text-sm lg:text-base hover:text-blue-600 dark:hover:text-blue-400 group"
            >
              Hakkımızda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="relative px-3 py-2 text-gray-700 dark:text-gray-200 font-medium transition-colors text-sm lg:text-base hover:text-blue-600 dark:hover:text-blue-400 group"
            >
              İletişim
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Sağ Alan: Sepet ve Admin */}
          <div className="flex items-center space-x-2 md:space-x-4">            
            {/* Sepet Butonu */}
            <Link 
              href="/cart" 
              className="relative hover:scale-105 transition-transform duration-300"
              aria-label="Sepet"
            >
              <FaShoppingCart className="text-gray-700 dark:text-gray-300 text-base md:text-lg" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md shadow-blue-500/30">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* GitHub Butonu */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="GitHub Repo"
            >
              <FaGithub className="text-base md:text-lg" />
            </a>
            
            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden z-30 text-gray-700 dark:text-gray-300 focus:outline-none"
              aria-label="Mobil menüyü aç/kapat"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobil Menü Overlay */}
        <div 
          className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden z-20 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMobileMenu}
        ></div>
        
        {/* Mobil Menü */}
        <div 
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl z-20 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-3 border-b border-gray-200 dark:border-gray-800 flex items-center"
                onClick={closeMobileMenu}
              >
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">01</span>
                </span>
                Ana Sayfa
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-3 border-b border-gray-200 dark:border-gray-800 flex items-center"
                onClick={closeMobileMenu}
              >
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">02</span>
                </span>
                Çözümlerimiz
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-3 border-b border-gray-200 dark:border-gray-800 flex items-center"
                onClick={closeMobileMenu}
              >
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">03</span>
                </span>
                Hakkımızda
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-3 border-b border-gray-200 dark:border-gray-800 flex items-center"
                onClick={closeMobileMenu}
              >
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">04</span>
                </span>
                İletişim
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-3 border-b border-gray-200 dark:border-gray-800 flex items-center"
                onClick={closeMobileMenu}
              >
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">05</span>
                </span>
                Sepetim {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </nav>
            
            <div className="mt-auto">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-3"
              >
                <FaGithub className="text-lg" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 