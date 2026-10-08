"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";
import { cartService } from "../../services/cart.service";
import { ordersService } from "../../services/orders.service";
import { User } from "../../types/auth.types";
import { OrderDetail } from "../../types/order.types";
import { useToast } from "../../hooks/useToast";
import { Card } from "../ui/Card";
import { DashboardBanner } from "./DashboardBanner";
import { AccountCard } from "./AccountCard";
import { OrdersList } from "./OrdersList";

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
          router.push("/login");
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

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      toast("Logged out successfully", "info");
      router.push("/login");
      router.refresh();
    } catch {
      toast("Error logging out", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg border-stone-200/90 shadow-xs">
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-500">
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent animate-spin rounded-full" />
          <p className="text-xs">Loading user details...</p>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Quick link banner */}
      <DashboardBanner hasCartItems={hasCartItems} />

      {/* Account Details Card */}
      <AccountCard
        user={user}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Itemized Order Details & Invoices */}
      <OrdersList orders={orders} isLoading={isLoadingOrders} />
    </div>
  );
}
