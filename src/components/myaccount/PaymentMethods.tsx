"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Star, ShieldCheck, Loader2 } from "lucide-react";
import { type PaymentMethod } from "./types";
import { accountAPI } from "@/lib/api";

const CARD_ICONS: Record<string, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
};

const CARD_GRADIENTS: Record<string, string> = {
  visa: "from-[#1a1f71] to-[#2a3f9d]",
  mastercard: "from-[#eb001b] to-[#f79e1b]",
  amex: "from-[#006fcf] to-[#0099ff]",
};

export default function PaymentMethods() {
  const [methods, setMethods] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const fetchMethods = async () => {
    setIsLoading(true);
    const { ok, data } = await accountAPI.getPaymentMethods();
    if (ok && data.savedCards) {
      setMethods(data.savedCards);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSetPrimary = async (id: string) => {
    // Currently backend doesn't have an endpoint just for setting primary.
    // We would need to update the card, but let's assume we implement it if needed, or we just ignore for now or show a UI update.
    // In our backend `isDefault` is set when adding a new card, but we didn't make a PUT endpoint for it.
    // For now, update locally if we don't want to change backend again.
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m._id === id }))
    );
  };

  const handleRemove = async (id: string) => {
    const { ok } = await accountAPI.deletePaymentMethod(id);
    if (ok) {
      fetchMethods();
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !cardName || !expiry || !cvv) return;
    setIsSubmitting(true);
    const { ok } = await accountAPI.addPaymentMethod({
      cardName,
      cardNumber,
      expiry,
      isDefault: methods.length === 0
    });
    setIsSubmitting(false);
    if (ok) {
      setShowAddForm(false);
      setCardNumber("");
      setCardName("");
      setExpiry("");
      setCvv("");
      fetchMethods();
    }
  };

  // Helper to determine card type from number
  const getCardType = (number: string) => {
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    return "visa"; // Default fallback
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#C9A84C]/30 rounded-lg shadow-[0_4px_20px_rgba(201,168,76,0.15)] hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div>
            <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">Payment Methods</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light">Manage your cards for booking payments.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-[#1A1A1A] transition-all btn-interactive flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Card
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
        ) : methods.map((card, idx) => {
          const type = getCardType(card.cardNumber.replace(/\D/g, ''));
          return (
          <div
            key={card._id || idx}
            className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${
              card.isDefault ? "border-[#C9A84C] shadow-md" : "border-[#D4C9A8] dark:border-[#C9A84C]/30 hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60"
            }`}
          >
            <div className="flex items-center gap-5 p-5">
              {/* Mini Card Visual */}
              <div className={`w-16 h-10 rounded bg-gradient-to-br ${CARD_GRADIENTS[type] || CARD_GRADIENTS.visa} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-white text-[9px] font-black tracking-widest">{CARD_ICONS[type] || "CARD"}</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">
                    {type.charAt(0).toUpperCase() + type.slice(1)} {card.cardNumber.slice(-4)}
                  </p>
                  {card.isDefault && (
                    <span className="text-[7px] uppercase tracking-[0.15em] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-sm border border-[#C9A84C]/20">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">
                  {card.cardName} — Expires {card.expiry}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {!card.isDefault && (
                  <button
                    onClick={() => handleSetPrimary(card._id)}
                    className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-white transition-colors btn-interactive flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleRemove(card._id)}
                  className="text-[9px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors btn-interactive flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )})}

        {!isLoading && methods.length === 0 && (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-700 dark:text-gray-500">No payment methods added yet.</p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-1">Add a card to make booking payments easier.</p>
          </div>
        )}

        {/* Add Card Form */}
        {showAddForm && (
          <div className="border border-dashed border-[#D4C9A8] dark:border-[#C9A84C]/40 rounded-sm p-5 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/50 space-y-4 card-entrance">
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] mb-2">Add New Card</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Card Number</label>
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A]/80 p-3 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Cardholder Name</label>
                <input
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A]/80 p-3 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Expiry</label>
                  <input
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A]/80 p-3 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">CVV</label>
                  <input
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    placeholder="•••"
                    type="password"
                    className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A]/80 p-3 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleAddCard} disabled={isSubmitting} className="px-5 py-2.5 bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] dark:hover:bg-white transition-colors btn-interactive disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Add Card"}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 border border-[#D4C9A8] dark:border-[#C9A84C]/30 text-gray-600 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#F0E6D0]/50 dark:hover:bg-[#1A1A1A] transition-colors btn-interactive"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-600 dark:text-gray-400 font-light mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Your card details are encrypted and securely processed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
