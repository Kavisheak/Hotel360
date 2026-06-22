const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiOptions extends RequestInit {
  [key: string]: any;
}

const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
  try {
    const defaultHeaders: Record<string, string> = { "Content-Type": "application/json" };
    
    // If Content-Type is explicitly null/undefined in options, remove it so browser can set it
    if (options.headers && 'Content-Type' in options.headers && !options.headers['Content-Type']) {
      delete defaultHeaders["Content-Type"];
      delete options.headers["Content-Type"];
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { ...defaultHeaders, ...options.headers },
      credentials: "include", // REQUIRED: sends/receives HTTP-only cookies
      ...options,
    });
    
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error("API Fetch Error:", error);
    return { ok: false, status: 500, data: { success: false, message: error.message || "Network error" } };
  }
};

export const authAPI = {
  signup:  (body: any) => apiFetch("/api/auth/signup",  { method: "POST", body: JSON.stringify(body) }),
  signin:  (body: any) => apiFetch("/api/auth/signin",  { method: "POST", body: JSON.stringify(body) }),
  signout: ()          => apiFetch("/api/auth/signout", { method: "POST" }),
  getMe:   ()          => apiFetch("/api/auth/me"),
  updateProfile: (body: any) => apiFetch("/api/auth/me", { method: "PUT", body: JSON.stringify(body) }),
  uploadAvatar: (formData: FormData) => apiFetch("/api/auth/me/avatar", {
    method: "POST",
    body: formData,
    headers: {
      // Content-Type must be undefined so browser sets it with the boundary automatically
      "Content-Type": undefined as any
    }
  }),
  deleteAvatar: () => apiFetch("/api/auth/me/avatar", { method: "DELETE" }),
};

export const accountAPI = {
  changePassword: (body: any) => apiFetch("/api/customer/account/password", { method: "PUT", body: JSON.stringify(body) }),
  toggle2FA: (enabled: boolean) => apiFetch("/api/customer/account/2fa", { method: "PUT", body: JSON.stringify({ enabled }) }),
  updatePreferences: (body: any) => apiFetch("/api/customer/account/preferences", { method: "PUT", body: JSON.stringify(body) }),
  updateNotifications: (body: any) => apiFetch("/api/customer/account/notifications", { method: "PUT", body: JSON.stringify(body) }),
  getPaymentMethods: () => apiFetch("/api/customer/account/payment-methods"),
  addPaymentMethod: (body: any) => apiFetch("/api/customer/account/payment-methods", { method: "POST", body: JSON.stringify(body) }),
  deletePaymentMethod: (id: string) => apiFetch(`/api/customer/account/payment-methods/${id}`, { method: "DELETE" }),
  getMyBookings: () => apiFetch("/api/customer/account/bookings"),
};

export const staffAPI = {
  createVendor: (body: any) => apiFetch("/api/staff/create", { method: "POST", body: JSON.stringify(body) }),
  getAllVendors: () => apiFetch("/api/staff"),
  updateVendor: (id: string, body: any) => apiFetch(`/api/staff/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteVendor: (id: string) => apiFetch(`/api/staff/${id}`, { method: "DELETE" }),
};

export const packageAPI = {
  createPackage: (body: any) => apiFetch("/api/packages/create", { method: "POST", body: JSON.stringify(body) }),
  getAllPackages: () => apiFetch("/api/packages"),
  updatePackage: (id: string, body: any) => apiFetch(`/api/packages/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePackage: (id: string) => apiFetch(`/api/packages/${id}`, { method: "DELETE" }),
};

export const bookingAPI = {
  createBooking: (body: any) => apiFetch("/api/bookings/create", { method: "POST", body: JSON.stringify(body) }),
  getAllBookings: () => apiFetch("/api/bookings"),
  getBookingById: (id: string) => apiFetch(`/api/bookings/${id}`),
  updateBookingStatus: (id: string, body: any) => apiFetch(`/api/bookings/${id}/status`, { method: "PUT", body: JSON.stringify(body) }),
  assignArtisans: (id: string, body: any) => apiFetch(`/api/bookings/${id}/assign`, { method: "PUT", body: JSON.stringify(body) }),
  recordPayment: (id: string, body: any) => apiFetch(`/api/bookings/${id}/payment`, { method: "PUT", body: JSON.stringify(body) }),
};

export const paymentAPI = {
  getAllPayments: () => apiFetch("/api/payments"),
  confirmPayment: (id: string) => apiFetch(`/api/payments/${id}/confirm`, { method: "PUT" }),
};
