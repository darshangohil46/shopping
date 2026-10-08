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
  Menu,
  X,
  User,
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { cartService } from "../../services/cart.service";
import { cn } from "../../utils/general";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isProtectedPath = pathname === "/";
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(isProtectedPath);
  const [hasCartItems, setHasCartItems] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    const init = () => {
      setMobileMenuOpen(false);
    };
    init();
  }, [pathname]);

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
    <header className="w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-xs sticky top-0 z-40 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-stone-900 hover:text-orange-600 transition-colors"
        >
          <div className="w-7 h-7 rounded-sm bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span>Online Cart</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/"
                    ? "bg-orange-50 text-orange-600 font-semibold border border-orange-200"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                <User className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/products"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/products"
                    ? "bg-orange-50 text-orange-600 font-semibold border border-orange-200"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
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
                    ? "bg-orange-50 text-orange-600 font-semibold border border-orange-200"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-orange-600 text-white hover:bg-orange-700 rounded-sm shadow-xs border border-orange-600 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && (
            <Link
              href="/cart"
              className="relative p-2 text-stone-700 hover:text-orange-600 rounded-sm"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {hasCartItems && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-sm"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-stone-900" />
            ) : (
              <Menu className="w-5 h-5 text-stone-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-white px-4 py-3 flex flex-col gap-2 shadow-md">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/"
                    ? "bg-orange-50 text-orange-600 font-semibold border border-orange-200"
                    : "text-stone-700 hover:bg-stone-50",
                )}
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/products"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/products"
                    ? "bg-orange-50 text-orange-600 font-semibold border border-orange-200"
                    : "text-stone-700 hover:bg-stone-50",
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Product Catalog</span>
              </Link>
              <Link
                href="/cart"
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-sm transition-colors",
                  pathname === "/cart"
                    ? "bg-orange-50 text-orange-600 font-semibold border border-orange-200"
                    : "text-stone-700 hover:bg-stone-50",
                )}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Shopping Cart</span>
                </div>
                {hasCartItems && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-sm text-left transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-sm border border-stone-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-orange-600 text-white hover:bg-orange-700 rounded-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
