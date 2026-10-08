'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { OrderDetail } from '../../types/order.types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { OrderCard } from './OrderCard';

interface OrdersListProps {
  orders: OrderDetail[];
  isLoading: boolean;
}

export function OrdersList({ orders, isLoading }: OrdersListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <Package className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-stone-900">
            Order Details & Invoices
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-mono font-medium">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-500">
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent animate-spin rounded-full" />
          <p className="text-xs">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center py-12 px-4 flex flex-col items-center justify-center gap-3 border-stone-200/90 shadow-xs">
          <div className="w-10 h-10 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-400">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-stone-900">
              No orders placed yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm">
              When you check out items from your cart, your complete order summary, quantities, unit prices, and bill will be stored and shown here.
            </p>
          </div>
          <Link href="/products" className="mt-1">
            <Button variant="primary" className="text-xs flex items-center gap-1.5">
              <span>Browse Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
