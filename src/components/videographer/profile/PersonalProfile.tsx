"use client";

import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';

const PersonalProfile = () => {
  const [formData, setFormData] = useState({
    fullName: 'Amaan Khan',
    email: 'amaan.khan@hotel360video.com',
    phone: '+1 (555) 000-0000',
    experience: '10',
    specialty: 'Cinematic Event Coverage',
    website: 'https://portfolio.hotel360video.com',
    instagram: '@amaan_khan_frames',
    youtube: 'youtube.com/@amaan_khan_frames',
    bio: 'Amaan specializes in polished event storytelling, with a focus on cinematic pacing, clean audio, and fast-turnaround highlight edits for premium celebrations.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
          <User size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">PERSONAL PROFILE</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Field label="FULL NAME" name="fullName" value={formData.fullName} onChange={handleChange} />
          <Field label="EMAIL ADDRESS" name="email" value={formData.email} onChange={handleChange} />
          <Field label="PHONE NUMBER" name="phone" value={formData.phone} onChange={handleChange} />
          <Field label="YEARS OF EXPERIENCE" name="experience" value={formData.experience} onChange={handleChange} />
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">VIDEOGRAPHY SPECIALTY</label>
            <div className="relative">
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
              >
                <option>Cinematic Event Coverage</option>
                <option>Multi-Camera Live Production</option>
                <option>Highlight Reel Editing</option>
                <option>Drone and Aerial Capture</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <Field label="WEBSITE / PORTFOLIO URL" name="website" value={formData.website} onChange={handleChange} />
        </div>

        <div className="border-t border-gray-100 pt-5 mb-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-4">SOCIAL LINKS</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="INSTAGRAM HANDLE" name="instagram" value={formData.instagram} onChange={handleChange} />
            <Field label="YOUTUBE CHANNEL" name="youtube" value={formData.youtube} onChange={handleChange} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">PROFESSIONAL BIO</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C] resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Field = ({ label, name, value, onChange }: FieldProps) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
    />
  </div>
);

export default PersonalProfile;
