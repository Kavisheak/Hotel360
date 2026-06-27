const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiOptions extends RequestInit {
  [key: string]: any;
}

const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
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
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("API Fetch Error:", error);
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
};

export const paymentAPI = {
  getAllPayments: () => apiFetch("/api/payments"),
  confirmPayment: (id: string) =>
    apiFetch(`/api/payments/${id}/confirm`, { method: "PUT" }),
};

export const decoratorAPI = {
  getOverview: () => apiFetch("/api/decorator/overview"),
  getProfile: () => apiFetch("/api/decorator/overview/profile"),
  getAssignedBookings: () => apiFetch("/api/decorator/bookings"),
  updateBookingStatus: (id: string, status: string) =>
    apiFetch(`/api/decorator/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
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
  getRatings: () => apiFetch("/api/decorator/ratings"),
  updateProfile: (body: any) =>
    apiFetch("/api/decorator/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

export const djAPI = {
  getOverview: () => apiFetch("/api/dj-artist/overview"),
  getAssignedBookings: () => apiFetch("/api/dj-artist/bookings"),
  updateBookingStatus: (id: string, status: string) =>
    apiFetch(`/api/dj-artist/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
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
  getGalleryItems: () => apiFetch("/api/dj-artist/gallery"),
  createGalleryItem: (formData: FormData) =>
    apiFetch("/api/dj-artist/gallery", {
      method: "POST",
      body: formData,
    }),
  updateGalleryItem: (id: string, formData: FormData) =>
    apiFetch(`/api/dj-artist/gallery/${id}`, {
      method: "PUT",
      body: formData,
    }),
  deleteGalleryItem: (id: string) =>
    apiFetch(`/api/dj-artist/gallery/${id}`, { method: "DELETE" }),
};

export const accountAPI = {
  updateNotifications: (notifications: any) =>
    apiFetch("/api/customer/account/notifications", {
      method: "PUT",
      body: JSON.stringify({ notifications }),
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

export const customerBookingAPI = {
  createBooking: (body: any) =>
    apiFetch("/api/customer/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMyBookings: () => apiFetch("/api/customer/bookings"),
  swapVendor: (id: string, body: any) =>
    apiFetch(`/api/customer/bookings/${id}/swap-vendor`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getAvailability: () => apiFetch("/api/customer/bookings/availability"),
};

export const vendorAPI = {
  getAllVendors: () => apiFetch("/api/customer/vendors"),
  getVendorById: (id: string) => apiFetch(`/api/customer/vendors/${id}`),
};
