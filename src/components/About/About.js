"use client";

import React from 'react';
import { FaLaptopCode, FaUsers, FaServer, FaCheck, FaRocket, FaLightbulb } from 'react-icons/fa';
import Image from 'next/image';

import { useState, useEffect } from 'react';

// Sayı animasyonu için CountUp bileşeni
function CountUp({ end, duration = 1200 }) {
  // end: '50+', '99%', '24/7' gibi olabilir, rakamı ve varsa sembolü ayır
  const match = String(end).match(/^(\d+)(\D*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(16, duration / (target || 1));
    let raf;
    function step() {
      start += Math.ceil(target / (duration / stepTime));
      if (start >= target) {
        setCount(target);
      } else {
        setCount(start);
        raf = requestAnimationFrame(step);
      }
    }
    step();
    return () => raf && cancelAnimationFrame(raf);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

const About = () => {
  const stats = [
    { number: '50+', label: 'Tamamlanan Proje', icon: <FaRocket /> },
    { number: '99%', label: 'Müşteri Memnuniyeti', icon: <FaUsers /> },
    { number: '500+', label: 'Teknik Destek', icon: <FaServer /> },
  ];
  
  const teamMembers = [
    { name: 'Ahmet Yılmaz', role: 'Yazılım Mühendisi', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Ayşe Demir', role: 'UI/UX Tasarımcı', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Mehmet Kaya', role: 'Proje Yöneticisi', image: 'https://randomuser.me/api/portraits/men/65.jpg' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero bölümü */}
      <div className="relative overflow-hidden bg-gray-900 text-white dark:bg-gray-900 dark:text-white">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Yazılım Çözümlerimiz</h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8">
              Modern teknolojiler ile geleceğin yazılımlarını bugün geliştiriyoruz
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                <FaRocket className="text-lg" /> Hizmetlerimiz
              </button>
              <button className="bg-white/10 border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400" /> İletişime Geçin
              </button>
            </div>
          </div>
        </div>
        {/* Animasyonlu dalga alt kenar */}
        <div className="absolute left-0 right-0 bottom-0 w-full overflow-hidden pointer-events-none">
          <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f9fafb" fillOpacity="1" d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
          </svg>
        </div>
      </div>
      
      {/* Misyon ve Vizyon */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50 blur"></div>
            <div className="relative bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg">
              <img 
                src="https://kariyerrehberi.btkakademi.gov.tr/img/gelisim_programlari_cover/yazilim_gelistirme_cover.jpg" 
                alt="Hakkımızda" 
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Misyonumuz ve Vizyonumuz</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Yenilikçi yazılım çözümleriyle müşterilerimizin iş süreçlerini dijitalleştiriyor, verimliliği artırıyor ve rekabet avantajı sağlıyoruz. Modern teknolojileri kullanarak, kullanıcı dostu ve ölçeklenebilir uygulamalar geliştiriyoruz.
            </p>
            <ul className="space-y-3">
              {[
                'Müşteri odaklı çözümler sunmak',
                'Yenilikçi teknolojileri takip etmek',
                'Sürdürülebilir yazılımlar geliştirmek',
                'Güvenlik ve performansı ön planda tutmak'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0 animate-bounce" />
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Takım Üyeleri */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Ekibimiz</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center w-64 hover:scale-105 hover:shadow-xl transition-all duration-300">
              <img src={member.image} alt={member.name} width={96} height={96} className="rounded-full shadow mb-4 w-24 h-24 object-cover" />
              <div className="text-lg font-semibold text-gray-800 dark:text-white">{member.name}</div>
              <div className="text-indigo-600 dark:text-indigo-400 font-medium">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* İstatistikler */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center border-2 border-transparent hover:border-white/40 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="text-4xl mb-2 flex justify-center animate-pulse">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2"><CountUp end={stat.number} /></div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Uzmanlık Alanları */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Uzmanlık Alanlarımız</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Web Uygulamaları', icon: <FaLaptopCode className="text-blue-500" />, description: 'Modern ve ölçeklenebilir web uygulamaları geliştiriyoruz.' },
            { title: 'Mobil Uygulamalar', icon: <FaRocket className="text-indigo-500" />, description: 'iOS ve Android platformları için yüksek performanslı uygulamalar.' },
            { title: 'Bulut Çözümleri', icon: <FaServer className="text-purple-500" />, description: 'AWS ve Azure ile ölçeklenebilir altyapı çözümleri.' },
            { title: 'UI/UX Tasarım', icon: <FaLightbulb className="text-yellow-500" />, description: 'Kullanıcı odaklı arayüz ve deneyim tasarımları.' },
            { title: 'API Entegrasyonları', icon: <FaUsers className="text-green-500" />, description: 'Üçüncü parti sistemlerle entegrasyon ve veri alışverişi.' },
            { title: 'DevOps Hizmetleri', icon: <FaServer className="text-red-500" />, description: 'CI/CD pipeline ve otomatik dağıtım çözümleri.' }
          ].map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 