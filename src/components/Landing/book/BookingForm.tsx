"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Send, CheckCircle2 } from "lucide-react";

interface BookingFormProps {
  selectedDate: number;
  selectedTimeslot: string;
  selectedPkg: string;
  guestCount: number;
  grandTotal: number;
  formatCurrency: (val: number) => string;
}

export default function BookingForm({
  selectedDate,
  selectedTimeslot,
  selectedPkg,
  guestCount,
  grandTotal,
  formatCurrency
}: BookingFormProps) {
  const [coupleDetails, setCoupleDetails] = useState({
    partner1: "",
    partner2: "",
    email: "",
    phone: "",
    visionNotes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleDetails.partner1 || !coupleDetails.partner2 || !coupleDetails.email || !coupleDetails.phone) {
      alert("Please enter all required fields (*).");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setCoupleDetails({
      partner1: "",
      partner2: "",
      email: "",
      phone: "",
      visionNotes: ""
    });
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white border border-[#E8DFC9] p-6 shadow-md rounded-sm">
      {!isSubmitted ? (
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          <div className="flex items-center gap-1.5 text-[#A6955C] mb-2">
            <CalendarIcon className="w-4 h-4 text-[#c69c6d]" />
            <h4 className="text-[10px] uppercase tracking-widest font-bold">Secure Your Reservation</h4>
          </div>
          
          <p className="text-[11px] text-gray-500 leading-normal font-light">
            Transmit this configured date, timeslot, and guest size configuration to our concierge office to lock in your hold.
          </p>

          <div className="space-y-3.5 border-t border-[#FAF6EE] pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Partner 1 Name *</label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={coupleDetails.partner1}
                  onChange={(e) => setCoupleDetails({...coupleDetails, partner1: e.target.value})}
                  className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Partner 2 Name *</label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={coupleDetails.partner2}
                  onChange={(e) => setCoupleDetails({...coupleDetails, partner2: e.target.value})}
                  className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Couple Email Address *</label>
              <input
                type="email"
                required
                placeholder="weddings@mail.com"
                value={coupleDetails.email}
                onChange={(e) => setCoupleDetails({...coupleDetails, email: e.target.value})}
                className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                placeholder="+94 XX XXX XXXX"
                value={coupleDetails.phone}
                onChange={(e) => setCoupleDetails({...coupleDetails, phone: e.target.value})}
                className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Additional Curation Directives</label>
              <textarea
                rows={3}
                placeholder="Preferred color schemas, traditional oil lamp requirements, high-end visual or specific catering needs..."
                value={coupleDetails.visionNotes}
                onChange={(e) => setCoupleDetails({...coupleDetails, visionNotes: e.target.value})}
                className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm placeholder:text-gray-400 font-sans resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A1512] text-white hover:bg-[#c69c6d] hover:text-black py-3.5 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Securing Reservation Date...</span>
              ) : (
                <>
                  <span>Transmit Secure Booking</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 px-2 space-y-5">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-2xl font-serif text-gray-900 leading-tight">Reservation Secured</h4>
          <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
            Congratulations, <strong>{coupleDetails.partner1} &amp; {coupleDetails.partner2}</strong>. We have registered your holding reservation for <strong>June {selectedDate}, 2026</strong>.
          </p>

          <div className="border border-[#E8DFC9] bg-[#FAF6EE] p-4 text-left text-xs space-y-2 rounded-sm max-w-xs mx-auto">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium uppercase text-[8px] tracking-wider">Booking Ref:</span>
              <strong className="text-gray-900">EASCC-2026-X81A</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium uppercase text-[8px] tracking-wider">Timeslot:</span>
              <span className="font-semibold text-gray-800 capitalize">{selectedTimeslot} Set</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium uppercase text-[8px] tracking-wider">Package / Pax:</span>
              <span className="font-semibold text-gray-800 capitalize">{selectedPkg} / {guestCount} Guests</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-gray-200">
              <span className="text-gray-800 font-bold uppercase text-[8px] tracking-wider">Hold Deposit:</span>
              <strong className="text-[#7C6A2E]">{formatCurrency(grandTotal * 0.25)}</strong>
            </div>
          </div>

          <div className="space-y-2 text-[10px] text-gray-500 font-light max-w-xs mx-auto leading-normal">
            <p>1. To finalize this hold, your 25% reservation deposit must be submitted within <strong>48 hours</strong>.</p>
            <p>2. Transfer details and deposit instructions have been dispatched to <strong>{coupleDetails.email}</strong>.</p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleReset}
              className="border border-[#1A1512] text-[#1A1512] px-6 py-2.5 hover:bg-[#1A1512] hover:text-white transition-all duration-300 text-[9px] uppercase font-bold tracking-widest rounded-sm"
            >
              Book Another Date
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
