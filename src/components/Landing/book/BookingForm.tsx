"use client";

import React, { useState } from "react";
import { User, CreditCard, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  selectedDate: number;
  onSubmitBooking: (contact: any) => void;
}

export default function BookingForm({ selectedDate, onSubmitBooking }: BookingFormProps) {
  const router = useRouter();
  
  // Pre-filled mock profile data
  const [formData, setFormData] = useState({
    firstName: "Farhan",
    lastName: "Ahmed",
    email: "farhan@example.com",
    phone: "+94 77 123 4567",
    notes: ""
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate === 0) {
      alert("Please go back to Step 1 and select an available event date.");
      return;
    }
    
    if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
      alert("Please enter payment details to secure your booking.");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      onSubmitBooking(formData);
      alert("Booking Confirmed & Payment Processed! The Concierge will contact you shortly.");
      router.push("/customer/home");
    }, 1500);
  };

  return (
    <div className="space-y-8 hover-glow p-4 md:p-6 rounded-sm transition-all duration-300 bg-white dark:bg-[#111111] border border-[#D4C9A8] dark:border-[#C9A84C]/20 shadow-[0_0_20px_rgba(128,93,58,0.05)] dark:shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#805D3A] dark:text-[#C9A84C] font-bold flex items-center gap-1.5 border-b border-[#D4C9A8] dark:border-[#C9A84C]/30 pb-3 mb-4">
        <User className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C]" /> Step 4: Details & Checkout
      </label>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Contact Details */}
        <div className="space-y-6">
          <h4 className="text-sm font-serif font-semibold text-[#2C1E14] dark:text-white">Primary Contact (Auto-filled)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">First Name</label>
              <input 
                required
                type="text" 
                className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-sm text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Last Name</label>
              <input 
                required
                type="text" 
                className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-sm text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-sm text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Phone Number</label>
              <input 
                required
                type="tel" 
                className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-sm text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Special Requests / Notes</label>
            <textarea 
              rows={3}
              className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] p-3 text-sm text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
              placeholder="Any initial thoughts on theme, specific cultural requirements, etc."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="h-px bg-[#D4C9A8] dark:bg-[#C9A84C]/20 w-full"></div>

        {/* Payment Details */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-semibold text-[#2C1E14] dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C]" /> Secure Payment
            </h4>
            <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold tracking-widest uppercase">
              <Lock className="w-3 h-3" /> SSL Secured
            </div>
          </div>

          <div className="bg-[#F0E6D0] dark:bg-[#1A1A1A] p-5 border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm space-y-5 shadow-inner">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Card Number</label>
              <input 
                required
                type="text" 
                placeholder="0000 0000 0000 0000"
                className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white px-3 py-2 text-sm focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                value={paymentDetails.cardNumber}
                onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Expiry Date</label>
                <input 
                  required
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white px-3 py-2 text-sm focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                  value={paymentDetails.expiry}
                  onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">CVV</label>
                <input 
                  required
                  type="password" 
                  placeholder="***"
                  maxLength={4}
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white px-3 py-2 text-sm focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm input-glow"
                  value={paymentDetails.cvv}
                  onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D4C9A8] dark:border-[#C9A84C]/20">
          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-300 rounded-sm shadow-md ${isProcessing ? 'bg-gray-800 text-gray-600 dark:text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] hover-glow btn-interactive'}`}
          >
            {isProcessing ? "Processing Secure Payment..." : "Confirm Booking & Pay"}
          </button>
          <p className="text-center text-[10px] text-gray-600 dark:text-gray-500 mt-4 uppercase tracking-widest">
            By confirming, you agree to the EASCC Reservation Terms & Conditions.
          </p>
        </div>
      </form>
    </div>
  );
}
