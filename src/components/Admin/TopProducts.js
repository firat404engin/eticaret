"use client";

import React from 'react';
import { FaCircle } from 'react-icons/fa';

const TopProducts = () => {
  // Mock data for top products
  const topProducts = [
    { id: 1, name: 'Akıllı Telefon X', category: 'Elektronik', sales: 542, percentage: 82 },
    { id: 2, name: 'Spor Ayakkabı Pro', category: 'Giyim', sales: 387, percentage: 67 },
    { id: 3, name: 'Kablosuz Kulaklık V3', category: 'Elektronik', sales: 298, percentage: 54 },
    { id: 4, name: 'Organik Çay Seti', category: 'Gıda', sales: 265, percentage: 48 },
    { id: 5, name: 'Premium Sweatshirt', category: 'Giyim', sales: 243, percentage: 43 },
  ];

  // Color assignments for the progress barsa
  const getColorClass = (index) => {
    const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-5">
      {topProducts.map((product, index) => (
        <div key={product.id} className="space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white flex items-center">
                <FaCircle className={`mr-2 text-xs ${getColorClass(index).replace('bg-', 'text-')}`} />
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-800 dark:text-white">{product.sales}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Satış</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`${getColorClass(index)} h-2 rounded-full`}
              style={{ width: `${product.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProducts;
