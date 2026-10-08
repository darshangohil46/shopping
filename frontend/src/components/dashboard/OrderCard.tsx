'use client';

import React from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { OrderDetail } from '../../types/order.types';
import { formatDateTime } from '../../utils/general';
import { Card } from '../ui/Card';
import { OrderItemsTable } from '../common/OrderItemsTable';

interface OrderCardProps {
  order: OrderDetail;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="overflow-hidden border-stone-200/90 shadow-xs p-0">
      {/* Order Header */}
      <div className="p-4 bg-stone-50/80 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-900">
              Order ID:
            </span>
            <span className="text-xs font-mono text-stone-700 select-all">
              {order.id}
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            Placed on {formatDateTime(order.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-700">
            {order.emailSent ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Bill Emailed</span>
              </>
            ) : (
              <>
                <Mail className="w-3 h-3 text-stone-500" />
                <span>Recorded</span>
              </>
            )}
          </span>
          <div className="text-right">
            <span className="text-[11px] text-stone-500 block">
              Total Amount
            </span>
            <span className="text-sm font-bold font-mono text-orange-600">
              Rs. {Number(order.grandTotal).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Shared OrderItemsTable */}
      <OrderItemsTable
        items={order.items}
        showFooter={true}
        grandTotal={Number(order.grandTotal)}
      />
    </Card>
  );
}
