"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Camera } from 'lucide-react';

interface ProfileSettingsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ProfileSettings = ({ formData, handleChange }: ProfileSettingsProps) => {

  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
          <Camera size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">PROFILE ARTISTRY</h3>
        </div>

        <div className="flex flex-col gap-6 border-b border-gray-100 pb-6 mb-6 md:flex-row md:items-center">
          <div className="relative h-28 w-28 overflow-hidden border border-[#E0D8C3] bg-[#FDF9F1]">
            <Image
              src="/images/05.png"
              alt="DJ profile portrait"
              fill
              sizes="112px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-black/25 px-2 py-1 text-white">
              <Camera size={12} />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-[28px] font-serif text-gray-900 mb-2">Profile Artistry</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              Manage how your brand is perceived by elite clients and booking partners.
            </p>
            <button className="mt-4 border border-[#B08D2C] px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#7C6A2E] uppercase transition-colors hover:bg-[#FDF9F1]">
              Replace Media
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Artist Stage Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Specialization</label>
            <div className="relative">
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
              >
                <option value="Bespoke Weddings">Bespoke Weddings</option>
                <option value="Luxury Corporate">Luxury Corporate</option>
                <option value="Private Residencies">Private Residencies</option>
                <option value="Destination Events">Destination Events</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Curated Bio</label>
          <textarea
            name="bio"
            rows={5}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C] resize-none leading-relaxed"
          />
        </div>
      </div>
    </article>
  );
};

export default ProfileSettings;
