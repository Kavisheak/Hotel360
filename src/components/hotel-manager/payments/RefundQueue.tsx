"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { paymentAPI } from "@/lib/api";
import DisputeThread from "@/components/shared/DisputeThread";

export default function RefundQueue() {
  const [activeSubTab, setActiveSubTab] = useState<"needsReview" | "autoResolved">("needsReview");
  const [manualRequests, setManualRequests] = useState<any[]>([]);
  const [autoLogs, setAutoLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Active Dispute Thread Modal state
  const [disputeModal, setDisputeModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    bookingRef?: string;
    itemType: string;
  }>({
    isOpen: false,
    bookingId: "",
    bookingRef: "",
    itemType: "",
  });

  const fetchRefunds = async () => {
    try {
      setIsLoading(true);
      const { ok, data } = await paymentAPI.getRefundQueue();
      if (ok && data?.data) {
        setManualRequests(data.data.needsReview || []);
        setAutoLogs(data.data.autoResolved || []);
      }
    } catch (e) {
      console.error("Failed to fetch refund queue:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleApprove = async (refundRequestId: string, requestedAmount: number) => {
    const customAmountStr = prompt(
      `Approve refund. Enter amount (default full LKR ${requestedAmount.toLocaleString()}):`,
      requestedAmount.toString()
    );
    if (customAmountStr === null) return;
    const amount = Number(customAmountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid refund amount.");
      return;
    }

    try {
      setActionId(refundRequestId);
      const { ok, data } = await paymentAPI.approveRefund(refundRequestId, amount);
      if (ok) {
        alert(`Refund of LKR ${amount.toLocaleString()} approved and executed!`);
        fetchRefunds();
      } else {
        alert(data.message || "Failed to approve refund.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleDeny = async (refundRequestId: string) => {
    const reason = prompt("Enter denial reason (required):");
    if (!reason || !reason.trim()) {
      alert("Denial reason is required.");
      return;
    }

    try {
      setActionId(refundRequestId);
      const { ok, data } = await paymentAPI.denyRefund(refundRequestId, reason);
      if (ok) {
        alert("Refund request denied.");
        fetchRefunds();
      } else {
        alert(data.message || "Failed to deny refund.");
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
      {/* Sub-Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xs">
        <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveSubTab("needsReview")}
            className={`px-4 py-2 rounded-md font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "needsReview"
                ? "bg-[#1E56A0] text-white shadow-xs"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Needs Review ({manualRequests.filter((r) => r.status === "PendingReview").length})
          </button>
          <button
            onClick={() => setActiveSubTab("autoResolved")}
            className={`px-4 py-2 rounded-md font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "autoResolved"
                ? "bg-[#1E56A0] text-white shadow-xs"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Auto-Resolved Audit Log
          </button>
        </div>

        <button
          onClick={fetchRefunds}
          className="px-3 py-1.5 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* SUB-VIEW 1: NEEDS REVIEW */}
      {activeSubTab === "needsReview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
            </div>
          ) : manualRequests.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-xl">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm">No refund requests awaiting review.</p>
            </div>
          ) : (
            manualRequests.map((req) => (
              <div key={req._id} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden flex flex-col hover:border-[#C9A84C]/30 transition-colors">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800/30">
                      Vendor Rejection Refund
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span className="font-sans text-gray-500 text-xs uppercase font-bold tracking-wider">Booking:</span>
                      <span className="font-bold text-[#1A1512] dark:text-white">
                        {req.bookingId?.bookingRef || "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-sans text-gray-500 text-xs uppercase font-bold tracking-wider">Customer:</span>
                      <span className="font-bold text-[#1A1512] dark:text-white truncate max-w-[150px]">
                        {req.requestedBy?.firstName} {req.requestedBy?.lastName}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-sans text-gray-500 text-xs uppercase font-bold tracking-wider">Vendor:</span>
                      <span className="font-bold text-[#1A1512] dark:text-white capitalize truncate max-w-[150px]">
                        {req.itemType}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-b border-gray-100 dark:border-zinc-800/60 my-2">
                      <span className="font-sans text-gray-500 text-xs uppercase font-bold tracking-wider">Refund Amount:</span>
                      <span className="font-bold text-[#C9A84C] text-base">
                        {formatCurrency(req.requestedAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-gray-500 text-xs uppercase font-bold tracking-wider">Reason:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-sans text-sm line-clamp-2">
                        {req.reason || "Vendor declined"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (req.bookingId?._id) {
                        window.open(`/hotel-manager/bookings/${req.bookingId._id}`, "_blank");
                      }
                    }}
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#1A1512] dark:text-white bg-white dark:bg-[#111111] border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    View Booking
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprove(req._id, req.requestedAmount)}
                      disabled={actionId === req._id}
                      className="py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      {actionId === req._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Approve Refund
                    </button>
                    
                    <button
                      onClick={() => handleDeny(req._id)}
                      disabled={actionId === req._id}
                      className="py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      {actionId === req._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-VIEW 2: AUTO-RESOLVED AUDIT LOG */}
      {activeSubTab === "autoResolved" && (
        <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50">
            <p className="text-xs text-gray-500 font-light">
              Read-only audit trail for automated instant refunds (pre-acceptance vendor rejections &amp; hall cancellations).
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Refunded Amount</th>
                  <th className="py-3 px-4">System Log Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C] mx-auto" />
                    </td>
                  </tr>
                ) : autoLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                      No automated refunds recorded.
                    </td>
                  </tr>
                ) : (
                  autoLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                        {log.bookingId?.bookingRef || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-purple-600 dark:text-purple-400">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-serif font-bold text-gray-900 dark:text-white">
                        {formatCurrency(log.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-sm truncate">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shared Dispute Thread Modal */}
      <DisputeThread
        isOpen={disputeModal.isOpen}
        onClose={() => setDisputeModal({ ...disputeModal, isOpen: false })}
        bookingId={disputeModal.bookingId}
        bookingRef={disputeModal.bookingRef}
        itemType={disputeModal.itemType}
        userRole="hotel_manager"
        onResolveDispute={(action, details) => {
          setDisputeModal({ ...disputeModal, isOpen: false });
          fetchRefunds();
        }}
      />
    </div>
  );
}
