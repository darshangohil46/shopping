import React from 'react';
import { Metadata } from 'next';
import { CartView } from '../../components/cart/CartView';

export const metadata: Metadata = {
  title: 'Shopping Cart & Billing - Online Cart',
  description: 'View your cart items, calculate billing totals, and submit your order.',
};

export default function CartPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-white text-black py-4">
      <CartView />
    </main>
  );
}
