"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, HelpCircle, Loader2, DollarSign, Receipt, Percent, RefreshCw } from "lucide-react";
import { vendorPaymentAPI } from "@/lib/api";

export default function VendorPayoutDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayoutData = async () => {
    try {
      setIsLoading(true);
      const res = await vendorPaymentAPI.getExpectedPayouts();
      if (res.ok && res.data?.data) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load vendor payouts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 bg-[#FDF9F1] rounded-xl border border-[#E0D8C3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B08D2C]" />
      </div>
    );
  }

  // Deduct 10% from the escrow held to show commission projection
  const estimatedCommission = Math.round((data?.totalEscrowHeld || 0) * 0.10);
  const estimatedNetPayout = (data?.totalEscrowHeld || 0) - estimatedCommission;

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Escrow Held (Gross)", value: formatCurrency(data?.totalEscrowHeld), icon: ShieldCheck, sub: `Est. Commission (10%): ${formatCurrency(estimatedCommission)}` },
          { label: "Expected Net Payout", value: formatCurrency(estimatedNetPayout), icon: DollarSign, sub: "Release pending hall + vendor acceptance" },
          { label: "Total Completed Payouts", value: formatCurrency(data?.totalPayoutsReleased), icon: Receipt, sub: "Paid out to your registered bank account" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#E0D8C3] p-5 shadow-sm rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#7C6A2E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{item.label}</span>
              <item.icon className="w-4 h-4 text-[#B08D2C]" />
            </div>
            <p className="text-xl font-bold font-serif text-[#7C6A2E] mt-1">{item.value}</p>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Escrow Tracker Details */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-serif text-lg text-gray-900">Held Escrow Allocations</h3>
            <p className="text-xs text-gray-500 font-light mt-0.5">Assigned booking items currently locked in escrow.</p>
          </div>
          <button onClick={fetchPayoutData} className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E0D8C3] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Booking Ref</th>
                <th className="py-2.5">Event Name</th>
                <th className="py-2.5">Event Date</th>
                <th className="py-2.5">Advance Held (30%)</th>
                <th className="py-2.5">Advance Status</th>
                <th className="py-2.5">Balance Held (70%)</th>
                <th className="py-2.5">Balance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.heldDetails?.map((item: any) => (
                <tr key={item._id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-semibold text-gray-800">{item.bookingId?.bookingRef || "N/A"}</td>
                  <td className="py-3 capitalize text-gray-600">{item.bookingId?.eventType || "Event"}</td>
                  <td className="py-3 text-gray-500">
                    {item.bookingId?.date ? new Date(item.bookingId.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-3 font-semibold text-gray-800">{formatCurrency(item.advanceHeld)}</td>
                  <td className="py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border
                      ${item.advanceStatus === "Released" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        item.advanceStatus === "Held" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                        "bg-zinc-100 text-zinc-400 border-zinc-200"}`}
                    >
                      {item.advanceStatus}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-gray-800">{formatCurrency(item.balanceHeld)}</td>
                  <td className="py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border
                      ${item.balanceStatus === "Released" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        item.balanceStatus === "Held" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                        "bg-zinc-100 text-zinc-400 border-zinc-200"}`}
                    >
                      {item.balanceStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.heldDetails || data.heldDetails.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400 italic">No held escrow balances found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Released Payout History */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-6 shadow-sm">
        <div>
          <h3 className="font-serif text-lg text-gray-900 mb-4 border-b border-gray-100 pb-3">Released Payout Logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E0D8C3] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Payout Date</th>
                <th className="py-2.5">Booking Ref</th>
                <th className="py-2.5">Event Name</th>
                <th className="py-2.5">Gross Amount</th>
                <th className="py-2.5">Comm Deduction (10%)</th>
                <th className="py-2.5">Net Payout</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.payoutHistory?.map((payout: any) => {
                const commission = payout.grossAmount - payout.netPayout;
                return (
                  <tr key={payout._id} className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-500">{new Date(payout.payoutDate || payout.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 font-semibold text-gray-800">{payout.bookingId?.bookingRef || "N/A"}</td>
                    <td className="py-3 capitalize text-gray-600">{payout.bookingId?.eventType || "Event"}</td>
                    <td className="py-3 font-medium text-gray-800">{formatCurrency(payout.grossAmount)}</td>
                    <td className="py-3 font-medium text-red-500">-{formatCurrency(commission)}</td>
                    <td className="py-3 font-semibold text-emerald-600">{formatCurrency(payout.netPayout)}</td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold uppercase">
                        {payout.payoutStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!data?.payoutHistory || data.payoutHistory.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400 italic">No payout releases logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
