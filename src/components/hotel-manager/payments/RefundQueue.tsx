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
        <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Service Category</th>
                  <th className="py-3.5 px-4">Requested By</th>
                  <th className="py-3.5 px-4">Requested Amount</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C] mx-auto" />
                    </td>
                  </tr>
                ) : manualRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 italic">
                      No refund requests awaiting review.
                    </td>
                  </tr>
                ) : (
                  manualRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                        {req.bookingId?.bookingRef || "N/A"}
                      </td>
                      <td className="py-4 px-4 capitalize font-semibold text-gray-700 dark:text-gray-300">
                        {req.itemType}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                        {req.requestedBy?.firstName} ({req.requesterRole})
                      </td>
                      <td className="py-4 px-4 font-serif font-bold text-gray-900 dark:text-white">
                        {formatCurrency(req.requestedAmount)}
                      </td>
                      <td className="py-4 px-4 text-gray-500 max-w-xs truncate">{req.reason}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
                            req.status === "PendingReview"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : req.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              setDisputeModal({
                                isOpen: true,
                                bookingId: req.bookingId?._id || req.bookingId,
                                bookingRef: req.bookingId?.bookingRef,
                                itemType: req.itemType,
                              })
                            }
                            className="px-2.5 py-1.5 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 rounded text-[10px] uppercase font-bold tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 text-[#1E56A0]" /> Dispute Thread
                          </button>

                          {req.status === "PendingReview" && (
                            <>
                              <button
                                onClick={() => handleApprove(req._id, req.requestedAmount)}
                                disabled={actionId === req._id}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeny(req._id)}
                                disabled={actionId === req._id}
                                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                              >
                                Deny
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
