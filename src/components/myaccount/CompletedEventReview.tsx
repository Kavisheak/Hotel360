"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Star, CheckCircle, Loader2, Camera, Music, Video } from "lucide-react";
import { reviewAPI } from "@/lib/reviewAPI";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface VendorInfo {
  service: "decorator" | "dj" | "videographer";
  vendorId: string;
  vendorName: string;
}

interface VendorRating {
  rating: number;
  reviewText: string;
  alreadyReviewed: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingRef?: string;
  eventName?: string;
  vendors: VendorInfo[]; // only vendors actually used in this booking
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  decorator: <Camera className="w-4 h-4" />,
  dj: <Music className="w-4 h-4" />,
  videographer: <Video className="w-4 h-4" />,
};

const SERVICE_LABELS: Record<string, string> = {
  decorator: "Decorator",
  dj: "DJ Artist",
  videographer: "Videographer",
};

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING SUB-COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function StarRow({
  label,
  rating,
  onChange,
  disabled,
}: {
  label: string;
  rating: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-[#C9A84C] text-[#C9A84C]"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CompletedEventReview({
  isOpen,
  onClose,
  bookingId,
  bookingRef,
  eventName,
  vendors,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"reviewing" | "success">("reviewing");
  const [isLoading, setIsLoading] = useState(true);  // loading existing reviews
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ratings[service] = { rating, reviewText, alreadyReviewed }
  const [ratings, setRatings] = useState<Record<string, VendorRating>>({});

  // ── Mount guard for portal ──────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Lock body scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // ── Initialize rating state & fetch already-submitted reviews ───────────────
  const fetchExistingReviews = useCallback(async () => {
    if (!isOpen || !bookingId || vendors.length === 0) return;
    setIsLoading(true);

    // Initialize all vendors with empty ratings
    const initial: Record<string, VendorRating> = {};
    for (const v of vendors) {
      initial[v.service] = { rating: 0, reviewText: "", alreadyReviewed: false };
    }

    try {
      const res = await reviewAPI.getBookingReviews(bookingId);
      if (res.ok && res.data?.data) {
        // Mark vendors that have already been reviewed
        const existingReviews: any[] = res.data.data;
        for (const v of vendors) {
          const found = existingReviews.find(
            (r: any) => r.vendorId === v.vendorId
          );
          if (found) {
            initial[v.service] = {
              rating: found.rating,
              reviewText: found.reviewText || "",
              alreadyReviewed: true,
            };
          }
        }
      }
    } catch (_) {
      // If fetch fails, fall back to empty state — user can still submit
    }

    setRatings(initial);
    setIsLoading(false);
  }, [isOpen, bookingId, vendors]);

  useEffect(() => {
    if (isOpen) {
      setStep("reviewing");
      fetchExistingReviews();
    }
  }, [isOpen, fetchExistingReviews]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const updateRating = (service: string, field: "rating" | "reviewText", value: any) => {
    setRatings((prev) => ({
      ...prev,
      [service]: { ...prev[service], [field]: value },
    }));
  };

  const pendingVendors = vendors.filter((v) => !ratings[v.service]?.alreadyReviewed);
  const hasAtLeastOneRating = pendingVendors.some((v) => (ratings[v.service]?.rating || 0) > 0);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAtLeastOneRating) return;

    setIsSubmitting(true);

    const reviewsPayload = pendingVendors
      .filter((v) => (ratings[v.service]?.rating || 0) > 0)
      .map((v) => ({
        service: v.service,
        vendorId: v.vendorId,
        rating: ratings[v.service].rating,
        reviewText: ratings[v.service].reviewText.trim(),
      }));

    try {
      const res = await reviewAPI.submitReview(bookingId, reviewsPayload);
      if (res.ok) {
        setStep("success");
        setTimeout(() => {
          onClose();
          setStep("reviewing");
        }, 2500);
      } else {
        alert(res.data?.message || "Failed to submit reviews. Please try again.");
      }
    } catch (_) {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  const content = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#111111] border border-[#C9A84C]/30 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">

          {/* ── HEADER ── */}
          <div className="px-7 py-5 border-b border-[#C9A84C]/20 bg-[#FDF9F1] dark:bg-[#0A0A0A] flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-5 bg-[#C9A84C] rounded-full" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#C9A84C]">
                  Event Completed
                </span>
              </div>
              <h3 className="text-xl font-serif text-gray-900 dark:text-white">Rate Your Experience</h3>
              {eventName && (
                <p className="text-[11px] text-gray-400 mt-0.5 font-light">{eventName}</p>
              )}
              {bookingRef && (
                <p className="text-[9px] uppercase tracking-widest text-[#C9A84C]/60 mt-1 font-bold">
                  Ref: {bookingRef}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── LOADING STATE ── */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#C9A84C]" />
              <p className="text-xs text-gray-400">Loading review form...</p>
            </div>
          ) : step === "success" ? (
            /* ── SUCCESS STATE ── */
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <div>
                <h4 className="text-xl font-serif text-gray-900 dark:text-white mb-1">Thank you!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                  Your feedback has been sent to the vendors. It helps them grow and helps future clients choose wisely.
                </p>
              </div>
            </div>
          ) : (
            /* ── REVIEW FORM ── */
            <form onSubmit={handleSubmit} className="p-7 space-y-5">

              {/* Already reviewed notice */}
              {vendors.some((v) => ratings[v.service]?.alreadyReviewed) && (
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg p-3 text-[11px] text-[#C9A84C] font-medium">
                  Some vendors have already been reviewed for this event.
                </div>
              )}

              {/* Vendor Cards */}
              {vendors.map((vendor) => {
                const vendorRating = ratings[vendor.service] || { rating: 0, reviewText: "", alreadyReviewed: false };
                const isAlreadyReviewed = vendorRating.alreadyReviewed;

                return (
                  <div
                    key={vendor.service}
                    className={`rounded-xl border p-5 space-y-4 transition-colors ${
                      isAlreadyReviewed
                        ? "border-[#C9A84C]/20 bg-[#C9A84C]/5 opacity-60"
                        : "border-[#E0D8C3] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] shadow-sm"
                    }`}
                  >
                    {/* Vendor Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                          {SERVICE_ICONS[vendor.service]}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white">
                            {vendor.vendorName}
                          </p>
                          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                            {SERVICE_LABELS[vendor.service]}
                          </p>
                        </div>
                      </div>
                      {isAlreadyReviewed && (
                        <span className="text-[8px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm border border-[#C9A84C]/20">
                          Reviewed
                        </span>
                      )}
                    </div>

                    {/* Stars */}
                    <StarRow
                      label="Overall Rating"
                      rating={vendorRating.rating}
                      onChange={(v) => updateRating(vendor.service, "rating", v)}
                      disabled={isAlreadyReviewed}
                    />

                    {/* Review Text — appears only when star is selected and not already reviewed */}
                    {vendorRating.rating > 0 && !isAlreadyReviewed && (
                      <textarea
                        rows={3}
                        placeholder={`Share your experience with the ${SERVICE_LABELS[vendor.service].toLowerCase()}...`}
                        value={vendorRating.reviewText}
                        onChange={(e) =>
                          updateRating(vendor.service, "reviewText", e.target.value)
                        }
                        className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#2A2A2A] shadow-inner rounded-lg px-4 py-3 text-xs text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#C9A84C]/60 transition-colors resize-none leading-relaxed"
                      />
                    )}

                    {/* Already reviewed text display */}
                    {isAlreadyReviewed && vendorRating.reviewText && (
                      <p className="text-xs text-gray-500 italic border-l-2 border-[#C9A84C]/30 pl-3">
                        "{vendorRating.reviewText}"
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasAtLeastOneRating || isSubmitting}
                  className="px-7 py-2.5 bg-[#C9A84C] hover:bg-[#B08D2C] disabled:opacity-40 disabled:cursor-not-allowed text-black text-[10px] uppercase tracking-widest font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-[#C9A84C]/20"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
                  ) : (
                    <><Star className="w-3.5 h-3.5 fill-current" /> Submit Reviews</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
