"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { authService } from "../../services/auth.service";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Initialize based on current route to prevent flashing
  const isProtectedPath = pathname === "/";
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(isProtectedPath);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        if (isMounted) setIsAuthenticated(false);
        return;
      }

      try {
        await authService.getProfile();
        if (isMounted) setIsAuthenticated(true);
      } catch {
        if (isMounted) setIsAuthenticated(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-black hover:opacity-80 transition-opacity"
        >
          <ShoppingBag className="w-4 h-4 text-black" />
          <span>Online Shopping Cart</span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/products"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black hover:bg-neutral-100 rounded-sm transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white hover:bg-neutral-800 rounded-sm transition-colors"
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
