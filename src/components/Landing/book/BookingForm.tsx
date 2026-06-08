"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  selectedDate: number;
}

export default function BookingForm({ selectedDate }: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate === 0) {
      alert("Please select an available event date (Step 1) before submitting.");
      return;
    }
    // In a real app, this would submit to API
    alert("Date Hold Request Submitted. The Concierge will contact you shortly.");
    router.push("/customer/home");
  };

  return (
    <div className="space-y-6 hover-glow p-4 rounded-sm transition-all duration-300">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5 mb-2">
        <User className="w-4 h-4 text-[#C9A84C]" /> Step 6: Primary Contact Details
      </label>

      <form onSubmit={handleSubmit} className="bg-white border border-[#D4C9A8] p-6 lg:p-8 space-y-6 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">First Name</label>
            <input 
              required
              type="text" 
              className="w-full border-b border-[#D4C9A8] bg-transparent py-2 text-sm focus:border-[#C9A84C] outline-none transition-colors input-glow"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Last Name</label>
            <input 
              required
              type="text" 
              className="w-full border-b border-[#D4C9A8] bg-transparent py-2 text-sm focus:border-[#C9A84C] outline-none transition-colors input-glow"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full border-b border-[#D4C9A8] bg-transparent py-2 text-sm focus:border-[#C9A84C] outline-none transition-colors input-glow"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Phone Number</label>
            <input 
              required
              type="tel" 
              className="w-full border-b border-[#D4C9A8] bg-transparent py-2 text-sm focus:border-[#C9A84C] outline-none transition-colors input-glow"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Special Requests / Notes</label>
          <textarea 
            rows={3}
            className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/30 p-3 text-sm focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
            placeholder="Any initial thoughts on theme, specific cultural requirements, etc."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          ></textarea>
        </div>

        <div className="pt-4 border-t border-[#F0E6D0]">
          <button 
            type="submit"
            className="w-full bg-[#C9A84C] text-[#2C1E14] py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#B89238] transition-colors rounded-sm btn-interactive"
          >
            Request 48-Hour Date Hold
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
            No payment required until formal contract signing.
          </p>
        </div>
      </form>
    </div>
  );
}
