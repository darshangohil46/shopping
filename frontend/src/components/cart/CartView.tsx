'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { cartService } from '../../services/cart.service';
import { CartResponse, CheckoutResponse } from '../../types/cart.types';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatDateTime } from '../../utils/general';

export function CartView() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<CheckoutResponse | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch cart';
      toast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setIsUpdatingId(itemId);
    try {
      const updated = await cartService.updateQuantity(itemId, newQuantity);
      setCart(updated);
      if (newQuantity <= 0) {
        toast('Item removed from cart', 'info');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update quantity';
      toast(msg, 'error');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdatingId(itemId);
    try {
      const updated = await cartService.removeItem(itemId);
      setCart(updated);
      toast('Item removed from cart', 'info');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to remove item';
      toast(msg, 'error');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast('Your cart is empty. Please add items before checking out.', 'error');
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await cartService.checkout();
      setLastOrder(result);
      setCart({ items: [], grandTotal: 0, totalItems: 0 });
      toast(result.message, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed';
      toast(msg, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full" />
        <p className="text-xs">Loading shopping cart...</p>
      </div>
    );
  }

  // If order was just placed, show full receipt confirmation inline (no modals)
  if (lastOrder) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <h1 className="text-xl font-bold tracking-tight text-black">
              Order Confirmed
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setLastOrder(null)}
            className="text-xs"
          >
            Start New Order
          </Button>
        </div>

        <Card className="p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
            <div>
              <p className="text-xs text-neutral-500 font-mono">
                Order ID: {lastOrder.order.id}
              </p>
              <p className="text-xs text-neutral-500">
                Placed on: {formatDateTime(lastOrder.order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-black bg-neutral-50 text-black">
                <Mail className="w-3.5 h-3.5" />
                {lastOrder.emailSent ? 'Bill Sent to Email' : 'Order Recorded'}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-black mb-3">
              Itemized Order Summary
            </h2>
            <div className="overflow-x-auto border border-neutral-200 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold text-black">Product</th>
                    <th className="py-2.5 px-4 font-semibold text-black text-right">
                      Qty
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-black text-right">
                      Unit Price
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-black text-right">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {lastOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-medium text-black">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-700 font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-700 font-mono">
                        Rs. {Number(item.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-black font-mono">
                        Rs. {Number(item.lineTotal).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-neutral-50 font-bold">
                    <td colSpan={3} className="py-3 px-4 text-black text-right">
                      Grand Total
                    </td>
                    <td className="py-3 px-4 text-right text-black font-mono text-sm">
                      Rs. {Number(lastOrder.order.grandTotal).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-neutral-600">
              A copy of this order summary has been transmitted to your account email address.
            </p>
            <Link href="/products">
              <Button variant="primary" className="text-xs flex items-center gap-1.5">
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const items = cart?.items || [];
  const grandTotal = cart?.grandTotal || 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-black" />
            <h1 className="text-xl font-bold tracking-tight text-black">
              Cart & Billing
            </h1>
          </div>
          <p className="text-xs text-neutral-600">
            Review your selected items, adjust quantities, and submit your order.
          </p>
        </div>

        <Link href="/products">
          <Button variant="outline" className="text-xs flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Button>
        </Link>
      </div>

      {/* Cart Content */}
      {items.length === 0 ? (
        <Card className="text-center py-16 px-4 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-black">
              Your shopping cart is empty
            </h2>
            <p className="text-xs text-neutral-600 max-w-md">
              You haven&apos;t added any products to your cart yet. Browse through our product catalog to get started.
            </p>
          </div>
          <Link href="/products" className="mt-2">
            <Button variant="primary" className="text-xs flex items-center gap-1.5">
              <span>Browse Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Table (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-neutral-200 bg-neutral-50 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-black">
                  Cart Items ({items.length})
                </CardTitle>
                <span className="text-xs text-neutral-500 font-mono">
                  {cart?.totalItems} total quantity
                </span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-neutral-200 bg-white">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold text-black">
                          Product
                        </th>
                        <th className="py-2.5 px-4 font-semibold text-black text-center">
                          Qty
                        </th>
                        <th className="py-2.5 px-4 font-semibold text-black text-right">
                          Price
                        </th>
                        <th className="py-2.5 px-4 font-semibold text-black text-right">
                          Line Total
                        </th>
                        <th className="py-2.5 px-4 font-semibold text-black text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {items.map((item) => {
                        const isBusy = isUpdatingId === item.id;
                        return (
                          <tr key={item.id} className="hover:bg-neutral-50/50">
                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 bg-neutral-100 rounded-sm border border-neutral-200 overflow-hidden shrink-0">
                                  {item.imageUrl ? (
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                      <ShoppingCart className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-black line-clamp-1">
                                    {item.name}
                                  </h3>
                                  <p className="text-[11px] text-neutral-500 font-mono">
                                    Rs. {Number(item.price).toLocaleString()} each
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Quantity Controls */}
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={isBusy}
                                  className="w-6 h-6 flex items-center justify-center rounded-sm border border-neutral-300 hover:border-black text-black disabled:opacity-40 transition-colors cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-mono font-semibold text-black">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  disabled={isBusy}
                                  className="w-6 h-6 flex items-center justify-center rounded-sm border border-neutral-300 hover:border-black text-black disabled:opacity-40 transition-colors cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Unit Price */}
                            <td className="py-3 px-4 text-right font-mono text-neutral-800">
                              Rs. {Number(item.price).toLocaleString()}
                            </td>

                            {/* Line Total */}
                            <td className="py-3 px-4 text-right font-mono font-bold text-black">
                              Rs. {Number(item.lineTotal).toLocaleString()}
                            </td>

                            {/* Remove */}
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isBusy}
                                className="text-neutral-500 hover:text-black p-1 rounded-sm transition-colors cursor-pointer disabled:opacity-40"
                                title="Remove item"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing & Checkout Card (1 col) */}
          <div className="flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-4">
              <div className="pb-3 border-b border-neutral-200">
                <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                  Billing Summary
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Calculated price details for this order.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between text-neutral-700">
                  <span>Subtotal ({cart?.totalItems} items)</span>
                  <span className="font-mono">
                    Rs. {Number(grandTotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-700">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-black">Free</span>
                </div>
                <div className="flex items-center justify-between text-neutral-700">
                  <span>Taxes (Included)</span>
                  <span className="font-mono">Rs. 0</span>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-sm font-bold text-black">
                  <span>Grand Total</span>
                  <span className="font-mono text-base">
                    Rs. {Number(grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Submit Order & Send Bill</span>
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
                  Upon submitting, your order bill is instantly saved and emailed to your registered account address.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
