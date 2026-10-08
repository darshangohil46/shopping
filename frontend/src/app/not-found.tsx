import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md p-8 bg-white border border-stone-200/90 rounded-sm shadow-xs flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
          <FileQuestion className="w-7 h-7" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600">
            Error 404
          </span>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Page Not Found
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            The page you are looking for does not exist, has been removed, or is
            temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
          <Link href="/" className="w-full sm:w-1/2">
            <Button
              variant="primary"
              className="w-full text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-1/2">
            <Button
              variant="outline"
              className="w-full text-xs flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
