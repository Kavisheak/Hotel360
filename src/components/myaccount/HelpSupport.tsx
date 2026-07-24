"use client";

import React, { useState } from "react";
import { Phone, Mail, Clock, ShieldCheck, ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How do I cancel or modify my event booking?",
    a: "Cancellations can be processed directly from your dashboard up to 30 days prior to the event date. If your event is between 14 and 30 days away, a cancellation request must be submitted for manager review. Within 14 days, online cancellations are disabled, and you must contact the hotel front desk directly."
  },
  {
    q: "When is the remaining 70% balance due?",
    a: "The remaining 70% balance is due on or before the day of your event. You can settle the payment securely online through the 'Payments & refunds' tab using your saved credit cards, or manually at our reception desk via card/cash."
  },
  {
    q: "Can I swap or change selected service vendors later?",
    a: "Yes. You can manage and swap active decorators, DJs, or videographers directly within the booking summary screen, provided the new artisan is available for your reserved date."
  },
  {
    q: "Who do I contact for custom hall setups or specific dining menus?",
    a: "For all customized layouts, seating alignments, or custom culinary requests, please reach out directly to our 24/7 Concierge service line or email our booking coordination team."
  }
];

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Contact Panel */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {[
          { label: "Concierge Line", val: "+94 77 044 5434", desc: "Urgent call support", icon: Phone },
          { label: "Email Support", val: "concierge@eascc.com", desc: "For detailed inquiries", icon: Mail },
          { label: "Desk Hours", val: "24/7 Operational Support", desc: "Always here for you", icon: Clock }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="p-3 bg-[#FAF6EE] dark:bg-black rounded-lg border border-[#E8DFC9]/40 dark:border-white/5 text-[#C9A84C]">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</h4>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.val}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Header */}
      <div className="text-left">
        <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h3>
        <p className="text-xs text-gray-500 font-light">Quick answers to common questions about bookings, payments, and event configurations.</p>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-3.5 text-left">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between font-medium text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <span className="font-semibold text-left pr-4">{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#C9A84C]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-zinc-800/30">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hotel Address Card */}
      <div className="bg-[#FAF6EE] dark:bg-black/30 p-6 border border-[#E8DFC9]/40 dark:border-[#C9A84C]/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-inner">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-white dark:bg-black rounded-lg border border-gray-100 dark:border-zinc-800 text-[#C9A84C] shrink-0 shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-gray-900 dark:text-white mb-1">EASCCA Conference Centre</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Main Highway Road, Eravur, Sri Lanka.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-[#C9A84C] font-bold uppercase tracking-widest bg-white dark:bg-black border border-[#E8DFC9] dark:border-zinc-800 px-3 py-1.5 rounded-sm shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" /> Luxury Partner Venue
        </div>
      </div>

    </div>
  );
}
