"use client";

import React, { useEffect, useState } from "react";
import { useBookingStore, Booking } from "@/store/bookingStore";
import { reviewAPI } from "@/lib/reviewAPI";
import CompletedEventReview from "./CompletedEventReview";

export default function GlobalReviewPrompt() {
  const { bookings } = useBookingStore();
  const [reviewState, setReviewState] = useState<{
    isOpen: boolean;
    bookingId: string;
    bookingRef: string;
    eventName: string;
    vendors: { service: "decorator" | "dj" | "videographer"; vendorId: string; vendorName: string }[];
  } | null>(null);

  useEffect(() => {
    // Only run if the user has closed the modal or hasn't had one opened yet
    if (reviewState?.isOpen) return;

    // We only prompt once per session to avoid annoying the user if they close it without submitting
    const hasPrompted = sessionStorage.getItem("globalReviewPromptShown");
    if (hasPrompted === "true") return;

    const checkPendingReviews = async () => {
      // Find all completed bookings
      const completedBookings = bookings.filter((b) => b.status === "Completed");

      for (const booking of completedBookings) {
        // Collect active vendors
        const activeVendors = [];
        if (booking.vendors?.decorator?.status === "Accepted" && booking.vendors.decorator.vendorId) {
          activeVendors.push({ service: "decorator" as const, vendorId: booking.vendors.decorator.vendorId, vendorName: "Decorator" });
        }
        if (booking.vendors?.dj?.status === "Accepted" && booking.vendors.dj.vendorId) {
          activeVendors.push({ service: "dj" as const, vendorId: booking.vendors.dj.vendorId, vendorName: "DJ Artist" });
        }
        if (booking.vendors?.videographer?.status === "Accepted" && booking.vendors.videographer.vendorId) {
          activeVendors.push({ service: "videographer" as const, vendorId: booking.vendors.videographer.vendorId, vendorName: "Videographer" });
        }

        if (activeVendors.length === 0) continue;

        try {
          const res = await reviewAPI.getBookingReviews(booking._id || booking.id!);
          if (res.ok && res.data?.data) {
            const existingReviews = res.data.data;
            // Check if there are any unreviewed vendors
            const unreviewedVendors = activeVendors.filter(
              (av) => !existingReviews.some((er: any) => er.vendorId === av.vendorId)
            );

            // If there's at least one vendor that hasn't been reviewed, prompt the user
            if (unreviewedVendors.length > 0) {
              sessionStorage.setItem("globalReviewPromptShown", "true");
              setReviewState({
                isOpen: true,
                bookingId: booking._id || booking.id!,
                bookingRef: booking.bookingRef,
                eventName: booking.eventName || booking.eventType,
                vendors: activeVendors, // Pass all active vendors; CompletedEventReview handles showing which are already reviewed
              });
              return; // Only prompt for one booking at a time
            }
          }
        } catch (e) {
          console.error("Failed to fetch reviews for booking:", booking._id, e);
        }
      }
    };

    checkPendingReviews();
  }, [bookings, reviewState?.isOpen]);

  if (!reviewState || !reviewState.isOpen) return null;

  return (
    <CompletedEventReview
      isOpen={reviewState.isOpen}
      onClose={() => setReviewState({ ...reviewState, isOpen: false })}
      bookingId={reviewState.bookingId}
      bookingRef={reviewState.bookingRef}
      eventName={reviewState.eventName}
      vendors={reviewState.vendors}
    />
  );
}
