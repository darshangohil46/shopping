'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf9] text-stone-900 flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md p-8 bg-white border border-stone-200/90 rounded-sm shadow-sm flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
              Critical Error
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Application Error
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              A critical failure occurred. Please reload the application to
              continue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
