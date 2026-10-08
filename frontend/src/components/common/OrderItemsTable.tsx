'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { cn } from '../../utils/general';

export interface SharedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface OrderItemsTableProps {
  items: SharedItem[];
  editable?: boolean;
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  isUpdatingId?: string | null;
  showFooter?: boolean;
  grandTotal?: number;
  className?: string;
}

export function OrderItemsTable({
  items,
  editable = false,
  onUpdateQuantity,
  onRemoveItem,
  isUpdatingId,
  showFooter = false,
  grandTotal,
  className,
}: OrderItemsTableProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const calculatedGrandTotal =
    grandTotal !== undefined
      ? grandTotal
      : items.reduce((sum, item) => sum + Number(item.lineTotal), 0);

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-stone-500">
        No items found.
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      {/* Desktop & Tablet Table View (hidden on very small screens, visible md and up) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-stone-200 bg-stone-50/80 text-stone-700 font-medium">
            <tr>
              <th className="py-2.5 px-4 font-semibold text-stone-800">Product</th>
              <th className="py-2.5 px-4 font-semibold text-stone-800 text-center">
                Qty
              </th>
              <th className="py-2.5 px-4 font-semibold text-stone-800 text-right">
                Unit Price
              </th>
              <th className="py-2.5 px-4 font-semibold text-stone-800 text-right">
                Line Total
              </th>
              {editable && (
                <th className="py-2.5 px-4 font-semibold text-stone-800 text-right">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {items.map((item) => {
              const isBusy = isUpdatingId === item.id;

              return (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Product Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-stone-50 rounded-sm border border-stone-200 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ShoppingCart className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 block line-clamp-1">
                          {item.name}
                        </span>
                        {editable && (
                          <span className="text-[11px] text-stone-500 font-mono">
                            Rs. {Number(item.price).toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 text-center">
                    {editable ? (
                      <div className="inline-flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity?.(item.id, item.quantity - 1)
                          }
                          disabled={isBusy}
                          className="w-6 h-6 flex items-center justify-center rounded-sm border border-stone-200 hover:border-orange-400 hover:bg-orange-50 text-stone-700 disabled:opacity-40 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity?.(item.id, item.quantity + 1)
                          }
                          disabled={isBusy}
                          className="w-6 h-6 flex items-center justify-center rounded-sm border border-stone-200 hover:border-orange-400 hover:bg-orange-50 text-stone-700 disabled:opacity-40 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-mono text-stone-800 font-semibold">
                        {item.quantity}
                      </span>
                    )}
                  </td>

                  {/* Unit Price */}
                  <td className="py-3 px-4 text-right font-mono text-stone-600">
                    Rs. {Number(item.price).toLocaleString()}
                  </td>

                  {/* Line Total */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                    Rs. {Number(item.lineTotal).toLocaleString()}
                  </td>

                  {/* Action (Remove) */}
                  {editable && (
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveItem?.(item.id)}
                        disabled={isBusy}
                        className="text-stone-400 hover:text-rose-600 p-1.5 rounded-sm transition-colors cursor-pointer disabled:opacity-40"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Footer Total */}
            {showFooter && (
              <tr className="bg-stone-50/80 font-bold border-t border-stone-200">
                <td className="py-3 px-4 text-stone-900 font-semibold">
                  Total ({totalQuantity} items)
                </td>
                <td className="py-3 px-4 text-center font-mono text-stone-700 font-medium">
                  {totalQuantity}
                </td>
                <td className="py-3 px-4 text-right text-stone-400 font-normal">
                  -
                </td>
                <td
                  colSpan={editable ? 2 : 1}
                  className="py-3 px-4 text-right text-orange-600 font-mono text-sm"
                >
                  Rs. {Number(calculatedGrandTotal).toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (Optimized for small screens) */}
      <div className="sm:hidden divide-y divide-stone-100 bg-white">
        {items.map((item) => {
          const isBusy = isUpdatingId === item.id;

          return (
            <div key={item.id} className="p-3.5 flex flex-col gap-2.5">
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-11 h-11 bg-stone-50 rounded-sm border border-stone-200 overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Rs. {Number(item.price).toLocaleString()} each
                    </p>
                  </div>
                </div>

                {editable && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem?.(item.id)}
                    disabled={isBusy}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-sm"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-50 text-xs">
                {editable ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Qty:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity?.(item.id, item.quantity - 1)
                      }
                      disabled={isBusy}
                      className="w-6 h-6 flex items-center justify-center rounded-sm border border-stone-200 hover:bg-orange-50 text-stone-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-semibold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity?.(item.id, item.quantity + 1)
                      }
                      disabled={isBusy}
                      className="w-6 h-6 flex items-center justify-center rounded-sm border border-stone-200 hover:bg-orange-50 text-stone-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-stone-600 font-mono">
                    Qty: <strong className="text-stone-900">{item.quantity}</strong>
                  </span>
                )}

                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Total</span>
                  <span className="font-mono font-bold text-stone-900 text-xs">
                    Rs. {Number(item.lineTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {showFooter && (
          <div className="p-3 bg-stone-50/80 flex items-center justify-between border-t border-stone-200">
            <span className="text-xs font-semibold text-stone-900">
              Grand Total ({totalQuantity} items)
            </span>
            <span className="text-sm font-bold font-mono text-orange-600">
              Rs. {Number(calculatedGrandTotal).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
