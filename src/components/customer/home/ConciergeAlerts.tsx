"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckSquare, ArrowRight } from 'lucide-react';

export default function ConciergeAlerts() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Food Menu Confirmation Required",
      desc: "Please review and finalize your selected menu options with your concierge by tomorrow evening.",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Bank Installment Receipt Vetted",
      desc: "Concierge office has approved your installment payment of LKR 1,200,000.",
      time: "Yesterday"
    }
  ]);

  const handleDismissNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {/* Notifications Card */}
      <div className="bg-[#2C1E14] text-white border border-[#C9A84C]/20 p-6 shadow-2xl rounded-sm hover-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-[#C9A84C] flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" /> Concierge Directives
          </h3>
          {notifications.length > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="py-6 text-center border-t border-white/10 text-gray-400">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-light">All caught up! No new directives.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="pb-4 border-b border-white/10 last:border-0 last:pb-0 p-2 rounded-sm transition-colors duration-200 -mx-2 group relative">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="text-xs font-bold text-[#F0E6D0] pr-6">{notif.title}</h4>
                  <span className="text-[8px] text-gray-500 font-semibold shrink-0 uppercase tracking-wider">{notif.time}</span>
                </div>
                <p className="text-[11px] text-gray-400 font-light mt-1.5 leading-normal pr-4">
                  {notif.desc}
                </p>
                <button 
                  onClick={() => handleDismissNotif(notif.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all btn-interactive"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Resources / Tips */}
      <div className="bg-[#F0E6D0] border border-[#D4C9A8] p-5 rounded-sm hover-glow transition-all duration-300 mt-6">
        <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#C9A84C] block mb-1">Planning Guide</span>
        <h4 className="text-sm font-serif font-semibold text-gray-900 mb-2">Did you know?</h4>
        <p className="text-xs font-light text-gray-500 leading-normal">
          EASCC collaborates directly with premium verified decorators, photographers, and local florists. You can select your creative team directly through your dashboard to link culinary and setup timelines seamlessly.
        </p>
        <div className="mt-4">
          <Link 
            href="/customer/vendors"
            className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-[#C9A84C] hover:text-[#2C1E14] transition-colors"
          >
            <span>Browse Creative Vendors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
