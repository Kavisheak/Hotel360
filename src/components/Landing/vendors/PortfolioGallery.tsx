"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Star, X, ExternalLink, ArrowRight } from "lucide-react";
import { Vendor } from "./types";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";

interface PortfolioGalleryProps {
  vendors: Vendor[];
  isGuest?: boolean;
}

interface PortfolioItem {
  imageUrl: string;
  vendor: Vendor;
  imgIndex: number;
}

export default function PortfolioGallery({ vendors, isGuest = true }: PortfolioGalleryProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");

  const handleRestrictedAction = useCallback((message: string, action: () => void) => {
    if (isGuest) {
      setLoginModalMessage(message);
      setLoginModalOpen(true);
    } else {
      action();
    }
  }, [isGuest]);

  // Flatten all vendor portfolio images into a single list
  const allImages: PortfolioItem[] = vendors.flatMap((vendor) =>
    vendor.portfolio.map((imageUrl, imgIndex) => ({ imageUrl, vendor, imgIndex }))
  );

  if (allImages.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No portfolios found. Try adjusting your filters.</p>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Section intro */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C69C6D] font-bold block mb-2">Visual Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A1512] dark:text-white">
              Browse by <span className="italic text-[#C69C6D]">Work Quality</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg font-light leading-relaxed">
              Explore curated work from all our verified partners. Click any image to discover the vendor behind it.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#C69C6D] animate-pulse"></span>
            {allImages.length} Portfolio Images
          </div>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {allImages.map((item, i) => {
            const key = `${item.vendor.id}-${item.imgIndex}`;
            const isHov = hovered === key;
            return (
              <div
                key={key}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm mb-3"
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLightbox(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={`${item.vendor.name} portfolio`}
                  loading="lazy"
                  className={`w-full h-auto object-cover transition-transform duration-700 ${isHov ? "scale-105" : "scale-100"}`}
                />

                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${isHov ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#C69C6D] font-bold block mb-1">
                      {item.vendor.categoryLabel}
                    </span>
                    <h4 className="text-white font-serif text-sm leading-tight">{item.vendor.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-[#C69C6D] fill-current" />
                      <span className="text-[10px] text-gray-300">{item.vendor.rating} · {item.vendor.reviewsCount} events</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[9px] text-[#C69C6D] uppercase font-bold tracking-widest">
                      <span>View Portfolio</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative bg-white dark:bg-[#111111] rounded-sm overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 min-h-[300px] md:min-h-[500px] relative bg-black overflow-hidden">
              <img
                src={lightbox.imageUrl}
                alt={`${lightbox.vendor.name} portfolio`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Vendor Info Panel */}
            <div className="w-full md:w-72 shrink-0 p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#E8DFC9] dark:border-white/10">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C69C6D] font-bold block mb-3">
                  {lightbox.vendor.categoryLabel}
                </span>
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-3">
                  {lightbox.vendor.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(lightbox.vendor.rating) ? "text-[#C69C6D] fill-current" : "text-gray-300 fill-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{lightbox.vendor.rating} ({lightbox.vendor.reviewsCount} reviews)</span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light mb-4 line-clamp-4">
                  {lightbox.vendor.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {lightbox.vendor.specialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[9px] uppercase tracking-widest font-bold text-[#C69C6D] border border-[#E8DFC9] dark:border-[#C69C6D]/30 px-2 py-1 rounded-sm bg-[#FAF6EE] dark:bg-transparent"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="bg-[#FAF6EE] dark:bg-black/40 border border-[#E8DFC9] dark:border-white/10 p-3 rounded-sm">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Starting From</span>
                  <span className="text-[#C69C6D] font-bold text-lg">{lightbox.vendor.startingPrice}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() =>
                    handleRestrictedAction(
                      "Please log in to select this vendor for your booking.",
                      () => router.push(`/book?${lightbox.vendor.category}=${lightbox.vendor.id}`)
                    )
                  }
                  className="w-full bg-[#1A1512] hover:bg-black text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  Add Vendor to Booking
                </button>
                <button
                  onClick={() =>
                    handleRestrictedAction(
                      "Please log in to explore full vendor portfolios.",
                      () => router.push(`/customer/vendorProfile/${lightbox.vendor.id}`)
                    )
                  }
                  className="w-full bg-[#C69C6D] hover:bg-[#B58B5C] text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  View Full Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightbox(null)}
                  className="w-full border border-[#E8DFC9] dark:border-white/10 text-gray-500 dark:text-gray-400 px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginRequiredModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message={loginModalMessage}
      />
    </>
  );
}
