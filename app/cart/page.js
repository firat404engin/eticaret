'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Client component'i dynamic import ile yükleyelim (CartProvider ile çalışması için)
const CartWithProvider = dynamic(() => import('../../app/components/Cart'), {
  ssr: false,
});

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CartWithProvider />
    </main>
  );
} 