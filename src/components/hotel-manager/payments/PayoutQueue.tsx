"use client";

import React, { useEffect, useState } from "react";
import { Clock, Lock, Unlock, ShieldAlert, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { paymentAPI } from "@/lib/api";

export default function PayoutQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      const { ok, data } = await paymentAPI.getPayoutQueue();
      if (ok && data?.data) {
        setQueue(data.data);
      }
    } catch (e) {
      console.error("Failed to load payout queue:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleHold = async (escrowId: string) => {
    const reason = prompt("Reason for freezing payout release:", "Manager manual hold during dispute review.");
    if (reason === null) return;

    try {
      setActionId(escrowId);
      const { ok, data } = await paymentAPI.holdPayout(escrowId, reason);
      if (ok) {
        alert("Payout release frozen successfully.");
        fetchQueue();
      } else {
        alert(data.message || "Failed to hold payout.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleReleaseHold = async (escrowId: string) => {
    if (!confirm("Release freeze on this payout? Automated release engine will evaluate eligibility immediately.")) return;

    try {
      setActionId(escrowId);
      const { ok, data } = await paymentAPI.releaseHeldPayout(escrowId);
      if (ok) {
        alert("Payout freeze released!");
        fetchQueue();
      } else {
        alert(data.message || "Failed to release payout hold.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xs">
        <div>
          <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Automated Payout Queue (Next 24–48 Hours)
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-light">
            Monitors upcoming 30% advance and 70% balance releases. Click "Freeze Payout" to pause an release during an active dispute.
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="px-3 py-1.5 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Booking Ref / Event</th>
                <th className="py-3.5 px-4">Service Category</th>
                <th className="py-3.5 px-4">Target Recipient</th>
                <th className="py-3.5 px-4">Scheduled Release</th>
                <th className="py-3.5 px-4">Status / Freeze State</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C] mx-auto" />
                  </td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                    No active payouts currently queued in escrow.
                  </td>
                </tr>
              ) : (
                queue.map((item) => {
                  const isAdvHeld = item.advanceStatus === "Held";
                  const isBalHeld = item.balanceStatus === "Held";
                  const amount = isAdvHeld ? item.advanceHeld : isBalHeld ? item.balanceHeld : 0;
                  const phaseLabel = isAdvHeld ? "30% Advance" : "70% Balance";

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {item.bookingId?.bookingRef || "N/A"}
                        </p>
                        <p className="text-[10px] text-gray-500">{item.bookingId?.clientName || "Event"}</p>
                      </td>
                      <td className="py-4 px-4 capitalize font-semibold text-gray-700 dark:text-gray-300">
                        {item.itemType === "hall" ? "Grand Ballroom" : item.itemType}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                        {item.itemType === "hall"
                          ? "Hotel Manager"
                          : item.vendorId
                          ? `${item.vendorId.firstName} ${item.vendorId.lastName || ""}`
                          : "Unassigned"}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-serif font-bold text-gray-900 dark:text-white text-sm">
                          {formatCurrency(amount)}
                        </p>
                        <span className="text-[10px] text-gray-400">{phaseLabel}</span>
                      </td>
                      <td className="py-4 px-4">
                        {item.isFrozen ? (
                          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-md border border-red-200 dark:border-red-900 w-fit">
                            <Lock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase">Frozen: {item.frozenReason || "Dispute Hold"}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900 w-fit">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase">Auto-Release Scheduled</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {item.isFrozen ? (
                          <button
                            onClick={() => handleReleaseHold(item._id)}
                            disabled={actionId === item._id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1"
                          >
                            {actionId === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />} Unfreeze
                          </button>
                        ) : (
                          <button
                            onClick={() => handleHold(item._id)}
                            disabled={actionId === item._id}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1"
                          >
                            {actionId === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />} Freeze Payout
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
