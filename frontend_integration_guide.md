# EASCCA Frontend ↔ Backend Integration Guide
> Give this entire document to whoever works on the frontend (or paste into AI chat for frontend help)

---

## Backend Info

| Item | Value |
|------|-------|
| Backend URL (dev) | `http://localhost:5000` |
| Frontend URL (dev) | `http://localhost:3000` |
| Auth strategy | **HTTP-only Cookie** (named `eascca_token`) |
| Cookie duration | 7 days |

---

## Step 1 — Add .env.local to Next.js project root

Create a file called `.env.local` in the root of the Next.js project:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Step 2 — Create API Client File

Create `src/lib/api.js` in the Next.js project:

```js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ← REQUIRED: sends/receives HTTP-only cookies
    ...options,
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

export const authAPI = {
  signup:  (body) => apiFetch("/api/auth/signup",  { method: "POST", body: JSON.stringify(body) }),
  signin:  (body) => apiFetch("/api/auth/signin",  { method: "POST", body: JSON.stringify(body) }),
  signout: ()     => apiFetch("/api/auth/signout", { method: "POST" }),
  getMe:   ()     => apiFetch("/api/auth/me"),
};
```

> ⚠️ `credentials: "include"` is mandatory on every API call — without it, cookies won't be sent and auth will fail.

---

## Step 3 — Auth Endpoints

### POST `/api/auth/signup`
**Who:** Customers only (staff accounts are pre-created, they don't sign up)

**Send:**
```json
{
  "name": "John Silva",
  "email": "john@example.com",
  "phone": "0771234567",
  "password": "mypassword"
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "user": {
    "id": "abc123",
    "name": "John Silva",
    "email": "john@example.com",
    "phone": "0771234567",
    "role": "customer"
  }
}
```

**Fail Responses:**
```json
{ "success": false, "message": "An account with this email already exists." }  // 409
{ "success": false, "message": "All fields are required: name, email, phone, password." } // 400
```

> Cookie `eascca_token` is **automatically set** on success. No need to store token manually.

---

### POST `/api/auth/signin`
**Who:** ALL roles — customer, manager, decorator, videographer, dj_artist, super_admin

**Send:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "abc123",
    "name": "Super Admin",
    "email": "admin@gmail.com",
    "phone": "0000000000",
    "role": "super_admin"
  }
}
```

**Use the `role` field to redirect after login:**

```js
const handleSignin = async (email, password) => {
  const { ok, data } = await authAPI.signin({ email, password });

  if (!ok) {
    alert(data.message); // show error
    return;
  }

  // Redirect based on role
  const role = data.user.role;
  if      (role === "super_admin")   router.push("/admin/dashboard");
  else if (role === "manager")       router.push("/manager/dashboard");
  else if (role === "decorator")     router.push("/decorator/dashboard");
  else if (role === "videographer")  router.push("/videographer/dashboard");
  else if (role === "dj_artist")     router.push("/dj/dashboard");
  else                               router.push("/customer/dashboard");
};
```

---

### POST `/api/auth/signout`
**Who:** Any logged-in user  
**Send:** Nothing (cookie is read automatically)

**Success Response `200`:**
```json
{ "success": true, "message": "Logged out successfully." }
```
> Cookie is cleared automatically on the backend.

---

### GET `/api/auth/me`
**Who:** Any logged-in user  
**Send:** Nothing (cookie is read automatically)

**Success Response `200`:**
```json
{
  "success": true,
  "user": {
    "id": "abc123",
    "name": "Hall Manager",
    "email": "manager@gmail.com",
    "phone": "0711000001",
    "role": "manager",
    "isVerified": false,
    "createdAt": "2026-06-19T14:00:00.000Z"
  }
}
```

**Use this to protect pages:**
```js
// In any protected page or layout
useEffect(() => {
  authAPI.getMe().then(({ ok, data }) => {
    if (!ok) router.push("/signin"); // not logged in → redirect
    else setUser(data.user);
  });
}, []);
```

---

## Step 4 — Staff Test Credentials (for dummy dashboards)

| Role | Email | Password |
|------|-------|---------|
| super_admin | admin@gmail.com | admin123 |
| manager | manager@gmail.com | manager123 |
| decorator | deco@gmail.com | deco123 |
| videographer | videographer@gmail.com | video123 |
| dj_artist | dj@gmail.com | dj1234 |

---

## Step 5 — Run Both at the Same Time

Open **2 terminals**:

**Terminal 1 — Backend:**
```bash
cd D:\projects\EASCC-Backend
npm run dev
# → EASCCA Server running on port 5000
# → MongoDB Connected Successfully
```

**Terminal 2 — Frontend:**
```bash
cd D:\projects\Hotel360
npm run dev
# → Next.js running on port 3000
```

Then open `http://localhost:3000` in browser.

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `CORS error` in browser | Make sure `credentials: "include"` is on every fetch call |
| Cookie not sent | Same as above — `credentials: "include"` is required |
| `401 Access denied` | User is not logged in, or cookie expired |
| `403 Access denied` | User is logged in but wrong role for that route |
| Backend not reachable | Make sure `npm run dev` is running in EASCC-Backend |

---

## What's Working Now (Backend)

| Feature | Status |
|---------|--------|
| Customer Signup | ✅ |
| Signin (all roles) | ✅ |
| Signout | ✅ |
| Get current user (/me) | ✅ |
| HTTP-only cookie session | ✅ |
| Role-based access middleware | ✅ |
| Staff accounts in MongoDB | ✅ |

---

## What's Coming Next (Backend — not built yet)

- Booking system (4-step flow)
- Payment system (30% / 70%)
- Package management
- Staff dashboards (jobs, availability)
- Reviews & sentiment analysis
- Analytics dashboard
