import React from 'react';

export default function ProductsLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col items-center justify-center gap-3 text-stone-500">
      <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 animate-spin rounded-full" />
      <p className="text-xs font-medium text-stone-600">
        Loading product catalog...
      </p>
    </div>
  );
}
