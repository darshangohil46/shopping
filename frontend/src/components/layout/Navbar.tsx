"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  ShoppingCart,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { cartService } from "../../services/cart.service";
import { cn } from "../../utils/general";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Initialize based on current route to prevent flashing
  const isProtectedPath = pathname === "/";
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(isProtectedPath);
  const [hasCartItems, setHasCartItems] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndCart() {
      if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        if (isMounted) {
          setIsAuthenticated(false);
          setHasCartItems(false);
        }
        return;
      }

      try {
        await authService.getProfile();
        if (isMounted) setIsAuthenticated(true);

        const cart = await cartService.getCart();
        if (isMounted) {
          setHasCartItems(Boolean(cart && cart.items && cart.items.length > 0));
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
          setHasCartItems(false);
        }
      }
    }

    checkAuthAndCart();

    const handleCartUpdate = async () => {
      try {
        const cart = await cartService.getCart();
        if (isMounted) {
          setHasCartItems(Boolean(cart && cart.items && cart.items.length > 0));
        }
      } catch {
        if (isMounted) setHasCartItems(false);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setHasCartItems(false);
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-40 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
        >
          <div className="w-7 h-7 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span>Online Shopping Cart</span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {isAuthenticated ? (
            <>
              <Link
                href="/products"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/products"
                    ? "bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products</span>
              </Link>
              <Link
                href="/cart"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/cart"
                    ? "bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {hasCartItems && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <span>Cart</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-sm shadow-xs border border-indigo-600 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
