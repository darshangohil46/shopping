import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex-1 flex flex-col items-center justify-center p-6 gap-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-3 border-orange-100 border-t-orange-600 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-orange-50 border border-orange-200" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-sm font-semibold text-stone-900">
          Loading Online Cart...
        </span>
        <span className="text-xs text-stone-500">
          Please wait while we prepare your page content.
        </span>
      </div>
    </div>
  );
}
