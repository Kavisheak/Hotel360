"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, HelpCircle, ArrowRight, Loader2, DollarSign } from "lucide-react";
import { customerBookingAPI } from "@/lib/api";

interface EscrowTrackerProps {
  bookingId: string;
}

export default function EscrowTracker({ bookingId }: EscrowTrackerProps) {
  const [escrows, setEscrows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        setIsLoading(true);
        // We'll hit the new escrow-tracker route on the backend
        const { ok, data } = await customerBookingAPI.getEscrowTracker(bookingId);
        if (ok && data?.data) {
          setEscrows(data.data);
        }
      } catch (e) {
        console.error("Failed to load escrow tracking details:", e);
      } finally {
        setIsLoading(false);
      }
    };
    if (bookingId) {
      fetchEscrows();
    }
  }, [bookingId]);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Held":
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold rounded">Held in Escrow</span>;
      case "Released":
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold rounded">Released</span>;
      case "Refunded":
        return <span className="px-2 py-0.5 bg-gray-55 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-bold rounded">Refunded</span>;
      case "Credited":
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold rounded">Credited</span>;
      case "Unpaid":
        return <span className="px-2 py-0.5 bg-zinc-100 text-zinc-400 border border-zinc-200 text-[10px] font-medium rounded">Unpaid</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] rounded">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800/80 pb-2">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <h4 className="text-sm font-serif font-bold text-gray-800 dark:text-gray-200">Escrow Allocations (30% / 70% Split)</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800/80 text-gray-400 font-bold uppercase tracking-wider">
              <th className="py-2.5">Booking Item</th>
              <th className="py-2.5">Partner Assigned</th>
              <th className="py-2.5">Advance Held (30%)</th>
              <th className="py-2.5">Advance Status</th>
              <th className="py-2.5">Balance Held (70%)</th>
              <th className="py-2.5">Balance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
            {escrows.map((escrow) => (
              <tr key={escrow._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                <td className="py-3 font-semibold capitalize text-gray-700 dark:text-gray-300">
                  {escrow.itemType === "hall" ? "EASCCA Conference Centre" : escrow.itemType}
                </td>
                <td className="py-3 text-gray-500">
                  {escrow.itemType === "hall" 
                    ? "Hotel Direct" 
                    : escrow.vendorId 
                      ? `${escrow.vendorId.firstName} ${escrow.vendorId.lastName || ""}` 
                      : "Unassigned"}
                </td>
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  {formatCurrency(escrow.advanceHeld)}
                </td>
                <td className="py-3">
                  {getStatusBadge(escrow.advanceStatus)}
                </td>
                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                  {formatCurrency(escrow.balanceHeld)}
                </td>
                <td className="py-3">
                  {getStatusBadge(escrow.balanceStatus)}
                </td>
              </tr>
            ))}
            {escrows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400 italic">
                  Escrow holds have not been allocated yet for this booking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
