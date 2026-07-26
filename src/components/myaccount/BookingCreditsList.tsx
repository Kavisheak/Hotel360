"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, HelpCircle, ArrowRight, Loader2, Sparkles, RefreshCw, Undo } from "lucide-react";
import { customerBookingAPI } from "@/lib/api";
import Link from "next/link";

export default function BookingCreditsList() {
  const [credits, setCredits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      setIsLoading(true);
      const { ok, data } = await customerBookingAPI.getBookingCredits();
      if (ok && data?.data) {
        setCredits(data.data);
      }
    } catch (e) {
      console.error("Failed to load booking credits:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const getRemainingTime = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - Date.now();
    if (diff <= 0) return "Expired (Auto-refunding)";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-serif font-bold text-gray-800 dark:text-gray-200">Active Booking Credits</h4>
        </div>
        <button onClick={fetchCredits} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors text-gray-500">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {credits.length === 0 ? (
        <p className="text-xs text-gray-500 italic py-2">No active booking credits found. Rejection credits will display here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credits.map((credit) => (
            <div 
              key={credit._id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 shadow-sm transition-all
                ${credit.status === "Active" 
                  ? "bg-amber-50/30 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/50" 
                  : "bg-gray-50/50 border-gray-200 dark:bg-zinc-800/10 dark:border-zinc-800"}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] capitalize">
                    {credit.category} Category
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border
                    ${credit.status === "Active" 
                      ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900" 
                      : "bg-zinc-100 text-zinc-500 border-zinc-300"}`}
                  >
                    {credit.status}
                  </span>
                </div>

                <p className="text-2xl font-bold font-serif text-gray-900 dark:text-white leading-none">
                  {formatCurrency(credit.creditAmount)}
                </p>

                {credit.status === "Active" && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getRemainingTime(credit.expiresAt)}
                  </p>
                )}
              </div>

              {credit.status === "Active" && (
                <div className="flex items-center gap-2 pt-2 border-t border-amber-100/50 dark:border-amber-900/20">
                  <Link
                    href="/customer/vendors"
                    className="flex-1 text-center py-2 bg-[#C9A84C] text-[#2C1E14] font-bold text-[9px] uppercase tracking-widest rounded hover:bg-[#B58B5C] transition-colors"
                  >
                    Swap Partner
                  </Link>
                  <button
                    onClick={async () => {
                      alert("A refund request has been initiated. Our concierge team will return this amount to your card within 3-5 business days.");
                      fetchCredits();
                    }}
                    className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    <Undo className="w-3.5 h-3.5" /> Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
