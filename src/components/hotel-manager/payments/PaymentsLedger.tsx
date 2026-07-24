"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, ShieldCheck, RefreshCw, Loader2, ArrowUpDown } from "lucide-react";
import { paymentAPI } from "@/lib/api";

export default function PaymentsLedger() {
  const [escrows, setEscrows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLedger = async () => {
    try {
      setIsLoading(true);
      const { ok, data } = await paymentAPI.getEscrowLedger();
      if (ok && data?.data) {
        setEscrows(data.data);
      }
    } catch (e) {
      console.error("Failed to load escrow ledger:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const filteredEscrows = escrows.filter((item) => {
    const matchStatus =
      statusFilter === "all" ||
      item.advanceStatus.toLowerCase() === statusFilter ||
      item.balanceStatus.toLowerCase() === statusFilter;
    const matchCategory = categoryFilter === "all" || item.itemType === categoryFilter;
    const refStr = item.bookingId?.bookingRef || "";
    const clientStr = item.bookingId?.clientName || "";
    const vendorStr = item.vendorId ? `${item.vendorId.firstName} ${item.vendorId.lastName || ""}` : "Hotel Direct";
    const matchQuery =
      !searchQuery ||
      refStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendorStr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCategory && matchQuery;
  });

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Held":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";
      case "Released":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";
      case "Refunded":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900";
      case "Credited":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ref, customer, partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-[#C9A84C]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="held">Held</option>
              <option value="released">Released</option>
              <option value="refunded">Refunded</option>
              <option value="credited">Credited</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="hall">Venue / Hall</option>
              <option value="decorator">Decorator</option>
              <option value="dj">DJ Artist</option>
              <option value="videographer">Videographer</option>
              <option value="photographer">Photographer</option>
              <option value="cake">Cake &amp; Bakery</option>
              <option value="florist">Florist</option>
            </select>
          </div>

          <button
            onClick={fetchLedger}
            className="p-2 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Booking Ref / Client</th>
                <th className="py-3 px-4">Item &amp; Category</th>
                <th className="py-3 px-4">Recipient / Partner</th>
                <th className="py-3 px-4">30% Advance</th>
                <th className="py-3 px-4">Advance Status</th>
                <th className="py-3 px-4">70% Balance</th>
                <th className="py-3 px-4">Balance Status</th>
                <th className="py-3 px-4">Release Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C] mx-auto" />
                  </td>
                </tr>
              ) : filteredEscrows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 italic">
                    No matching escrow allocations found in ledger.
                  </td>
                </tr>
              ) : (
                filteredEscrows.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {item.bookingId?.bookingRef || "N/A"}
                      </p>
                      <p className="text-[10px] text-gray-500">{item.bookingId?.clientName || "Walk-in"}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold capitalize text-gray-700 dark:text-gray-300">
                      {item.itemType === "hall" ? "Grand Ballroom" : item.itemType}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                      {item.itemType === "hall"
                        ? "Hotel Account"
                        : item.vendorId
                        ? `${item.vendorId.firstName} ${item.vendorId.lastName || ""}`
                        : "Unassigned"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.advanceHeld)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getBadgeStyle(item.advanceStatus)}`}>
                        {item.advanceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.balanceHeld)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getBadgeStyle(item.balanceStatus)}`}>
                        {item.balanceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {item.releasedAt ? new Date(item.releasedAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
