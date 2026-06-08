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
    <div className="bg-white border border-[#D4C9A8] rounded-sm shadow-sm hover-glow transition-all duration-300 overflow-hidden">
      {/* Cover Banner */}
      <div className="h-24 bg-gradient-to-r from-[#2C1E14] via-[#3D2B1E] to-[#2C1E14] relative">
        <div className="absolute inset-0 bg-[url('/gold_package.png')] bg-cover bg-center opacity-15" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Avatar & Info */}
      <div className="px-6 pb-6 -mt-10 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-[#F0E6D0] flex-shrink-0">
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="pb-1">
            <h3 className="text-lg font-serif text-[#2C1E14] leading-tight">
              {user.firstName} {user.lastName}
            </h3>
            <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm mt-1 ${tier.bg} ${tier.text} border ${tier.border}`}>
              <Crown className="w-2.5 h-2.5" />
              {tier.label}
            </span>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-gray-500">
            <Mail className="w-3.5 h-3.5 text-[#A67C52]" />
            <span className="font-light">{user.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500">
            <Phone className="w-3.5 h-3.5 text-[#A67C52]" />
            <span className="font-light">{user.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-[#A67C52]" />
            <span className="font-light">{user.address}, {user.city}</span>
          </div>
        </div>

        {/* Meta Row */}
        <div className="mt-4 pt-3 border-t border-[#F0E6D0] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
            <CalendarDays className="w-3 h-3" />
            Member since {user.memberSince}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}
