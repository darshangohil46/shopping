'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardBannerProps {
  hasCartItems: boolean;
}

export function DashboardBanner({ hasCartItems }: DashboardBannerProps) {
  return (
    <div className="p-4 bg-white border border-stone-200/90 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-stone-900">
          Ready to Shop?
        </span>
        <span className="text-[11px] text-stone-500">
          Browse our catalog of products or view your active cart.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/products">
          <Button
            variant="primary"
            className="text-xs flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products</span>
          </Button>
        </Link>
        <Link href="/cart">
          <Button
            variant="outline"
            className="text-xs flex items-center gap-1.5"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5" />
              {hasCartItems && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <span>Cart</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
