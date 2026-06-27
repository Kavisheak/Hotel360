"use client";

import React, { useState } from "react";
import { Vendor } from "@/components/Landing/vendors/types";
import Image from "next/image";
import { CheckCircle, MapPin, Star, Calendar, Truck, Headphones } from "lucide-react";

interface VendorProfileContentProps {
  vendor: Vendor;
}

export default function VendorProfileContent({ vendor }: VendorProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "packages" | "reviews">("about");

  const tabs = [
    { id: "about", label: "About & Location" },
    { id: "portfolio", label: "Portfolio" },
    { id: "packages", label: "Packages" },
    { id: "reviews", label: `Reviews (${vendor.reviewsCount})` },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#E8DFC9] dark:border-white/10 overflow-x-auto pb-[1px] mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[11px] tracking-[0.1em] uppercase font-bold whitespace-nowrap transition-colors relative
                ${activeTab === tab.id 
                  ? "text-[#1A1512] dark:text-[#C69C6D]" 
                  : "text-gray-400 hover:text-[#1A1512] dark:hover:text-gray-300"}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#1A1512] dark:bg-[#C69C6D]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="min-h-100">
          
          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <section className="space-y-4">
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">About {vendor.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-3xl">
                  {vendor.description}
                </p>
                <div className="pt-4 flex flex-wrap gap-3">
                  {vendor.specialties.map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-[#FAF6EE] dark:bg-transparent text-[#A6955C] dark:text-[#C69C6D] text-[10px] font-bold tracking-widest uppercase px-4 py-2 border border-[#E8DFC9] dark:border-[#C69C6D]/30 rounded-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">Location</h3>
                <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-6 rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FAF6EE] dark:bg-black rounded-sm shrink-0 border border-[#E8DFC9]/50 dark:border-white/5">
                      <MapPin className="w-5 h-5 text-[#C69C6D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1512] dark:text-white">Main Studio</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {((vendor as any).location) || "75/1 Barnes Place, Colombo 07, Sri Lanka"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Visits by appointment only.</p>
                    </div>
                  </div>
                  <button className="shrink-0 px-6 py-2 border border-[#E8DFC9] dark:border-white/10 text-[#C69C6D] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    Get Directions
                  </button>
                </div>
                {/* Embedded Map Dummy */}
                <div className="w-full h-[300px] bg-[#FAF6EE]/50 dark:bg-[#111315] rounded-sm relative overflow-hidden flex flex-col items-center justify-center border border-[#E8DFC9] dark:border-white/10">
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                  <MapPin className="w-10 h-10 text-[#C69C6D] relative z-10 drop-shadow-md mb-2" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 relative z-10">Map View</span>
                </div>
              </section>
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === "portfolio" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {vendor.portfolio.map((img, i) => (
                <div key={i} className="relative aspect-square bg-[#E8DFC9]/30 dark:bg-white/5 rounded-sm overflow-hidden group">
                  <Image 
                    src={img} 
                    alt={`${vendor.name} portfolio ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === "packages" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {vendor.packages.map((pkg, i) => (
                <div key={i} className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div>
                      <h4 className="text-xl font-serif text-[#1A1512] dark:text-white">{pkg.name}</h4>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold block mb-1">Package Price</span>
                      <span className="text-2xl font-bold text-[#1A1512] dark:text-white">{pkg.price}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#C69C6D] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-[#E8DFC9] dark:border-white/10">
                    <button className="w-full md:w-auto px-6 py-2.5 border border-[#1A1512] dark:border-white text-[#1A1512] dark:text-white text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#1A1512] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                      Inquire About This Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8DFC9] dark:border-white/10 pb-6">
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">Customer Reviews & Feedback</h3>
                <button className="px-6 py-2 border border-[#E8DFC9] dark:border-white/10 text-[#C69C6D] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Write a Review
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* Overall Rating Card */}
                <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm shadow-sm flex flex-col justify-center min-w-[320px] shrink-0">
                  <div className="flex items-start gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-serif text-[#1A1512] dark:text-[#C69C6D] mb-2">{vendor.rating}</span>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(vendor.rating) ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 dark:text-gray-700 fill-gray-300 dark:fill-gray-700'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mb-1">Out of 5</p>
                      <p className="text-[10px] text-gray-400">Based on {vendor.reviewsCount} reviews</p>
                    </div>
                    
                    {/* Rating Breakdown */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      {[
                        { stars: 5, count: 82, width: "85%" },
                        { stars: 4, count: 10, width: "10%" },
                        { stars: 3, count: 3, width: "3%" },
                        { stars: 2, count: 1, width: "1%" },
                        { stars: 1, count: 0, width: "0%" }
                      ].map((row) => (
                        <div key={row.stars} className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-400 dark:text-gray-500 w-4 flex items-center gap-0.5">{row.stars} <Star className="w-2.5 h-2.5 fill-current" /></span>
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C69C6D] rounded-full" style={{ width: row.width }}></div>
                          </div>
                          <span className="text-gray-400 dark:text-gray-500 w-4 text-right">{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Horizontal Scrolling Reviews */}
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                  {vendor.reviews.map((review, i) => (
                    <div key={i} className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-6 rounded-sm shadow-sm space-y-4 min-w-[320px] max-w-[320px] shrink-0 snap-start flex flex-col">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#FAF6EE] dark:bg-black text-[#A6955C] flex items-center justify-center font-bold text-sm shrink-0 border border-[#E8DFC9] dark:border-[#C9A84C]/30">
                          {review.client.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h5 className="font-bold text-[#1A1512] dark:text-white text-sm">{review.client}</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5">Recent Booking</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 fill-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">"{review.text}"</p>
                      <div className="mt-4 pt-4 border-t border-[#E8DFC9] dark:border-white/10">
                        <span className="text-[9px] text-[#A6955C] border border-[#E8DFC9] dark:border-[#C9A84C]/30 bg-[#FAF6EE] dark:bg-black px-2 py-1 rounded-sm uppercase tracking-widest">
                          Verified Booker
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-[#FAF6EE] dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-white dark:bg-transparent rounded-full flex items-center justify-center shrink-0 border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-sm">
              <Headphones className="w-6 h-6 text-[#C69C6D]" />
            </div>
            <div>
              <h4 className="text-lg font-serif text-[#1A1512] dark:text-white mb-1">Have questions or planning an event?</h4>
              <p className="text-sm text-gray-500">Our team is here to help you create unforgettable moments.</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-[#C69C6D] text-white px-8 py-3.5 text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#B58B5C] transition-colors shrink-0 shadow-md">
            Contact Vendor
          </button>
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 shrink-0">
        <div className="space-y-6 sticky top-28">
          <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-6 rounded-sm shadow-sm space-y-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">Vendor Summary</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-[#1A1512] dark:text-white">{vendor.categoryLabel}</span>
                </li>
                <li className="flex justify-between border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                  <span className="text-gray-500">Response Time</span>
                  <span className="font-semibold text-[#1A1512] dark:text-white">~24 Hours</span>
                </li>
                <li className="flex justify-between border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                  <span className="text-gray-500">Deposit Req.</span>
                  <span className="font-semibold text-[#1A1512] dark:text-white">50%</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-gray-500">Cancellation</span>
                  <span className="font-semibold text-[#1A1512] dark:text-white">Flexible</span>
                </li>
              </ul>
            </div>
            
            <button className="w-full bg-[#C69C6D] text-white py-3.5 text-[10px] uppercase font-bold tracking-widest rounded-sm shadow-md hover:bg-[#B58B5C] transition-colors">
              Contact Vendor
            </button>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4 px-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Verified Vendor</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{vendor.reviewsCount} Reviews</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{((vendor as any).eventsCompleted) || "120+"} Events Completed</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Available Island-wide</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
