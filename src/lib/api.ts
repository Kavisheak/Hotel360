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
