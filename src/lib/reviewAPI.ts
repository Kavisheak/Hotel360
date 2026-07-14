// ============================================================
// API helper for the post-completion review workflow
// Matches the existing apiFetch pattern in @/lib/api.ts
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = isFormData ? {} : { "Content-Type": "application/json" };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { ...headers, ...(options.headers || {}) },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

export const reviewAPI = {
  /**
   * Submit ratings and reviews for all vendors in a completed booking.
   * @param bookingId  - The booking's MongoDB _id
   * @param reviews    - Array of { service, vendorId, rating, reviewText }
   */
  submitReview: (
    bookingId: string,
    reviews: { service: string; vendorId: string; rating: number; reviewText: string }[]
  ) =>
    apiFetch(`/api/customer/bookings/${bookingId}/review`, {
      method: "POST",
      body: JSON.stringify({ reviews }),
    }),

  /**
   * Check which vendors in a booking have already been reviewed by this customer.
   * Returns an array of Review documents.
   */
  getBookingReviews: (bookingId: string) =>
    apiFetch(`/api/customer/bookings/${bookingId}/reviews`),
};
