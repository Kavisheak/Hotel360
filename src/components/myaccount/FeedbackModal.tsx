"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Star, MessageSquare } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

export default function FeedbackModal({ isOpen, onClose, bookingId }: FeedbackModalProps) {
  const { bookings, submitFeedback } = useBookingStore();
  const booking = bookings.find(b => b.id === bookingId);
  const vendors = booking?.vendors || {};

  const [ratings, setRatings] = useState<Record<string, number>>({
    overall: 0,
    food: 0,
  });
  const [comments, setComments] = useState<Record<string, string>>({
    overall: "",
    food: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRatings({
        overall: 0,
        food: 0,
        ...(vendors.decorator?.vendorId ? { decorator: 0 } : {}),
        ...(vendors.dj?.vendorId ? { dj: 0 } : {}),
        ...(vendors.videographer?.vendorId ? { videographer: 0 } : {}),
      });
      setComments({
        overall: "",
        food: "",
        ...(vendors.decorator?.vendorId ? { decorator: "" } : {}),
        ...(vendors.dj?.vendorId ? { dj: "" } : {}),
        ...(vendors.videographer?.vendorId ? { videographer: "" } : {}),
      });
    }
  }, [isOpen, bookingId, vendors]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleRating = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and save to store
    setTimeout(() => {
      submitFeedback(bookingId, {
        overall: ratings.overall,
        food: ratings.food,
        decorator: ratings.decorator,
        dj: ratings.dj,
        videographer: ratings.videographer,
        comments: comments as any,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  const RatingRow = ({ label, category }: { label: string, category: keyof typeof ratings }) => {
    return (
      <div className="py-4 border-b border-[#E8DFC9] dark:border-gray-800 last:border-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1A1512] dark:text-white">{label}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(category, star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= ratings[category]
                      ? "fill-[#C69C6D] text-[#C69C6D]"
                      : "text-gray-300 dark:text-gray-600"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>
        {/* Specific Comment Box */}
        {ratings[category] > 0 && (
          <div className="mt-3 animate-fadeIn">
            <input
              type="text"
              placeholder={`Add a brief comment about ${label.toLowerCase()}...`}
              value={comments[category] || ""}
              onChange={(e) => setComments(prev => ({ ...prev, [category]: e.target.value }))}
              className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-md text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#C69C6D] transition-colors"
            />
          </div>
        )}
      </div>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-[#1A1512]/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
          aria-hidden="true" 
        />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1A1A1A] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-[#E8DFC9] dark:border-gray-800 animate-slideUp z-10">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#E8DFC9] dark:border-gray-800 bg-[#FDFBF7] dark:bg-[#111111] flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">Leave a Review</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C69C6D] font-bold mt-1.5">Booking #{bookingId}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-[#1A1512] dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 fill-emerald-500 text-emerald-500" />
            </div>
            <h4 className="text-xl font-serif text-[#1A1512] dark:text-white mb-2">Thank you!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your feedback helps us make every event a masterpiece.</p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Rate your experience</h4>
              <div className="bg-[#FAF6EE] dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 rounded-xl px-6 py-2 shadow-sm">
                <RatingRow label="Overall Event Experience" category="overall" />
                <RatingRow label="Food & Catering Services" category="food" />
                {vendors.decorator?.vendorId && <RatingRow label={`Decorator`} category="decorator" />}
                {vendors.dj?.vendorId && <RatingRow label={`DJ Artist`} category="dj" />}
                {vendors.videographer?.vendorId && <RatingRow label={`Videography`} category="videographer" />}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E8DFC9] dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ratings.overall === 0 || isSubmitting}
                className="px-8 py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#B58A59] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center min-w-[160px]"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
