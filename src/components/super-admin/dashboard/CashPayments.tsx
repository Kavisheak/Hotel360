"use client";

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { paymentAPI } from '@/lib/api';

const CashPayments = ({ payments = [] }: { payments: any[] }) => {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());

  const toggle = async (id: string) => {
    // Optimistic UI update
    setConfirmed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      const res = await paymentAPI.confirmPayment(id);
      if (!res.ok) {
        throw new Error(res.data?.message || "Failed to confirm payment");
      }
    } catch (err: any) {
      alert(err.message || "Error verifying payment.");
      // Rollback UI update on failure
      setConfirmed(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const pending = payments.length - confirmed.size;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase leading-snug max-w-[130px]">
          Cash Payments to Confirm
        </p>
        {pending > 0 && (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-sm">
            {pending}
          </span>
        )}
      </div>

      {/* Payment rows */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
        {payments.length > 0 ? (
          payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-[#FAF8F2] border border-[#E0D8C3] px-4 py-3 rounded-sm"
            >
              <div>
                <p className="text-xs font-bold text-[#7C6A2E]">{p.bookingRef}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{p.eventType} · LKR {p.amount.toLocaleString()}</p>
              </div>
              <button
                onClick={() => toggle(p.id)}
                className={`w-7 h-7 border flex items-center justify-center rounded-sm transition-colors ${confirmed.has(p.id)
                  ? 'bg-[#B08D2C] border-[#B08D2C] text-white'
                  : 'border-[#B08D2C] text-transparent hover:bg-[#FAF6EE]'
                  }`}
              >
                <Check size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 italic">No cash payments pending.</p>
        )}
      </div>

      {/* Footer link */}
      <Link href="/super-admin/financials" className="mt-4 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase hover:text-[#B08D2C] transition-colors self-center text-center block w-full">
        VIEW ALL QUEUE
      </Link>
    </div>
  );
};

export default CashPayments;
