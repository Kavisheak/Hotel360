import React from "react";
import Image from "next/image";
import { MapPin, Star, Phone, Mail, Award, Clock } from "lucide-react";
import { Vendor } from "@/components/landing/vendors/types";

interface VendorProfileHeroProps {
  vendor: Vendor;
}

export default function VendorProfileHero({ vendor }: VendorProfileHeroProps) {
  return (
    <div className="relative w-full h-[50vh] min-h-100 bg-black">
      {/* Background Cover Image */}
      <div className="absolute inset-0">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1A1512] via-[#1A1512]/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full px-6 pb-12 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
          
          {/* Profile Details */}
          <div className="flex-1 text-white space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#C69C6D] text-black px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-sm">
                {vendor.categoryLabel}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold bg-white/10 px-3 py-1 rounded-sm backdrop-blur-md">
                <Star className="w-4 h-4 text-[#C69C6D] fill-[#C69C6D]" />
                {vendor.rating} ({vendor.reviewsCount} Reviews)
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
              {vendor.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C69C6D]" />
                <span>{((vendor as any).location) || "Colombo 07, Sri Lanka"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C69C6D]" />
                <span>{((vendor as any).contactPhone) || "+94 77 123 4567"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C69C6D]" />
                <span>{((vendor as any).contactEmail) || "contact@vendor.com"}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex flex-col gap-3">
            <button className="bg-[#C69C6D] text-black px-8 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors rounded-sm shadow-xl">
              Request a Quote
            </button>
            <button className="bg-transparent border border-white/30 text-white px-8 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-white/10 transition-colors rounded-sm">
              Save to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
