const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiOptions extends RequestInit {
  [key: string]: any;
}

const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
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

// Manager APIs
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
