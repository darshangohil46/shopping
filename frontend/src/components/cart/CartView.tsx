"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { cartService } from "../../services/cart.service";
import { CartResponse, CheckoutResponse } from "../../types/cart.types";
import { useToast } from "../../hooks/useToast";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { formatDateTime } from "../../utils/general";
import { OrderItemsTable } from "../common/OrderItemsTable";

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
      const msg = err instanceof Error ? err.message : "Failed to fetch cart";
      toast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const init = () => {
      fetchCart();
    };
    init();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setIsUpdatingId(itemId);
    try {
      const updated = await cartService.updateQuantity(itemId, newQuantity);
      setCart(updated);
      if (newQuantity <= 0) {
        toast("Item removed from cart", "info");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update quantity";
      toast(msg, "error");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdatingId(itemId);
    try {
      const updated = await cartService.removeItem(itemId);
      setCart(updated);
      toast("Item removed from cart", "info");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      toast(msg, "error");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast(
        "Your cart is empty. Please add items before checking out.",
        "error",
      );
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await cartService.checkout();
      setLastOrder(result);
      setCart({ items: [], grandTotal: 0, totalItems: 0 });
      toast(result.message, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast(msg, "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-16 flex flex-col items-center justify-center gap-3 text-stone-500">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent animate-spin rounded-full" />
        <p className="text-xs">Loading shopping cart...</p>
      </div>
    );
  }

  // If order was just placed, show full receipt confirmation inline (no modals)
  if (lastOrder) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
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

        <Card className="p-0 overflow-hidden border-stone-200/90 shadow-xs">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 bg-stone-50/70">
            <div>
              <p className="text-xs text-stone-500 font-mono">
                Order ID: {lastOrder.order.id}
              </p>
              <p className="text-xs text-stone-500">
                Placed on: {formatDateTime(lastOrder.order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-700">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                {lastOrder.emailSent ? "Bill Sent to Email" : "Order Recorded"}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-stone-900">
              Itemized Order Summary
            </h2>
            <div className="border border-stone-200 rounded-sm overflow-hidden">
              <OrderItemsTable
                items={lastOrder.items}
                showFooter={true}
                grandTotal={Number(lastOrder.order.grandTotal)}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-stone-50/50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              A copy of this order summary has been transmitted to your account
              email address.
            </p>
            <Link href="/products">
              <Button
                variant="primary"
                className="text-xs flex items-center gap-1.5"
              >
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Cart & Billing
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Review your selected items, adjust quantities, and submit your
            order.
          </p>
        </div>

        <Link href="/products">
          <Button
            variant="outline"
            className="text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Button>
        </Link>
      </div>

      {/* Cart Content */}
      {items.length === 0 ? (
        <Card className="text-center py-16 px-4 flex flex-col items-center justify-center gap-4 border-stone-200/90 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-stone-900">
              Your shopping cart is empty
            </h2>
            <p className="text-xs text-stone-500 max-w-md">
              You haven&apos;t added any products to your cart yet. Browse
              through our product catalog to get started.
            </p>
          </div>
          <Link href="/products" className="mt-2">
            <Button
              variant="primary"
              className="text-xs flex items-center gap-1.5"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Items Table (2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="overflow-hidden border-stone-200/90 shadow-xs p-0">
              <CardHeader className="py-3 px-4 mb-0 border-b border-stone-200 bg-stone-50/80 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Cart Items ({items.length})
                </CardTitle>
                <span className="text-xs text-stone-500 font-mono">
                  {cart?.totalItems} total quantity
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {/* Reusable OrderItemsTable for interactive cart */}
                <OrderItemsTable
                  items={items}
                  editable={true}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  isUpdatingId={isUpdatingId}
                  showFooter={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Billing & Checkout Card (1 col on lg, sticky on desktop) */}
          <div className="lg:sticky lg:top-20 flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-4 border-stone-200/90 shadow-xs">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Billing Summary
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Calculated price details for this order.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal ({cart?.totalItems} items)</span>
                  <span className="font-mono text-stone-900 font-medium">
                    Rs. {Number(grandTotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Taxes (Included)</span>
                  <span className="font-mono text-stone-500">Rs. 0</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-sm font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-orange-600 font-bold">
                    Rs. {Number(grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
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

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified & instant email confirmation</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
