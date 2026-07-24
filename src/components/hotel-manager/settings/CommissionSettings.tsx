"use client";

import React, { useEffect, useState } from "react";
import { Percent, Save, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { paymentAPI } from "@/lib/api";

export default function CommissionSettings() {
  const [rates, setRates] = useState<{
    venue: number;
    decorator: number;
    dj: number;
    videographer: number;
    photographer: number;
    cake: number;
    florist: number;
  }>({
    venue: 0.00,
    decorator: 0.10,
    dj: 0.10,
    videographer: 0.10,
    photographer: 0.10,
    cake: 0.10,
    florist: 0.10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      const { ok, data } = await paymentAPI.getCommissionSettings();
      if (ok && data?.data) {
        setRates(data.data);
      }
    } catch (e) {
      console.error("Failed to load commission settings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const { ok, data } = await paymentAPI.updateCommissionSettings(rates);
      if (ok) {
        alert("Platform commission rates updated successfully!");
      } else {
        alert(data.message || "Failed to update commission settings.");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating commission settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  const CATEGORY_LABELS = [
    { key: "venue", label: "Venue / Hall Rental", defaultPct: 0 },
    { key: "decorator", label: "Decorator Services", defaultPct: 10 },
    { key: "dj", label: "DJ & Entertainment", defaultPct: 10 },
    { key: "videographer", label: "Videography Services", defaultPct: 10 },
    { key: "photographer", label: "Photography Services", defaultPct: 10 },
    { key: "cake", label: "Cake & Bakery Services", defaultPct: 10 },
    { key: "florist", label: "Florist Services", defaultPct: 10 },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800 rounded-xl p-6 text-left space-y-6 font-sans shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white">Platform Commission Rates</h3>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Configurable commission percentages deducted during automated payout releases (`evaluatePayoutTriggers`).
            </p>
          </div>
        </div>
        <button onClick={fetchRates} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_LABELS.map(({ key, label }) => {
            const currentValPct = Math.round((rates[key as keyof typeof rates] || 0) * 100);

            return (
              <div key={key} className="p-4 rounded-xl border border-gray-100 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">{label}</label>
                  <span className="text-[10px] text-gray-400">Current Rate: {currentValPct}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={currentValPct}
                    onChange={(e) => {
                      const pct = parseFloat(e.target.value) || 0;
                      setRates({ ...rates, [key]: pct / 100 });
                    }}
                    className="w-20 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded px-2.5 py-1 text-xs text-center font-bold font-mono outline-none focus:border-[#C9A84C]"
                  />
                  <span className="text-xs text-gray-500 font-bold">%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#1E56A0] hover:bg-[#16417A] text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Commission Rates
          </button>
        </div>
      </form>
    </div>
  );
}
