'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to console
    console.error('App Error Boundary caught an exception:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md p-8 bg-white border border-stone-200/90 rounded-sm shadow-xs flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
            Something went wrong
          </span>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            An Unexpected Error Occurred
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            {error?.message ||
              'A temporary error prevented this page from loading. Please try again or return to the home screen.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="w-full sm:w-1/2 text-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/" className="w-full sm:w-1/2">
            <Button
              variant="outline"
              className="w-full text-xs flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
