"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Crown, CalendarDays, Shield, User, Pencil } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { USER_PROFILE } from "./types";
import { getImageUrl } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TIER_STYLES = {
  silver: { label: "Silver Member", bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" },
  gold: { label: "Gold Member", bg: "bg-[#C9A84C]/10", text: "text-[#C9A84C]", border: "border-[#C9A84C]/30" },
  diamond: { label: "Diamond Member", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
};

export default function AccountOverview() {
  const { user: authUser } = useAuthStore();
  
  // Merge backend data with dummy static properties for UI purposes
  const user = {
    ...USER_PROFILE,
    firstName: authUser?.firstName || USER_PROFILE.firstName,
    lastName: authUser?.lastName || USER_PROFILE.lastName,
    email: authUser?.email || USER_PROFILE.email,
    phone: authUser?.phone || USER_PROFILE.phone,
    address: authUser?.address || "Address not set",
    city: authUser?.city || "City not set",
    memberSince: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : USER_PROFILE.memberSince,
  };

  const tier = TIER_STYLES[user.tier];

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#C9A84C]/30 rounded-lg shadow-[0_4px_20px_rgba(201,168,76,0.15)] hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      {/* Cover Banner */}
      <div className="h-28 relative bg-[#FDFBF7] dark:bg-[#1A1A1A]">
        <Image src="/luxury_ballroom_bg.png" alt="Banner" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover opacity-60 dark:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Avatar & Info */}
      <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-12 z-10">
        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#111111] shadow-lg overflow-hidden bg-white dark:bg-[#1A1A1A] flex-shrink-0 mb-4 relative flex items-center justify-center">
          {authUser?.avatar ? (
            <Image
              src={getImageUrl(authUser.avatar)}
              alt={`${user.firstName} ${user.lastName}`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
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
            <div className="w-7 h-7 rounded-full border border-[#E8DFC9] dark:border-[#C9A84C]/20 bg-white dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5 text-[#C9A84C]" strokeWidth={1.5} />
            </div>
            <span className="font-medium tracking-wide">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 rounded-full border border-[#E8DFC9] dark:border-[#C9A84C]/20 bg-white dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-[#C9A84C]" strokeWidth={1.5} />
            </div>
            <span className="font-medium tracking-wide">{user.phone}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 rounded-full border border-[#E8DFC9] dark:border-[#C9A84C]/20 bg-white dark:bg-[#1A1A1A] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" strokeWidth={1.5} />
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
