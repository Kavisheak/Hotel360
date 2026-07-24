"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, HelpCircle, Loader2, DollarSign, ListFilter, Percent, Receipt } from "lucide-react";
import { paymentAPI } from "@/lib/api";

export default function FinancialsDashboard() {
  const [financials, setFinancials] = useState<any>(null);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const resFin = await paymentAPI.getFinancialsReport();
      const resEsc = await paymentAPI.getEscrowBalances();
      if (resFin.ok && resFin.data?.data) {
        setFinancials(resFin.data.data);
      }
      if (resEsc.ok && resEsc.data?.data) {
        setEscrows(resEsc.data.data);
      }
    } catch (e) {
      console.error("Failed to load financials:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white rounded-xl border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Escrow Held", value: formatCurrency(financials?.totalEscrowHeld), icon: ShieldCheck, bg: "border-amber-100 bg-amber-50/10 text-amber-600" },
          { label: "Hotel Payouts", value: formatCurrency(financials?.totalHotelPayout), icon: DollarSign, bg: "border-emerald-100 bg-emerald-50/10 text-emerald-600" },
          { label: "Vendor Payouts", value: formatCurrency(financials?.totalVendorPayout), icon: Receipt, bg: "border-blue-100 bg-blue-50/10 text-blue-600" },
          { label: "Platform Commission (10%)", value: formatCurrency(financials?.totalCommission), icon: Percent, bg: "border-purple-100 bg-purple-50/10 text-purple-600" }
        ].map((metric, i) => (
          <div key={i} className={`p-5 rounded-xl border ${metric.bg} bg-white dark:bg-[#111] shadow-sm`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{metric.label}</span>
              <metric.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-serif text-gray-900 dark:text-white leading-none mt-1">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Escrow Allocations Statement */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-50 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif text-lg text-gray-900 dark:text-white">Active Escrow Accounts Ledger</h3>
            <p className="text-xs text-gray-500 font-light mt-0.5">Platform holds for hall and vendor assignments.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Booking Ref</th>
                <th className="py-2.5">Item type</th>
                <th className="py-2.5">Provider</th>
                <th className="py-2.5">Advance Hold</th>
                <th className="py-2.5">Adv Status</th>
                <th className="py-2.5">Balance Hold</th>
                <th className="py-2.5">Bal Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
              {escrows.map((escrow) => (
                <tr key={escrow._id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                    {escrow.bookingId?.bookingRef || "N/A"}
                  </td>
                  <td className="py-3 capitalize text-gray-600 dark:text-zinc-400">{escrow.itemType}</td>
                  <td className="py-3 text-gray-500">
                    {escrow.itemType === "hall" 
                      ? "Hotel Centre" 
                      : escrow.vendorId 
                        ? `${escrow.vendorId.firstName} ${escrow.vendorId.lastName || ""}` 
                        : "Unassigned"}
                  </td>
                  <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{formatCurrency(escrow.advanceHeld)}</td>
                  <td className="py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border
                      ${escrow.advanceStatus === "Released" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        escrow.advanceStatus === "Held" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                        escrow.advanceStatus === "Credited" ? "bg-blue-50 text-blue-600 border-blue-100" : 
                        "bg-gray-55 text-gray-500 border-gray-100"}`}
                    >
                      {escrow.advanceStatus}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{formatCurrency(escrow.balanceHeld)}</td>
                  <td className="py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border
                      ${escrow.balanceStatus === "Released" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        escrow.balanceStatus === "Held" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                        "bg-zinc-100 text-zinc-400 border-zinc-200"}`}
                    >
                      {escrow.balanceStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {escrows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400 italic">No escrow records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
