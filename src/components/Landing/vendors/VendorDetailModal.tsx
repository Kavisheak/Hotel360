import React, { useState } from "react";
import Image from "next/image";
import { X, Star, Calendar, Users, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Vendor } from "./types";

interface VendorDetailModalProps {
  selectedVendor: Vendor;
  onClose: () => void;
}

export default function VendorDetailModal({ selectedVendor, onClose }: VendorDetailModalProps) {
  const [modalTab, setModalTab] = useState<"about" | "packages" | "reviews">("about");
  
  // Interactive Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    date: "",
    guests: "150",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      alert("Please fill in all required fields (Name, Email, Event Date).");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request and trigger custom success layout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-[#FAF6EE] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden border border-[#E8DFC9] flex flex-col md:flex-row max-h-[90vh]">
        
        {/* LEFT HALF: PORTFOLIO HERO & INQUIRY FORM */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto border-r border-[#E8DFC9] bg-[#FAF6EE]">
          <div className="space-y-5">
            
            {/* Header Back Link */}
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-xs text-[#7C6A2E] hover:text-black font-semibold uppercase tracking-widest"
            >
              <X className="w-4 h-4" /> Close Details
            </button>

            {/* Vendor Cover Image & Badge */}
            <div className="relative h-48 w-full bg-gray-200 border border-[#E8DFC9] rounded-sm overflow-hidden">
              <Image
                src={selectedVendor.image}
                alt={selectedVendor.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 text-[#C69C6D] text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1">
                {selectedVendor.categoryLabel}
              </div>
            </div>

            {/* Name & Title */}
            <div>
              <h2 className="text-2xl font-serif text-[#1A1512]">{selectedVendor.name}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#C69C6D] fill-[#C69C6D]" />
                  <span className="font-bold">{selectedVendor.rating}</span>
                  <span className="text-gray-400">({selectedVendor.reviewsCount} reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-[#A6955C] font-semibold uppercase tracking-wider text-[10px]">{selectedVendor.priceLevelLabel}</span>
              </div>
            </div>

            {/* Interactive Quote Booking Form Container */}
            <div className="border-t border-[#E8DFC9] pt-5">
              {!isSubmitted ? (
                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C69C6D]" /> Request Bespoke Consultation
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full bg-white border border-[#E0D8C3] px-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Your Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="client@gmail.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        className="w-full bg-white border border-[#E0D8C3] px-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                        className="w-full bg-white border border-[#E0D8C3] px-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Expected Guests</label>
                      <div className="relative">
                        <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="number"
                          value={bookingForm.guests}
                          onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                          className="w-full bg-white border border-[#E0D8C3] pl-8 pr-2.5 py-1.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Custom Requests / Vision</label>
                    <textarea
                      placeholder="Tell us about your visual/musical style requests..."
                      rows={2}
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                      className="w-full bg-white border border-[#E0D8C3] p-2.5 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm placeholder:text-gray-400 font-sans resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1512] text-white py-2.5 text-[9px] uppercase tracking-widest font-bold hover:bg-[#C69C6D] hover:text-black transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
                  >
                    {isSubmitting ? (
                      "Submitting to Concierge..."
                    ) : (
                      <>
                        Send Quote Inquiry
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-white border border-[#C69C6D]/35 p-5 text-center space-y-3 shadow-md rounded-sm animate-fadeIn">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-serif text-base text-gray-800">Inquiry Received</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                    Thank you, <strong className="text-black">{bookingForm.name || "Valued Client"}</strong>. Your booking inquiry details for <strong className="text-black">{bookingForm.date}</strong> have been logged.
                  </p>
                  <p className="text-[10px] text-[#A6955C] font-semibold uppercase tracking-wider leading-relaxed pt-2 border-t border-dashed border-gray-200">
                    Our Concierge and {selectedVendor.name} will reach out to you within 24 hours to schedule a consultation.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[9px] uppercase font-bold tracking-widest text-[#7C6A2E] hover:underline animate-pulse"
                  >
                    Submit another request
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT HALF: DETAILED PACKAGES, PORTFOLIO & REVIEWS TABS */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-white">
          <div className="space-y-6">
            
            {/* Modal Tab Controls */}
            <div className="flex border-b border-gray-200 pb-2 gap-4">
              {[
                { id: "about", label: "About & Portfolio" },
                { id: "packages", label: `Pricing Packages (${selectedVendor.packages.length})` },
                { id: "reviews", label: `Guest Reviews (${selectedVendor.reviews.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id as any)}
                  className={`pb-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-200 border-b-2 ${
                    modalTab === tab.id
                      ? "border-[#C69C6D] text-black"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content area */}
            <div className="space-y-4">
              
              {/* ABOUT TAB */}
              {modalTab === "about" && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">Signature Narrative</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {selectedVendor.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">Curated Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.specialties.map((spec, i) => (
                        <span 
                          key={i} 
                          className="bg-[#FAF6EE] text-[#7C6A2E] text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 border border-[#E8DFC9] rounded-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mini Image Portfolio */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">Signature Portfolio Clips</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedVendor.portfolio.map((img, i) => (
                        <div key={i} className="relative h-20 bg-gray-100 rounded-sm overflow-hidden border border-[#E8DFC9]">
                          <Image
                            src={img}
                            alt="Portfolio item"
                            fill
                            sizes="(max-width: 768px) 33vw, 150px"
                            className="object-cover hover:scale-110 transition-all duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PACKAGES TAB */}
              {modalTab === "packages" && (
                <div className="space-y-4 animate-fadeIn">
                  {selectedVendor.packages.map((pkg, idx) => (
                    <div key={idx} className="border border-[#E8DFC9] bg-[#FAF6EE] p-4 rounded-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-serif text-sm font-semibold text-[#1A1512]">{pkg.name}</h5>
                        <span className="text-xs font-bold text-[#7C6A2E] bg-white border border-[#E8DFC9] px-2 py-0.5">{pkg.price}</span>
                      </div>
                      
                      <ul className="space-y-1.5">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed font-light">
                            <ChevronRight className="w-3.5 h-3.5 text-[#C69C6D] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* REVIEWS TAB */}
              {modalTab === "reviews" && (
                <div className="space-y-4 animate-fadeIn">
                  {selectedVendor.reviews.map((rev, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-800">{rev.client}</span>
                        
                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-[#C69C6D] fill-[#C69C6D]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic leading-relaxed font-light">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* Close Button Footer */}
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-black text-white text-[9px] uppercase tracking-widest font-bold px-6 py-2.5 hover:bg-[#C69C6D] hover:text-black transition-colors rounded-sm"
            >
              Back to Directory
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
