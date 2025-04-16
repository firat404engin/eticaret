"use client";

import React from 'react';

const OverviewCard = ({ title, value, change, icon, color }) => {
  // Color mappings
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  };

  // Extract the change value to determine if it's positive, negative, or neutral
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.indigo}`}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
              {change && (
                <p className={`ml-2 text-sm font-medium ${
                  isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : isNegative 
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {change}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
        <div 
          className={`h-full ${
            color === 'indigo' ? 'bg-indigo-500' :
            color === 'green' ? 'bg-green-500' :
            color === 'blue' ? 'bg-blue-500' :
            color === 'purple' ? 'bg-purple-500' :
            color === 'red' ? 'bg-red-500' :
            color === 'yellow' ? 'bg-yellow-500' :
            'bg-indigo-500'
          }`} 
          style={{ width: '70%' }}
        />
      </div>
    </div>
  );
};

export default OverviewCard;
