"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, Filter, ChevronDown, CheckCircle2, AlertCircle, Clock, 
  Wallet, RefreshCw, Loader2, ArrowUpRight, Ban, XCircle 
} from "lucide-react";
import { paymentAPI } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";

type PayoutStatus = "ALL" | "PENDING" | "PAYOUT_ELIGIBLE" | "PROCESSING" | "PAID" | "CANCELLED" | "FAILED" | "FROZEN" | "REFUND_PENDING";

interface DashboardMetrics {
  pendingPayouts: number;
  eligible: number;
  paidThisMonth: number;
  refundsPending: number;
}

export default function PayoutDashboard() {
  const { addToast } = useToastStore();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    pendingPayouts: 0,
    eligible: 0,
    paidThisMonth: 0,
    refundsPending: 0
  });
  
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHolding, setIsHolding] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Manual Payment States
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<any>(null);
  const [payReference, setPayReference] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isCash, setIsCash] = useState(false);

  // Refund State
  const [isRefunding, setIsRefunding] = useState<string | null>(null);
  const [refundModalState, setRefundModalState] = useState<{ isOpen: boolean; refundRequestId: string; amount: number; }>({ isOpen: false, refundRequestId: "", amount: 0 });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutStatus>("ALL");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [bookingRef, setBookingRef] = useState("");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (vendorTypeFilter !== "ALL") params.vendorType = vendorTypeFilter;
      if (bookingRef) params.bookingRef = bookingRef;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;
      if (amountRange.min) params.minAmount = amountRange.min;
      if (amountRange.max) params.maxAmount = amountRange.max;

      const { ok, data } = await paymentAPI.getPayoutDashboard(params);
      if (ok && data?.data) {
        setMetrics(data.data.metrics);
        setList(data.data.list);
      }
    } catch (e) {
      console.error("Failed to load payout dashboard:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [statusFilter, vendorTypeFilter]);

  const handleApplyFilters = () => {
    fetchDashboard();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setVendorTypeFilter("ALL");
    setDateRange({ start: "", end: "" });
    setBookingRef("");
    setAmountRange({ min: "", max: "" });
    setTimeout(fetchDashboard, 100);
  };

  const handleOpenPayModal = (item: any) => {
    setSelectedEscrow(item);
    setPayAmount(item.amount.toString());
    setPayReference("");
    setPayNotes("");
    setReceiptFile(null);
    setIsCash(false);
    setPayModalOpen(true);
  };

  const handlePayVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscrow) return;
    
    if (!isCash && (!payReference || !receiptFile)) {
      alert("Reference number and receipt file are required for Bank Transfers.");
      return;
    }

    setIsPaying(true);
    try {
      const formData = new FormData();
      formData.append("reference", payReference || "CASH");
      formData.append("notes", payNotes);
      formData.append("amount", payAmount);
      formData.append("isCash", String(isCash));
      formData.append("payoutPhase", selectedEscrow.id.endsWith("_bal") ? "balance" : "advance");
      
      if (receiptFile && !isCash) {
        formData.append("receipt", receiptFile);
      }

      const { ok, data } = await paymentAPI.payVendorAdvance(selectedEscrow.escrowId, formData);
      if (ok) {
        setPayModalOpen(false);
        fetchDashboard();
        addToast({ message: "Vendor paid successfully!", type: "success" });
      } else {
        alert(data?.message || "Failed to pay vendor.");
      }
    } catch (e) {
      console.error(e);
      alert("Error processing payment.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleHold = async (escrowId: string) => {
    const reason = prompt("Reason for freezing payout release:", "Manager manual hold during dispute review.");
    if (reason === null) return;

    try {
      setIsHolding(escrowId);
      // We will use existing holdPayout API which uses escrowId
      // Ensure the id passed is the escrowId not the unified ID
      const { ok, data } = await paymentAPI.holdPayout(escrowId, reason);
      if (ok) {
        fetchDashboard();
      } else {
        alert(data.message || "Failed to hold payout.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHolding(null);
    }
  };

  const handleReleaseHold = async (escrowId: string) => {
    if (!confirm("Release freeze on this payout? Automated release engine will evaluate eligibility immediately.")) return;

    try {
      setIsHolding(escrowId);
      const { ok, data } = await paymentAPI.releaseHeldPayout(escrowId);
      if (ok) {
        fetchDashboard();
      } else {
        alert(data.message || "Failed to release payout hold.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHolding(null);
    }
  };

  const handleProcessRefund = async (refundRequestId: string, amount: number) => {
    setRefundModalState({ isOpen: true, refundRequestId, amount });
  };

  const confirmRefund = async () => {
    const { refundRequestId, amount } = refundModalState;
    if (!refundRequestId) return;

    try {
      setIsRefunding(refundRequestId);
      const { ok, data } = await paymentAPI.approveRefund(refundRequestId, amount);
      if (ok) {
        addToast({ message: `Refund of LKR ${amount.toLocaleString()} approved and executed!`, type: "success" });
        setRefundModalState({ isOpen: false, refundRequestId: "", amount: 0 });
        fetchDashboard();
      } else {
        alert(data.message || "Failed to approve refund.");
      }
    } catch (e) {
      console.error(e);
      alert("Error processing refund.");
    } finally {
      setIsRefunding(null);
    }
  };

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REFUNDED":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[10px] font-bold tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> REFUNDED</span>;
      case "PAID":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold tracking-wider">PAID</span>;
      case "PAYOUT_ELIGIBLE":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[10px] font-bold tracking-wider">ELIGIBLE</span>;
      case "PENDING":
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] font-bold tracking-wider">PENDING</span>;
      case "FROZEN":
        return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-[10px] font-bold tracking-wider flex items-center gap-1 w-fit"><Ban className="w-3 h-3"/> FROZEN</span>;
      case "REFUND_PENDING":
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-[10px] font-bold tracking-wider flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3"/> REFUND PENDING</span>;
      case "FAILED":
        return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-[10px] font-bold tracking-wider">FAILED</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded text-[10px] font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] -z-10" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Payouts</p>
          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.pendingPayouts)}</h3>
        </div>
        <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Eligible</p>
          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.eligible)}</h3>
        </div>
        <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] -z-10" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-emerald-500" /> Paid This Month</p>
          <h3 className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(metrics.paidThisMonth)}</h3>
        </div>
        <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[100px] -z-10" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-red-500" /> Refunds Pending</p>
          <h3 className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">{formatCurrency(metrics.refundsPending)}</h3>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Payout Filters
          </h3>
          <div className="flex gap-2">
            <button onClick={handleClearFilters} className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              Clear
            </button>
            <button onClick={handleApplyFilters} className="px-4 py-2 bg-[#C9A84C] text-white rounded text-xs font-bold hover:bg-[#B58A59] transition-colors">
              Apply Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="space-y-1 lg:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Vendor / Type</label>
            <input 
              type="text" 
              placeholder="Search vendor..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</label>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as PayoutStatus)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAYOUT_ELIGIBLE">Payout Eligible</option>
              <option value="PROCESSING">Processing</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
              <option value="FROZEN">Frozen</option>
              <option value="REFUND_PENDING">Refund Pending</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Vendor Type</label>
            <select 
              value={vendorTypeFilter}
              onChange={e => setVendorTypeFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="ALL">All Types</option>
              <option value="hall">Hotel Manager</option>
              <option value="decorator">Decorator</option>
              <option value="videographer">Videographer</option>
              <option value="dj">DJ</option>
              <option value="photographer">Photographer</option>
              <option value="cake">Cake</option>
              <option value="florist">Florist</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Booking ID</label>
            <input 
              type="text" 
              placeholder="e.g. BKG-1234"
              value={bookingRef}
              onChange={e => setBookingRef(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Date Range (Start - End)</label>
            <div className="flex gap-1">
              <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="w-1/2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-2 py-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
              <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="w-1/2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-2 py-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount (Min - Max)</label>
            <div className="flex gap-1">
              <input type="number" placeholder="Min" value={amountRange.min} onChange={e => setAmountRange({...amountRange, min: e.target.value})} className="w-1/2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-2 py-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
              <input type="number" placeholder="Max" value={amountRange.max} onChange={e => setAmountRange({...amountRange, max: e.target.value})} className="w-1/2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-2 py-2 text-xs focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-zinc-900/40 border-b border-gray-100 dark:border-zinc-800 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Booking / Vendor</th>
                <th className="py-4 px-5">Type</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C] mx-auto" />
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 italic font-light">
                    No payouts found matching your criteria.
                  </td>
                </tr>
              ) : (
                Object.values(
                  list.reduce((acc: any, curr: any) => {
                    const key = curr.bookingRef || "N/A";
                    if (!acc[key]) {
                      acc[key] = {
                        bookingRef: key,
                        clientName: curr.clientName,
                        date: curr.date,
                        totalAmount: 0,
                        items: [],
                        vendors: new Set(),
                      };
                    }
                    acc[key].totalAmount += curr.amount || 0;
                    acc[key].items.push(curr);
                    if (curr.vendor && curr.vendor !== "Unassigned") {
                      acc[key].vendors.add(curr.vendor);
                    }
                    return acc;
                  }, {})
                ).map((group: any) => (
                  <React.Fragment key={group.bookingRef}>
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors border-b border-gray-50 dark:border-zinc-800/40">
                      <td className="py-4 px-5 whitespace-nowrap">
                        <p className="font-bold text-gray-900 dark:text-white">{new Date(group.date).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-500">{new Date(group.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-[#C9A84C]">{group.bookingRef}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 mt-1">{group.clientName || "Unknown Client"}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                           {Array.from(group.vendors).length > 0 ? Array.from(group.vendors).join(", ") : "No Vendors"}
                        </p>
                      </td>
                      <td className="py-4 px-5 text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                        {group.items.length} Payout{group.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-serif font-bold text-gray-900 dark:text-white text-base">
                          {formatCurrency(group.totalAmount)}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex gap-1 flex-wrap">
                          {Array.from(new Set(group.items.map((i: any) => i.status))).map((status: any) => (
                            <span key={status} className="mb-1">{getStatusBadge(status)}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setExpandedRows(prev => prev.includes(group.bookingRef) ? prev.filter(r => r !== group.bookingRef) : [...prev, group.bookingRef])}
                          className="px-4 py-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5"
                        >
                          {expandedRows.includes(group.bookingRef) ? (
                            <>Hide <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /></>
                          ) : (
                            <>View <ChevronDown className="w-4 h-4 transition-transform" /></>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {expandedRows.includes(group.bookingRef) && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b border-gray-200 dark:border-zinc-700">
                          <div className="bg-gray-50/80 dark:bg-zinc-900/50 p-4 border-l-4 border-[#C9A84C]">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700">
                                  <th className="pb-2 px-3 text-left">Item / Vendor</th>
                                  <th className="pb-2 px-3 text-left">Type</th>
                                  <th className="pb-2 px-3 text-left">Amount</th>
                                  <th className="pb-2 px-3 text-left">Status</th>
                                  <th className="pb-2 px-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {group.items.map((item: any) => (
                                  <tr key={item.id} className="hover:bg-gray-100/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="py-3 px-3">
                                      <p className="font-semibold text-gray-900 dark:text-white">{item.vendor}</p>
                                      <p className="text-[10px] text-gray-500 uppercase tracking-widest capitalize">{item.itemType}</p>
                                    </td>
                                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400 font-bold tracking-wider">
                                      {item.type}
                                    </td>
                                    <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-white">
                                      {formatCurrency(item.amount)}
                                    </td>
                                    <td className="py-3 px-3">
                                      {getStatusBadge(item.status)}
                                      {item.isFrozen && (
                                        <p className="text-[10px] text-red-500 mt-1 max-w-[120px] leading-tight truncate" title={item.frozenReason}>
                                          {item.frozenReason}
                                        </p>
                                      )}
                                    </td>
                                    <td className="py-3 px-3 text-right whitespace-nowrap">
                                      {item.escrowId && item.status === "PAYOUT_ELIGIBLE" && item.itemType !== "hall" && !item.isFrozen && (
                                        <button
                                          onClick={() => handleOpenPayModal(item)}
                                          className="px-2 py-1 bg-[#C9A84C] hover:bg-[#B58A59] text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors inline-flex items-center mr-2"
                                        >
                                          Pay
                                        </button>
                                      )}
                                      {item.refundRequestId && item.status === "REFUND_PENDING" && (
                                        <button
                                          onClick={() => handleProcessRefund(item.refundRequestId, item.amount)}
                                          disabled={isRefunding === item.refundRequestId}
                                          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors inline-flex items-center mr-2 disabled:opacity-50"
                                        >
                                          {isRefunding === item.refundRequestId ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                          Process Refund
                                        </button>
                                      )}
                                      {item.escrowId && item.status !== "REFUND_PENDING" && (
                                        <>
                                          {item.isFrozen ? (
                                            <button
                                              onClick={() => handleReleaseHold(item.escrowId)}
                                              disabled={isHolding === item.escrowId}
                                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-wider rounded transition-colors inline-flex items-center disabled:opacity-50"
                                            >
                                              {isHolding === item.escrowId ? <Loader2 className="w-3 h-3 animate-spin" /> : "Unfreeze"}
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleHold(item.escrowId)}
                                              disabled={isHolding === item.escrowId}
                                              className="px-2 py-1 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 font-bold text-[10px] uppercase tracking-wider rounded transition-colors inline-flex items-center disabled:opacity-50"
                                            >
                                              {isHolding === item.escrowId ? <Loader2 className="w-3 h-3 animate-spin" /> : "Freeze"}
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {payModalOpen && selectedEscrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#111111] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-zinc-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#C9A84C]" />
                Process Vendor Payment
              </h3>
              <button onClick={() => setPayModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePayVendor} className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 p-3 rounded-lg text-xs mb-2 border border-amber-200 dark:border-amber-800/50">
                <strong>Paying Vendor:</strong> {selectedEscrow.vendor} <br />
                <strong>For Booking:</strong> {selectedEscrow.bookingRef}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" checked={!isCash} onChange={() => setIsCash(false)} className="text-[#C9A84C] focus:ring-[#C9A84C]" />
                  Bank Transfer
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" checked={isCash} onChange={() => setIsCash(true)} className="text-[#C9A84C] focus:ring-[#C9A84C]" />
                  Cash Handover
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Payment Amount (LKR)</label>
                <input 
                  type="number" 
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                  required
                />
              </div>

              {!isCash && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Bank Reference No.</label>
                  <input 
                    type="text" 
                    value={payReference}
                    onChange={e => setPayReference(e.target.value)}
                    placeholder="e.g. TR-9988776655"
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                    required={!isCash}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Notes (Optional)</label>
                <textarea 
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] min-h-[80px]"
                />
              </div>

              {!isCash && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Upload Receipt (Image/PDF)</label>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setReceiptFile(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C9A84C] file:text-white hover:file:bg-[#B58A59]"
                    required={!isCash}
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPaying}
                  className="px-4 py-2 bg-[#C9A84C] text-white rounded text-sm font-bold hover:bg-[#B58A59] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {refundModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#111111] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-zinc-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-500" />
                Confirm Refund
              </h3>
              <button 
                onClick={() => setRefundModalState({ isOpen: false, refundRequestId: "", amount: 0 })} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to approve a refund of <strong className="text-gray-900 dark:text-white font-mono text-base">LKR {refundModalState.amount.toLocaleString()}</strong>?
              </p>
              
              <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 rounded-lg p-3 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">
                  This action will immediately process the refund to the customer's bank account via the PayHere payment gateway. This cannot be undone.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setRefundModalState({ isOpen: false, refundRequestId: "", amount: 0 })}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRefund}
                  disabled={isRefunding === refundModalState.refundRequestId}
                  className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-bold hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isRefunding === refundModalState.refundRequestId ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
