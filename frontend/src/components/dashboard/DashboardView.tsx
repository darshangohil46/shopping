'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Clock,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import { cartService } from '../../services/cart.service';
import { ordersService } from '../../services/orders.service';
import { User } from '../../types/auth.types';
import { OrderDetail } from '../../types/order.types';
import { formatDateTime } from '../../utils/general';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/Card';

export function DashboardView() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [hasCartItems, setHasCartItems] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await authService.getProfile();
        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      // Fetch Cart
      try {
        const cart = await cartService.getCart();
        if (isMounted) {
          setHasCartItems(Boolean(cart && cart.items && cart.items.length > 0));
        }
      } catch {
        if (isMounted) setHasCartItems(false);
      }

      // Fetch Orders
      try {
        const ordersData = await ordersService.getUserOrders();
        if (isMounted) {
          setOrders(ordersData.orders || []);
        }
      } catch {
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) {
          setIsLoadingOrders(false);
        }
      }
    }

    fetchData();

    const handleCartUpdate = async () => {
      try {
        const cart = await cartService.getCart();
        if (isMounted) {
          setHasCartItems(Boolean(cart && cart.items && cart.items.length > 0));
        }
      } catch {
        if (isMounted) setHasCartItems(false);
      }

      try {
        const ordersData = await ordersService.getUserOrders();
        if (isMounted) {
          setOrders(ordersData.orders || []);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      toast('Logged out successfully', 'info');
      router.push('/login');
      router.refresh();
    } catch {
      toast('Error logging out', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg border-slate-200/90 shadow-xs">
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
          <p className="text-xs">Loading user details...</p>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      {/* Quick link banner to Products Page & Cart */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-slate-900">Ready to Shop?</span>
          <span className="text-[11px] text-slate-500">
            Browse our catalog of products or view your active cart.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button variant="primary" className="text-xs flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="text-xs flex items-center gap-1.5">
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

      {/* User details card */}
      <Card className="border-slate-200/90 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <UserIcon className="w-4 h-4" />
              </div>
              <CardTitle>Account Details</CardTitle>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-sm">
              Account
            </span>
          </div>
          <CardDescription>
            Welcome back, <strong className="text-slate-900">{user.name}</strong>. Here are your account credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Full Name */}
            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-sm flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <UserIcon className="w-3 h-3 text-slate-400" />
                Full Name
              </span>
              <span className="font-semibold text-slate-900">{user.name}</span>
            </div>

            {/* Email */}
            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-sm flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <Mail className="w-3 h-3 text-slate-400" />
                Registered Email
              </span>
              <span className="font-mono text-slate-900">{user.email}</span>
            </div>

            {/* Created At */}
            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-sm flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <Calendar className="w-3 h-3 text-slate-400" />
                Joined On
              </span>
              <span className="text-slate-700 font-mono">
                {formatDateTime(user.createdAt)}
              </span>
            </div>

            {/* Updated At */}
            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-sm flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                Last Updated
              </span>
              <span className="text-slate-700 font-mono">
                {formatDateTime(user.updatedAt)}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-end">
            <Button
              variant="secondary"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Order Details & Invoices
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </span>
        </div>

        {isLoadingOrders ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
            <p className="text-xs">Loading order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12 px-4 flex flex-col items-center justify-center gap-3 border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-slate-900">
                No orders placed yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
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
            {orders.map((order) => {
              const totalItemsCount = order.items.reduce(
                (sum, i) => sum + i.quantity,
                0,
              );
              return (
                <Card key={order.id} className="overflow-hidden border-slate-200/90 shadow-xs">
                  {/* Order Card Header */}
                  <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          Order ID:
                        </span>
                        <span className="text-xs font-mono text-slate-700 select-all">
                          {order.id}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Placed on {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-700">
                        {order.emailSent ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Bill Emailed</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>Recorded</span>
                          </>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">
                          Total Amount
                        </span>
                        <span className="text-sm font-bold font-mono text-indigo-600">
                          Rs. {Number(order.grandTotal).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-white text-slate-700">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold text-slate-800">
                            Product Details
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-slate-800 text-center">
                            Quantity
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-slate-800 text-right">
                            Unit Price
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-slate-800 text-right">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Product */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {item.imageUrl ? (
                                  <div className="relative w-9 h-9 bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shrink-0">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      sizes="36px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-9 h-9 bg-slate-50 rounded-sm border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                    <ShoppingBag className="w-4 h-4" />
                                  </div>
                                )}
                                <span className="font-medium text-slate-900">
                                  {item.name}
                                </span>
                              </div>
                            </td>

                            {/* Quantity */}
                            <td className="py-3 px-4 text-center font-mono text-slate-800 font-semibold">
                              {item.quantity}
                            </td>

                            {/* Unit Price */}
                            <td className="py-3 px-4 text-right font-mono text-slate-600">
                              Rs. {Number(item.price).toLocaleString()}
                            </td>

                            {/* Line Total */}
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              Rs. {Number(item.lineTotal).toLocaleString()}
                            </td>
                          </tr>
                        ))}

                        {/* Order Summary Footer Row */}
                        <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                          <td className="py-3 px-4 text-slate-900 font-semibold">
                            Order Grand Total ({totalItemsCount} items)
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-700 font-medium">
                            {totalItemsCount}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 font-normal">
                            -
                          </td>
                          <td className="py-3 px-4 text-right text-indigo-600 font-mono text-sm">
                            Rs. {Number(order.grandTotal).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
