"use client";

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SalesChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Demo data for the chart
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz'];
  const salesData = [4800, 5200, 4900, 6500, 7200, 6800, 8200];
  const ordersData = [380, 420, 390, 510, 570, 540, 650];

  useEffect(() => {
    // Clean up previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Check if canvas ref exists
    if (!chartRef.current) return;

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    
    // Create gradient for sales data
    const salesGradient = ctx.createLinearGradient(0, 0, 0, 400);
    salesGradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    salesGradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
    
    // Create gradient for orders data
    const ordersGradient = ctx.createLinearGradient(0, 0, 0, 400);
    ordersGradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
    ordersGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    // Chart configuration
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Satış (₺)',
            data: salesData,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: salesGradient,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgb(79, 70, 229)',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: 'rgb(79, 70, 229)',
            pointHoverBorderWidth: 3,
            pointHoverRadius: 6,
            pointRadius: 4,
          },
          {
            label: 'Sipariş Sayısı',
            data: ordersData,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: ordersGradient,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: 'rgb(34, 197, 94)',
            pointHoverBorderWidth: 3,
            pointHoverRadius: 6,
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              boxHeight: 6,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: {
              size: 13
            },
            bodyFont: {
              size: 12
            },
            padding: 10,
            cornerRadius: 4,
            displayColors: true,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (context.datasetIndex === 0) {
                    label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed.y);
                  } else {
                    label += context.parsed.y;
                  }
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            },
            ticks: {
              font: {
                size: 11
              },
              callback: function(value) {
                return value.toLocaleString('tr-TR');
              }
            },
            beginAtZero: true
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SalesChart;
