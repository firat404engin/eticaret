"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowDown, FaRocket, FaCode, FaLaptopCode, FaMobileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Hero = () => {
  const canvasRef = useRef(null);

  // Parti̇küller efekti için canvas animasyonu
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];
    const particleCount = 100;
    
    // Ekran boyutu değişince canvas'ı güncelle
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Partikül sınıfı
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 100) + 100}, 255, ${Math.random() * 0.4 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Partikülleri oluştur
    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Partikülleri çiz ve güncelle
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Partiküller arası çizgileri çiz
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(150, 150, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-gray-900 transition-colors">
      {/* Arkaplan canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-indigo-900/50 z-0"></div>
      
      {/* İçerik */}
      <div className="container mx-auto px-4 z-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center text-gray-900 dark:text-white leading-tight">
            Yapay Zeka <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Destekli</span> Yazılım Çözümleri
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-200 mb-10 text-center max-w-2xl mx-auto">
            İşinizi geleceğe taşıyın. C# ve web teknolojileri ile dijital dönüşümünüzü hızlandırın.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/products" 
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r from-blue-300 to-indigo-300 hover:from-blue-700 dark:hover:from-blue-400 hover:to-indigo-700 dark:hover:to-indigo-400 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-blue-800/30 dark:shadow-blue-800/10"
              >
                <FaRocket className="mr-2" /> Çözümleri Keşfet
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/contact" 
                className="flex items-center justify-center bg-transparent border-2 border-gray-900 dark:border-white/70 hover:bg-gray-100/10 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-lg transition duration-300"
              >
                İletişime Geç
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Hizmet kartları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/15 transition-all shadow-lg">
            <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCode className="text-white text-2xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Web Tasarımı</h3>
            <p className="text-blue-100">Modern ve responsive web siteleri, e-ticaret çözümleri</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/15 transition-all shadow-lg">
            <div className="bg-indigo-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLaptopCode className="text-white text-2xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Masaüstü Yazılımlar</h3>
            <p className="text-blue-100">C# ile özelleştirilmiş masaüstü otomasyonları</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/15 transition-all shadow-lg">
            <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMobileAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Mobil Uygulamalar</h3>
            <p className="text-blue-100">iOS ve Android için modern mobil uygulamalar</p>
          </div>
        </motion.div>
      </div>
      
      {/* Aşağı kaydırma ikonu */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
      >
        <a href="#about" className="text-white/70 hover:text-white transition-colors">
          <FaArrowDown className="text-2xl" />
        </a>
      </motion.div>
    </div>
  );
};

export default Hero; 