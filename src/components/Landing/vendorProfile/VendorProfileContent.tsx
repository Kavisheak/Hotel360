"use client";

import React, { useState } from "react";
import { Vendor } from "@/components/landing/vendors/types";
import Image from "next/image";
import { CheckCircle, MapPin, Star, Calendar, Truck } from "lucide-react";

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
      <div className="flex-1 space-y-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#E8DFC9] overflow-x-auto pb-[-1px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs tracking-widest uppercase font-bold whitespace-nowrap transition-colors border-b-2 relative top-px
                ${activeTab === tab.id 
                  ? "border-[#1A1512] text-[#1A1512]" 
                  : "border-transparent text-gray-400 hover:text-[#1A1512]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="min-h-100">
          
          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <section className="space-y-4">
                <h3 className="text-2xl font-serif text-[#1A1512]">About {vendor.name}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {vendor.description}
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  {vendor.specialties.map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-[#FAF6EE] text-[#7C6A2E] text-xs font-semibold px-3 py-1.5 border border-[#E8DFC9] rounded-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-serif text-[#1A1512]">Location</h3>
                <div className="bg-white border border-[#E8DFC9] p-6 rounded-sm shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-[#FAF6EE] rounded-sm shrink-0">
                    <MapPin className="w-6 h-6 text-[#C69C6D]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1512]">Main Studio</h4>
                    <p className="text-gray-500 text-sm mt-1">
                      {((vendor as any).location) || "75/1 Barnes Place, Colombo 07, Sri Lanka"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Visits by appointment only.</p>
                  </div>
                </div>
                {/* Embedded Map Dummy */}
                <div className="w-full h-48 bg-gray-200 rounded-sm relative overflow-hidden flex items-center justify-center border border-[#E8DFC9]">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Map View</span>
                </div>
              </section>
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === "portfolio" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {vendor.portfolio.map((img, i) => (
                <div key={i} className="relative aspect-square bg-[#E8DFC9]/30 rounded-sm overflow-hidden group">
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
                <div key={i} className="bg-white border border-[#E8DFC9] p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div>
                      <h4 className="text-xl font-serif text-[#1A1512]">{pkg.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold block mb-1">Package Price</span>
                      <span className="text-2xl font-bold text-[#1A1512]">{pkg.price}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#C69C6D] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-[#E8DFC9]">
                    <button className="w-full md:w-auto px-6 py-2.5 bg-black text-white text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#C69C6D] transition-colors">
                      Inquire About This Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#E8DFC9]">
                <div className="flex flex-col items-center justify-center bg-[#FAF6EE] w-24 h-24 rounded-sm border border-[#E8DFC9]">
                  <span className="text-3xl font-serif text-[#1A1512]">{vendor.rating}</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3 h-3 ${i < Math.floor(vendor.rating) ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-serif">Overall Rating</h4>
                  <p className="text-sm text-gray-500">Based on {vendor.reviewsCount} verified bookings</p>
                </div>
              </div>

              {vendor.reviews.map((review, i) => (
                <div key={i} className="bg-white border border-[#E8DFC9] p-6 rounded-sm shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-[#1A1512]">{review.client}</h5>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, idx) => (
                          <svg key={idx} className={`w-3 h-3 ${idx < review.rating ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Verified Booker</span>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 shrink-0 space-y-6">
        <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-6 rounded-sm shadow-sm space-y-6 sticky top-28">
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Vendor Summary</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-[#E8DFC9] pb-2">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-[#1A1512]">{vendor.categoryLabel}</span>
              </li>
              <li className="flex justify-between border-b border-[#E8DFC9] pb-2">
                <span className="text-gray-500">Response Time</span>
                <span className="font-semibold text-[#1A1512]">~24 Hours</span>
              </li>
              <li className="flex justify-between border-b border-[#E8DFC9] pb-2">
                <span className="text-gray-500">Deposit Req.</span>
                <span className="font-semibold text-[#1A1512]">50%</span>
              </li>
              <li className="flex justify-between pb-2">
                <span className="text-gray-500">Cancellation</span>
                <span className="font-semibold text-[#1A1512]">Flexible</span>
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
            <CheckCircle className="w-4 h-4 text-[#C69C6D]" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Verified Vendor</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4 text-[#C69C6D]" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{vendor.reviewsCount} Reviews</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#C69C6D]" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{((vendor as any).eventsCompleted) || "120+"} Events Completed</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-[#C69C6D]" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Available Island-wide</span>
          </div>
        </div>
      </div>
    </div>
  );
}
