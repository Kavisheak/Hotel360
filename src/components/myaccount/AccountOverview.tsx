"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Crown, CalendarDays, Shield } from "lucide-react";
import { USER_PROFILE } from "./types";

const TIER_STYLES = {
  silver: { label: "Silver Member", bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" },
  gold: { label: "Gold Member", bg: "bg-[#C9A84C]/10", text: "text-[#C9A84C]", border: "border-[#C9A84C]/30" },
  diamond: { label: "Diamond Member", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
};

export default function AccountOverview() {
  const user = USER_PROFILE;
  const tier = TIER_STYLES[user.tier];

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Cover Banner */}
      <div className="h-28 relative bg-[#FDFBF7] dark:bg-[#1A1A1A]">
        <Image src="/luxury_ballroom_bg.png" alt="Banner" fill className="object-cover opacity-60 dark:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Avatar & Info */}
      <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-12 z-10">
        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#111111] shadow-lg overflow-hidden bg-white dark:bg-[#1A1A1A] flex-shrink-0 mb-4 relative group">
          <Image
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        
        <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-2">
          {user.firstName} {user.lastName}
        </h3>
        
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-sm mb-6 ${tier.bg} ${tier.text} border ${tier.border}`}>
          <Crown className="w-3 h-3" />
          {tier.label}
        </span>

        {/* Contact Details */}
        <div className="space-y-3.5 text-xs w-full text-left pt-6 pb-2">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <Mail className="w-3 h-3 text-[#C69C6D]" />
            </div>
            <span className="font-medium tracking-wide">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <Phone className="w-3 h-3 text-[#C69C6D]" />
            </div>
            <span className="font-medium tracking-wide">{user.phone}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-3 h-3 text-[#C69C6D]" />
            </div>
            <span className="font-medium tracking-wide leading-relaxed">{user.address},<br/>{user.city}</span>
          </div>
        </div>

        {/* Meta Row */}
        <div className="w-full pt-5 mt-4 border-t border-[#E8DFC9] dark:border-gray-800 flex items-center justify-between">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase">
            Since {user.memberSince}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}
