"use client";

import React, { useState } from "react";
import { CreditCard, Plus, Trash2, Star, ShieldCheck } from "lucide-react";
import { PAYMENT_METHODS, type PaymentMethod } from "./types";

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
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSetPrimary = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isPrimary: m.id === id }))
    );
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white border border-[#D4C9A8] rounded-sm shadow-sm hover-glow transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E6D0] bg-[#F0E6D0]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div>
            <h4 className="text-sm font-serif text-[#2C1E14]">Payment Methods</h4>
            <p className="text-[10px] text-gray-400 font-light">Manage your cards for booking payments.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#C9A84C] hover:text-[#2C1E14] transition-all btn-interactive flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Card
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Cards Grid */}
        {methods.map((card, idx) => (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${
              card.isPrimary ? "border-[#C9A84C] shadow-md" : "border-[#D4C9A8] hover:border-[#C9A84C]/50"
            }`}
          >
            <div className="flex items-center gap-5 p-5">
              {/* Mini Card Visual */}
              <div className={`w-16 h-10 rounded bg-gradient-to-br ${CARD_GRADIENTS[card.type]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-white text-[9px] font-black tracking-widest">{CARD_ICONS[card.type]}</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#2C1E14]">
                    {card.type.charAt(0).toUpperCase() + card.type.slice(1)} •••• {card.last4}
                  </p>
                  {card.isPrimary && (
                    <span className="text-[7px] uppercase tracking-[0.15em] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-sm border border-[#C9A84C]/20">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-light mt-0.5">
                  {card.cardholderName} — Expires {card.expiry}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {!card.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(card.id)}
                    className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] hover:text-[#2C1E14] transition-colors btn-interactive flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleRemove(card.id)}
                  className="text-[9px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors btn-interactive flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {methods.length === 0 && (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No payment methods added yet.</p>
            <p className="text-[10px] text-gray-400 font-light mt-1">Add a card to make booking payments easier.</p>
          </div>
        )}

        {/* Add Card Form */}
        {showAddForm && (
          <div className="border border-dashed border-[#C9A84C]/40 rounded-sm p-5 bg-[#F0E6D0]/10 space-y-4 card-entrance">
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] mb-2">Add New Card</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Card Number</label>
                <input
                  placeholder="0000 0000 0000 0000"
                  className="w-full border border-[#D4C9A8] bg-white p-3 rounded-sm text-sm focus:border-[#C9A84C] outline-none transition-all input-glow"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Cardholder Name</label>
                <input
                  placeholder="Name on card"
                  className="w-full border border-[#D4C9A8] bg-white p-3 rounded-sm text-sm focus:border-[#C9A84C] outline-none transition-all input-glow"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Expiry</label>
                  <input
                    placeholder="MM/YY"
                    className="w-full border border-[#D4C9A8] bg-white p-3 rounded-sm text-sm focus:border-[#C9A84C] outline-none transition-all input-glow"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">CVV</label>
                  <input
                    placeholder="•••"
                    type="password"
                    className="w-full border border-[#D4C9A8] bg-white p-3 rounded-sm text-sm focus:border-[#C9A84C] outline-none transition-all input-glow"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button className="px-5 py-2.5 bg-[#C9A84C] text-[#2C1E14] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] transition-colors btn-interactive">
                Add Card
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 border border-[#D4C9A8] text-gray-500 font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors btn-interactive"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-light mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Your card details are encrypted and securely processed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
