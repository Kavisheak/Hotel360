const API_BASE = process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : "http://localhost:5000");

interface ApiOptions extends RequestInit {
  [key: string]: any;
}

export const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
  try {
    const isFormData = options.body instanceof FormData;
    const defaultHeaders: any = isFormData
      ? {}
      : { "Content-Type": "application/json" };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { ...defaultHeaders, ...options.headers },
      credentials: "include", // REQUIRED: sends/receives HTTP-only cookies
      cache: "no-store",
      ...options,
    });

    const data = await res.json();

    if (res.status === 401 && endpoint !== "/api/auth/me" && endpoint !== "/api/auth/me/password") {
      import("../store/authStore").then(({ useAuthStore }) => {
        useAuthStore.getState().clearUser();
      });
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }

    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.warn(`API Fetch Error (${endpoint}):`, error.message);
    return {
      ok: false,
      status: 500,
      data: { success: false, message: error.message || "Network error" },
    };
  }
};

export const authAPI = {
  signup: (body: any) =>
    apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  signin: (body: any) =>
    apiFetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  adminSignin: (body: any) =>
    apiFetch("/api/auth/admin-signin", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  forgotPassword: (email: string) =>
    apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  signout: () => apiFetch("/api/auth/signout", { method: "POST" }),
  getMe: () => apiFetch("/api/auth/me"),
  changePassword: (body: any) =>
    apiFetch("/api/auth/me/password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  revokeSessions: () =>
    apiFetch("/api/auth/me/sessions/revoke", { method: "POST" }),
  uploadAvatar: (formData: FormData) =>
    apiFetch("/api/auth/me/avatar", { method: "POST", body: formData }),
  deleteAvatar: () => apiFetch("/api/auth/me/avatar", { method: "DELETE" }),
  uploadCoverImage: (formData: FormData) =>
    apiFetch("/api/auth/me/cover", { method: "POST", body: formData }),
  updateProfile: (body: any) =>
    apiFetch("/api/auth/me", { method: "PUT", body: JSON.stringify(body) }),
};

export const staffAPI = {
  createVendor: (body: any) =>
    apiFetch("/api/staff/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAllVendors: () => apiFetch("/api/staff"),
  updateVendor: (id: string, body: any) =>
    apiFetch(`/api/staff/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteVendor: (id: string) =>
    apiFetch(`/api/staff/${id}`, { method: "DELETE" }),
};

export const packageAPI = {
  createPackage: (body: any) =>
    apiFetch("/api/packages/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAllPackages: () => apiFetch("/api/packages"),
  updatePackage: (id: string, body: any) =>
    apiFetch(`/api/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deletePackage: (id: string) =>
    apiFetch(`/api/packages/${id}`, { method: "DELETE" }),
  getSettings: () => apiFetch("/api/packages/settings"),
  updateSettings: (body: any) =>
    apiFetch("/api/packages/settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

export const settingsAPI = {
  getSystemSettings: () => apiFetch("/api/settings/system"),
  updateSystemSettings: (data: any) => apiFetch("/api/settings/system", {
    method: "PUT",
    body: JSON.stringify(data),
  }),
};

export const bookingAPI = {
  createBooking: (body: any) =>
    apiFetch("/api/bookings/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAllBookings: () => apiFetch("/api/bookings"),
  getBookingById: (id: string) => apiFetch(`/api/bookings/${id}`),
  updateBookingStatus: (id: string, body: any) =>
    apiFetch(`/api/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  rejectBooking: (id: string, body: any) =>
    apiFetch(`/api/bookings/${id}/reject`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  completeBooking: (id: string) =>
    apiFetch(`/api/bookings/${id}/complete`, {
      method: "PUT",
    }),
  assignArtisans: (id: string, body: any) =>
    apiFetch(`/api/bookings/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  recordPayment: (id: string, body: any) =>
    apiFetch(`/api/bookings/${id}/payment`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getAllBlocks: () => apiFetch("/api/manager/bookings/blocks"),
  createBlock: (body: any) =>
    apiFetch("/api/manager/bookings/block", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  releaseBlock: (body: any) =>
    apiFetch("/api/manager/bookings/block", {
      method: "DELETE",
      body: JSON.stringify(body),
    }),
};

export const paymentAPI = {
  getAllPayments: () => apiFetch("/api/payments"),
  confirmPayment: (id: string) =>
    apiFetch(`/api/payments/${id}/confirm`, { method: "PUT" }),
  getEscrowBalances: () => apiFetch("/api/payments/escrows"),
  getFinancialsReport: () => apiFetch("/api/payments/financials"),
  getManagerPayments: () => apiFetch("/api/payments"),
  getPayoutDashboard: (params?: any) => {
    let query = "";
    if (params) {
      const qParams = new URLSearchParams();
      Object.keys(params).forEach(k => {
        if (params[k]) qParams.append(k, params[k]);
      });
      query = `?${qParams.toString()}`;
    }
    return apiFetch(`/api/payments/payout-dashboard${query}`);
  },
  getEscrowLedger: () => apiFetch("/api/payments/escrow/ledger"),
  getPayoutQueue: () => apiFetch("/api/payments/escrow/queue"),
  holdPayout: (escrowId: string, reason?: string) =>
    apiFetch(`/api/payments/escrow/${escrowId}/hold`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),
  releaseHeldPayout: (escrowId: string) =>
    apiFetch(`/api/payments/escrow/${escrowId}/release-hold`, { method: "PUT" }),
  getRefundQueue: () => apiFetch("/api/payments/refunds"),
  approveRefund: (refundRequestId: string, amount?: number) =>
    apiFetch(`/api/payments/refunds/${refundRequestId}/approve`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  denyRefund: (refundRequestId: string, reason: string) =>
    apiFetch(`/api/payments/refunds/${refundRequestId}/deny`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  getCommissionSettings: () => apiFetch("/api/payments/commission-settings"),
  updateCommissionSettings: (body: any) =>
    apiFetch("/api/payments/commission-settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  payVendorAdvance: (escrowId: string, formData: FormData) =>
    apiFetch(`/api/payments/escrow/${escrowId}/pay-vendor`, {
      method: "POST",
      body: formData,
    }),
};

export const disputeAPI = {
  getMessages: (bookingId: string, itemType: string) =>
    apiFetch(`/api/disputes/${bookingId}/${itemType}/messages`),
  sendMessage: (bookingId: string, itemType: string, body: { message: string; attachments?: string[] }) =>
    apiFetch(`/api/disputes/${bookingId}/${itemType}/messages`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const decoratorAPI = {
  getOverview: () => apiFetch("/api/decorator/overview"),
  getProfile: () => apiFetch("/api/decorator/overview/profile"),
  getAssignedBookings: () => apiFetch("/api/decorator/bookings"),
  getBookingById: (id: string) => apiFetch(`/api/decorator/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, options?: any) =>
    apiFetch(`/api/decorator/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...options }),
    }),
  updateChecklist: (id: string, checklist: any[]) =>
    apiFetch(`/api/decorator/bookings/${id}/checklist`, {
      method: "PUT",
      body: JSON.stringify({ checklist }),
    }),
  uploadCompletionPhotos: (id: string, formData: FormData) =>
    apiFetch(`/api/decorator/bookings/${id}/upload`, {
      method: "POST",
      body: formData,
    }),
  getPortfolioItems: () => apiFetch("/api/decorator/portfolio"),
  createPortfolioItem: (formData: FormData) =>
    apiFetch("/api/decorator/portfolio", {
      method: "POST",
      body: formData,
    }),
  updatePortfolioItem: (id: string, formData: FormData) =>
    apiFetch(`/api/decorator/portfolio/${id}`, {
      method: "PUT",
      body: formData,
    }),
  deletePortfolioItem: (id: string) =>
    apiFetch(`/api/decorator/portfolio/${id}`, { method: "DELETE" }),
  getRatings: () => apiFetch("/api/decorator/ratings"),
  updateProfile: (body: any) => apiFetch("/api/decorator/profile", { method: "PUT", body: JSON.stringify(body) }),
  getJobs: (status: string = "upcoming", page: number = 1, limit: number = 10) =>
    apiFetch(`/api/decorator/jobs?status=${status}&page=${page}&limit=${limit}`),
  getJobById: (id: string) => apiFetch(`/api/decorator/jobs/${id}`),
  confirmReceipt: (id: string) => apiFetch(`/api/vendor/bookings/${id}/confirm-receipt`, { method: "POST" }),
  markJobComplete: (id: string) => apiFetch(`/api/decorator/jobs/${id}/mark-complete`, { method: "POST" }),
  getPendingRequests: (status?: string) => apiFetch(`/api/decorator/bookings/pending${status ? `?status=${status}` : ''}`),
  acceptRequest: (id: string, advanceAmount?: number, advanceDeadline?: string) => apiFetch(`/api/decorator/bookings/${id}/accept`, { method: "POST", body: JSON.stringify({ advanceRequestedAmount: advanceAmount, advanceDeadline }) }),
  declineRequest: (id: string, reason: string) =>
    apiFetch(`/api/decorator/bookings/${id}/decline`, { method: "POST", body: JSON.stringify({ reason }) }),
  getSchedule: (month?: number, year?: number) =>
    apiFetch(`/api/decorator/schedule?month=${month || ""}&year=${year || ""}`),
  createBlock: (body: { startDate: string; endDate: string; reason?: string }) =>
    apiFetch("/api/decorator/schedule/block", { method: "POST", body: JSON.stringify(body) }),
  deleteBlock: (id: string) => apiFetch(`/api/decorator/schedule/block/${id}`, { method: "DELETE" }),
  getAlbums: (status?: string) =>
    apiFetch(`/api/decorator/portfolio/albums${status && status !== "All" ? `?status=${status}` : ""}`),
  getAlbumById: (id: string) => apiFetch(`/api/decorator/portfolio/albums/${id}`),
  createAlbum: (body: { title: string; linkedBookingId?: string; price?: number;[key: string]: any }) =>
    apiFetch("/api/decorator/portfolio/albums", { method: "POST", body: JSON.stringify(body) }),
  updateAlbum: (id: string, body: any) =>
    apiFetch(`/api/decorator/portfolio/albums/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteAlbum: (id: string) =>
    apiFetch(`/api/decorator/portfolio/albums/${id}`, { method: "DELETE" }),
  uploadAlbumImages: (id: string, formData: FormData) =>
    apiFetch(`/api/decorator/portfolio/albums/${id}/images`, { method: "POST", body: formData }),
  updateImage: (id: string, body: any) =>
    apiFetch(`/api/decorator/portfolio/images/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteImage: (id: string) =>
    apiFetch(`/api/decorator/portfolio/images/${id}`, { method: "DELETE" }),
};

export const djAPI = {
  getOverview: () => apiFetch("/api/dj-artist/overview"),
  getPendingRequests: () => apiFetch("/api/dj-artist/bookings/pending"),
  acceptRequest: (id: string, advanceAmount?: number, advanceDeadline?: string) => apiFetch(`/api/dj-artist/bookings/${id}/accept`, { method: "POST", body: JSON.stringify({ advanceRequestedAmount: advanceAmount, advanceDeadline }) }),
  declineRequest: (id: string, reason: string) =>
    apiFetch(`/api/dj-artist/bookings/${id}/decline`, { method: "POST", body: JSON.stringify({ reason }) }),
  getJobs: (status?: string) => apiFetch(`/api/dj-artist/jobs?status=${status || "upcoming"}`),
  getSchedule: (month?: number, year?: number) =>
    apiFetch(`/api/dj-artist/schedule?month=${month || ""}&year=${year || ""}`),
  createBlock: (body: { startDate: string; endDate: string; reason?: string }) =>
    apiFetch("/api/dj-artist/schedule/block", { method: "POST", body: JSON.stringify(body) }),
  deleteBlock: (id: string) => apiFetch(`/api/dj-artist/schedule/block/${id}`, { method: "DELETE" }),
  getAlbums: (status?: string) =>
    apiFetch(`/api/dj-artist/portfolio/albums${status && status !== "All" ? `?status=${status}` : ""}`),
  createAlbum: (body: { title: string; linkedBookingId?: string }) =>
    apiFetch("/api/dj-artist/portfolio/albums", { method: "POST", body: JSON.stringify(body) }),
  createGalleryItem: (formData: FormData) =>
    apiFetch("/api/dj-artist/gallery", { method: "POST", body: formData }),
  uploadAlbumMedia: (id: string, body: any) =>
    apiFetch(`/api/dj-artist/portfolio/albums/${id}/media`, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  getAssignedBookings: () => apiFetch("/api/dj-artist/bookings"),
  getBookingById: (id: string) => apiFetch(`/api/dj-artist/bookings/${id}`),
  getJobById: (id: string) => apiFetch(`/api/dj-artist/jobs/${id}`),
  confirmReceipt: (id: string) => apiFetch(`/api/vendor/bookings/${id}/confirm-receipt`, { method: "POST" }),
  updateBookingStatus: (id: string, status: string, options?: any) =>
    apiFetch(`/api/dj-artist/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, ...options }),
    }),
  updateChecklist: (id: string, checklist: any[]) =>
    apiFetch(`/api/dj-artist/bookings/${id}/checklist`, {
      method: "PUT",
      body: JSON.stringify({ checklist }),
    }),
  uploadCompletionPhotos: (id: string, formData: FormData) =>
    apiFetch(`/api/dj-artist/bookings/${id}/completion-photos`, {
      method: "POST",
      body: formData,
    }),
  getProfile: () => apiFetch("/api/dj-artist/overview/profile"),
  getRatings: () => apiFetch("/api/dj-artist/ratings"),
  updateProfile: (body: any) =>
    apiFetch("/api/dj-artist/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getPackages: () => apiFetch("/api/dj-artist/packages"),
  addPackage: (body: any) =>
    apiFetch("/api/dj-artist/packages", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updatePackage: (id: string, body: any) =>
    apiFetch(`/api/dj-artist/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deletePackage: (id: string) =>
    apiFetch(`/api/dj-artist/packages/${id}`, { method: "DELETE" }),
};

export const videographerAPI = {
  getOverview: () => apiFetch("/api/videographer/overview"),
  getPendingRequests: () => apiFetch("/api/videographer/bookings/pending"),
  acceptRequest: (id: string, advanceAmount?: number, advanceDeadline?: string) => apiFetch(`/api/videographer/bookings/${id}/accept`, { method: "POST", body: JSON.stringify({ advanceRequestedAmount: advanceAmount, advanceDeadline }) }),
  declineRequest: (id: string, reason: string) =>
    apiFetch(`/api/videographer/bookings/${id}/decline`, { method: "POST", body: JSON.stringify({ reason }) }),
  getJobs: (status?: string) => apiFetch(`/api/videographer/jobs?status=${status || "upcoming"}`),
  confirmReceipt: (id: string) => apiFetch(`/api/vendor/bookings/${id}/confirm-receipt`, { method: "POST" }),
  getSchedule: (month?: number, year?: number) =>
    apiFetch(`/api/videographer/schedule?month=${month || ""}&year=${year || ""}`),
  createBlock: (body: { startDate: string; endDate: string; reason?: string }) =>
    apiFetch("/api/videographer/schedule/block", { method: "POST", body: JSON.stringify(body) }),
  deleteBlock: (id: string) => apiFetch(`/api/videographer/schedule/block/${id}`, { method: "DELETE" }),
  getAlbums: (status?: string) =>
    apiFetch(`/api/videographer/portfolio/albums${status && status !== "All" ? `?status=${status}` : ""}`),
  createAlbum: (body: { title: string; linkedBookingId?: string }) =>
    apiFetch("/api/videographer/portfolio/albums", { method: "POST", body: JSON.stringify(body) }),
  uploadAlbumMedia: (id: string, body: any) =>
    apiFetch(`/api/videographer/portfolio/albums/${id}/media`, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  getProfile: () => apiFetch("/api/videographer/profile"),
  getAssignedBookings: () => apiFetch("/api/videographer/bookings"),
  getBookingById: (id: string) => apiFetch(`/api/videographer/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, options?: any) =>
    apiFetch(`/api/videographer/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, ...options }) }),
  updateChecklist: (id: string, checklist: any[]) =>
    apiFetch(`/api/videographer/bookings/${id}/checklist`, { method: "PUT", body: JSON.stringify({ checklist }) }),
  uploadCompletionPhotos: (id: string, formData: FormData) => apiFetch(`/api/videographer/bookings/${id}/upload`, {
    method: "POST",
    body: formData,
  }),
  getPortfolioItems: () => apiFetch("/api/videographer/portfolio"),
  createPortfolioItem: (formData: FormData) => apiFetch("/api/videographer/portfolio", {
    method: "POST",
    body: formData,
  }),
  updatePortfolioItem: (id: string, formData: FormData) => apiFetch(`/api/videographer/portfolio/${id}`, {
    method: "PUT",
    body: formData,
  }),
  deletePortfolioItem: (id: string) => apiFetch(`/api/videographer/portfolio/${id}`, { method: "DELETE" }),
  getRatings: () => apiFetch("/api/videographer/ratings"),
  updateProfile: (body: any) => apiFetch("/api/videographer/profile", { method: "PUT", body: JSON.stringify(body) }),

  // Package Management
  getPackages: () => apiFetch("/api/videographer/packages"),
  createPackage: (body: any) =>
    apiFetch("/api/videographer/packages", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updatePackage: (id: string, body: any) =>
    apiFetch(`/api/videographer/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deletePackage: (id: string) =>
    apiFetch(`/api/videographer/packages/${id}`, { method: "DELETE" }),
};

export const accountAPI = {
  updateNotifications: (notifications: any) =>
    apiFetch("/api/customer/account/notifications", {
      method: "PUT",
      body: JSON.stringify({ notifications }),
    }),
  updatePreferences: (preferences: any) =>
    apiFetch("/api/customer/account/preferences", {
      method: "PUT",
      body: JSON.stringify({ preferences }),
    }),
  toggle2FA: (enabled: boolean) =>
    apiFetch("/api/customer/account/2fa", {
      method: "PUT",
      body: JSON.stringify({ enabled }),
    }),
  getPaymentMethods: () => apiFetch("/api/customer/account/payment-methods"),
  addPaymentMethod: (body: any) =>
    apiFetch("/api/customer/account/payment-methods", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deletePaymentMethod: (id: string) =>
    apiFetch(`/api/customer/account/payment-methods/${id}`, {
      method: "DELETE",
    }),
};

export const notificationAPI = {
  getNotificationHistory: () => apiFetch('/api/notifications/history', { method: "GET" }),
  markNotificationRead: (id: string) => apiFetch(`/api/notifications/history/${id}/read`, { method: "PUT" }),
  markAllNotificationsRead: () => apiFetch(`/api/notifications/history/read-all`, { method: "PUT" }),
  clearAllNotifications: () => apiFetch(`/api/notifications/history/clear-all`, { method: "DELETE" }),
  deleteNotification: (id: string) => apiFetch(`/api/notifications/history/${id}`, { method: "DELETE" }),
};

export const customerBookingAPI = {
  createBooking: (body: any) =>
    apiFetch("/api/customer/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMyBookings: () => apiFetch("/api/customer/bookings"),
  submitReview: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/review`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  initiateVendorSwap: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/swap-vendor`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  confirmSwapPayment: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/confirm-swap-payment`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  removeVendor: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/remove-vendor`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  getAvailability: () => apiFetch("/api/customer/bookings/availability"),
  recordPayment: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/payment`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getPayhereHash: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/payhere-hash`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createHold: (body: { date: string }) =>
    apiFetch("/api/customer/bookings/hold", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  releaseHold: (body: { date: string }) =>
    apiFetch("/api/customer/bookings/hold", {
      method: "DELETE",
      body: JSON.stringify(body),
    }),
  cancelBooking: (id: string) =>
    apiFetch(`/api/customer/bookings/${id}/cancel`, {
      method: "POST",
    }),
  getEscrowTracker: (id: string) => apiFetch(`/api/customer/bookings/${id}/escrow-tracker`),
  getBookingCredits: () => apiFetch("/api/customer/bookings/credits"),
  getTransactionHistory: () => apiFetch("/api/customer/bookings/transactions"),
  acknowledgeDeliverable: (id: string) =>
    apiFetch(`/api/customer/bookings/${id}/deliverable/acknowledge`, { method: "PUT" }),
  requestManualRefund: (body: { bookingId: string; itemType: string; reason: string; requestedAmount: number }) =>
    apiFetch("/api/customer/bookings/refunds/request", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getActiveCredits: (bookingId: string) => apiFetch(`/api/customer/bookings/${bookingId}/credits`),
  replaceVendorWithCredit: (bookingId: string, body: { vendorCategory: string; newVendorId: string }) =>
    apiFetch(`/api/customer/bookings/${bookingId}/replace-vendor`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  refundCreditManual: (bookingId: string, creditId: string) =>
    apiFetch(`/api/customer/bookings/${bookingId}/credits/${creditId}/refund`, {
      method: "POST",
    }),
  applyCreditToBalance: (bookingId: string, creditId: string) =>
    apiFetch(`/api/customer/bookings/${bookingId}/credits/${creditId}/apply-to-balance`, { method: "POST" }),
  getVendorAdvances: (bookingId: string) =>
    apiFetch(`/api/customer/bookings/${bookingId}/vendor-advances`),
  payVendorAdvance: (bookingId: string, advanceId: string) =>
    apiFetch(`/api/customer/bookings/${bookingId}/vendor-advances/${advanceId}/payhere-hash`, { method: "POST" }),
  clearBookingHistory: () =>
    apiFetch("/api/customer/bookings/history/clear", { method: "DELETE" }),
  deleteBookingHistory: (id: string) =>
    apiFetch(`/api/customer/bookings/${id}/history`, { method: "DELETE" }),
};

export const vendorPaymentAPI = {
  getExpectedPayouts: () => apiFetch("/api/vendor/bookings/payouts"),
};

export const vendorAPI = {
  getAllVendors: () => apiFetch("/api/customer/vendors"),
  getVendorById: (id: string) => apiFetch(`/api/customer/vendors/${id}`),
  favoriteVendor: (id: string) =>
    apiFetch("/api/customer/vendors/favorite", {
      method: "POST",
      body: JSON.stringify({ vendorId: id }),
    }),
  checkVendorAvailability: (vendorId: string, params: { date?: string, month?: number, year?: number }) => {
    if (params.date) return apiFetch(`/api/customer/vendors/${vendorId}/availability?date=${params.date}`);
    return apiFetch(`/api/customer/vendors/${vendorId}/availability?month=${params.month}&year=${params.year}`);
  },
  getPublicVendorPortfolio: (vendorId: string) =>
    apiFetch(`/api/customer/vendors/${vendorId}/portfolio`),
};

export const hotelManagerAPI = {
  getOverview: () => apiFetch("/api/manager/overview"),
  getVenueSettings: () => apiFetch("/api/manager/venue-settings"),
  updateVenueSettings: (body: any) =>
    apiFetch("/api/manager/venue-settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

// ─── Super Admin API ─────────────────────────────────────────────────────────────
export const superAdminAPI = {
  getOverview: () => apiFetch("/api/super-admin/overview"),
  getFinancials: () => apiFetch("/api/super-admin/financials"),
  getNotifications: () => apiFetch("/api/notifications/history"),
  markNotificationRead: (id: string) => apiFetch(`/api/notifications/history/${id}/read`, { method: "PUT" }),
  markAllNotificationsRead: () => apiFetch("/api/notifications/history/read-all", { method: "PUT" }),
  getConfigHealth: () => apiFetch("/api/super-admin/config/health"),
  getPlatformConfig: () => apiFetch("/api/super-admin/config/platform"),
  updatePlatformConfig: (data: any) =>
    apiFetch("/api/super-admin/config/platform", {
      method: "PUT",
      body: JSON.stringify(data)
    }),
  executeSecurityAction: (action: string) =>
    apiFetch("/api/super-admin/config/security-action", {
      method: "POST",
      body: JSON.stringify({ action }),
    }),
  uploadGlbModel: async (file: File) => {
    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const formData = new FormData();
    formData.append("model", file);
    const res = await fetch(`${BASE}/api/super-admin/config/upload-model`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return { ok: res.ok, data: await res.json() };
  },
  approveRefund: (id: string) => apiFetch(`/api/super-admin/financials/refund/${id}`, { method: 'PUT' }),
  getStaff: () => apiFetch("/api/super-admin/users"),
  createStaff: (data: any) =>
    apiFetch("/api/super-admin/users/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  toggleStaffStatus: (id: string) =>
    apiFetch(`/api/super-admin/users/${id}/status`, {
      method: "PUT",
    }),
  updateStaff: (id: string, data: any) =>
    apiFetch(`/api/super-admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
