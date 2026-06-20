# EASCCA Wedding Hall Booking System — System Description

> **Reference Document** | CST 394-2 Group Project | Group CST01
> Last updated: 2026-06-19
> Backend Stack: Node.js / Express.js / MongoDB (Mongoose)
> Frontend Stack: Next.js / Tailwind CSS / Three.js

---

## 1. Project Overview

**Project Name:** EASCCA - Wedding Hall Booking System  
**Type:** Full-stack web application for a single, real wedding venue  
**University:** Uva Wellassa University of Sri Lanka — Faculty of Applied Sciences, Dept. of Computer Science and Informatics

### Team
| Name | Index | Email |
|------|-------|-------|
| S.Kavisheak | UWU/CST/22/065 | cst22065@std.uwu.ac.lk |
| MHM.Nazik | UWU/CST/22/103 | cst22103@std.uwu.ac.lk |
| AF.Ismiya | UWU/CST/22/072 | cst22072@std.uwu.ac.lk |

### Supervisors
- **Dr. Jayalath Ekanayake** — jayalath@uwu.ac.lk
- **Mr. V. Thanujan** — thanujanvijayachandran@gmail.com

---

## 2. Core Purpose

Replace the hall's current phone/WhatsApp-based manual booking system with a **conflict-free, fully digital** booking and management platform. The system serves a single specific wedding venue (EASCCA) and handles the entire lifecycle from discovery → booking → payment → event → post-event review.

---

## 3. Key Problems Solved

| # | Problem | Solution |
|---|---------|----------|
| 1 | Double bookings of the hall | Real-time calendar; date locked on deposit |
| 2 | Decorator/DJ/Videographer conflicts | Availability filter in booking steps |
| 3 | No structured payment system | Two-stage 30%/70% payment with receipts |
| 4 | No online presence or virtual preview | Public showcase + 360° tour + 3D model |
| 5 | No business analytics | Booking traffic insights dashboard |
| 6 | No customer satisfaction analysis | Sentiment analysis on post-event reviews |
| 7 | Staff had no dashboards | Role-specific dashboards for each staff type |

---

## 4. User Roles

### 4.1 Customer (Wedding Couple / Event Organiser)
**Access:** Public browsing without login; full booking requires registration.

**Public (no login):**
- View hall details, capacity, amenities, pricing
- Browse 360° virtual tour
- View public availability calendar
- View interactive 3D hall model

**Registered (login required):**
- Complete 4-step booking process
- Choose decoration style, decorator, videography package, videographer, DJ package, DJ artist
- View full price breakdown and pay 30% deposit
- Track and manage own bookings
- Pay 70% balance on reminder
- Download receipts
- Rate service providers (1–5 stars) after event

> **Restriction:** Cannot view other customers' bookings or any staff dashboard.

---

### 4.2 Hall Manager
**Access:** Staff login — assigned by Super Admin.

- View all PENDING and CONFIRMED bookings
- Review full booking details (customer, date, package, providers)
- **Approve** booking → status → `CONFIRMED`, all parties notified
- **Reject** booking with mandatory reason → status → `REJECTED`, deposit refunded
- Mark bookings as `COMPLETED` after event date
- View hall booking calendar
- Confirm cash payments (deposit and balance)
- View booking traffic insights (peak periods, demand trends)

---

### 4.3 Decorator
**Access:** Staff login — assigned by Super Admin.

- View only own assigned decoration jobs
- Per job: event date, decoration style, lighting preferences, customer first name, auto-generated preparation checklist
- Mark job as done and upload completion photos
- View own job history and cumulative star rating

> **Restriction:** Cannot see booking prices, payment details, other decorators' jobs, or financial data.

---

### 4.4 Videographer
**Access:** Staff login — assigned by Super Admin.

- View only own assigned videography jobs
- Per job: event date, videography package type, customer first name
- Confirm attendance and mark job as complete
- Upload final edited media (optional)
- View own job history and star rating

> **Restriction:** Cannot see booking prices, payment details, or other videographers' jobs.

---

### 4.5 DJ Artist
**Access:** Staff login — assigned by Super Admin.

- View only own upcoming assigned events
- Per event: event date, DJ package type, customer first name
- Confirm attendance
- View own performance history and star rating

---

### 4.6 Super Admin
**Access:** Complete system control.

- Full access to all bookings, payments, revenue data
- Create and deactivate staff accounts (Manager, Decorator, Videographer, DJ Artist)
- Configure hall packages (Silver, Gold, Diamond) and prices
- Configure decoration types, videography packages, DJ service fees
- Confirm cash payments
- Process cancellation refunds
- View full booking traffic insights dashboard
- Override any booking or assignment
- Set global system settings

---

## 5. Booking Flow (4-Step Conflict-Free Process)

All availability conflicts are resolved **before** submission. By the time the manager sees a booking, no conflicts exist.

```
Step 1 → Select Event Date
         ↳ Real-time hall availability check; taken dates blocked

Step 2 → Select Decorator
         ↳ Only decorators FREE on selected date shown
         ↳ Specialty matching highlighted

Step 3 → Select Videographer
         ↳ Only videographers FREE on selected date shown

Step 4 → Select DJ Artist
         ↳ Only DJ artists FREE on selected date shown

Step 5 → Price Summary
         ↳ Auto-calculated: Package + Decoration + Videography + DJ Fee

Step 6 → Deposit Payment (30%)
         ↳ Card (PayHere) or Cash-at-venue
         ↳ Booking created with status PENDING
         ↳ Unique reference generated: e.g., LG-2026-0047
         ↳ Date & providers soft-locked
         ↳ Confirmation email sent
```

---

## 6. Booking Status Lifecycle

```
PENDING → CONFIRMED → DEPOSIT_PAID → BALANCE_PAID → COMPLETED
                ↘
              REJECTED
```

| Status | Trigger |
|--------|---------|
| `PENDING` | Customer submits booking + pays 30% deposit |
| `CONFIRMED` | Manager approves |
| `REJECTED` | Manager rejects (mandatory reason required) |
| `DEPOSIT_PAID` | 30% deposit confirmed |
| `BALANCE_PAID` | 70% balance paid before event day |
| `COMPLETED` | Manager marks event as done |

---

## 7. Package & Pricing System

### Hall Packages (Admin-Configurable)
| Package | Description |
|---------|-------------|
| Silver | Entry-level package |
| Gold | Mid-range package |
| Diamond | Premium package |

### Pricing Formula
```
Total = Hall Package Price
      + Decoration Type Price
      + Videography Package Price
      + DJ Service Fee
```
No complex formula — simple sum. Full breakdown shown to customer before payment.

### Payment Split
- **30% deposit** — paid at booking (card or cash-at-venue)
- **70% balance** — paid before event day (same options)
- Auto-generated receipts for both payments
- Automated balance reminder sent before event

---

## 8. Key Features

### 8.1 Public Hall Showcase
- Hall details, capacity, amenities (no login needed)
- Fixed package pricing (Silver, Gold, Diamond)
- Live public availability calendar
- 360-degree virtual tour (Three.js / photo-sphere viewer)
- Interactive 3D hall model (Three.js)

### 8.2 Conflict-Free Booking
- All availability checks happen during form completion
- No double-booking of hall or any service provider is possible at submission time

### 8.3 Two-Stage Payment
- PayHere Payment Gateway (Sri Lanka) — sandbox in development
- Cash payment confirmed manually by Manager/Admin
- Cancellation refund policy enforced automatically

### 8.4 Booking Traffic Insights
Powered by database aggregations (no separate ML infrastructure needed):
- Monthly booking frequency chart (peak vs low periods)
- Most popular packages (pie chart)
- Most popular decoration types
- Top-rated decorators, videographers, DJ artists
- Total revenue by month and by year

### 8.5 Sentiment Analysis — Customer Feedback Module
- Customer submits written review + 1–5 star rating **after** event is `COMPLETED`
- Reviews cover: hall overall, assigned decorator, videographer, DJ artist
- Sentiment analysis classifies each review: **Positive / Neutral / Negative**
- Results visible in Admin and Manager dashboards only (customers cannot see their own classification)
- System flags any service provider whose negative review ratio exceeds a defined threshold → Super Admin notified

### 8.6 Role-Based Access Control
- JWT authentication for all protected routes
- Role-based middleware enforces scope: no staff member accesses data outside their role
- Passwords stored with bcrypt

---

## 9. Email Notifications (Nodemailer)

| Trigger | Recipients |
|---------|-----------|
| Booking submitted | Customer |
| Booking approved | Customer + all assigned service providers |
| Booking rejected | Customer |
| Balance reminder | Customer |
| Payment confirmed | Customer |
| Negative review threshold exceeded | Super Admin |

---

## 10. Technology Stack

### Backend (this repo)
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Email | Nodemailer |
| Payment | PayHere (Sri Lanka) |
| Dev server | Nodemon |

### Frontend (separate repo)
| Layer | Technology |
|-------|-----------|
| Framework | Next.js |
| Styling | Tailwind CSS |
| 3D / 360° | Three.js |
| HTTP Client | Axios |

### DevOps & Tooling
| Tool | Purpose |
|------|---------|
| GitHub | Version control (branch-based workflow) |
| Visual Studio Code | IDE |
| Postman | API testing |
| Figma | UI/UX prototyping |
| ClickUp | Project management |
| Vercel | Frontend deployment |
| Railway / Render | Backend deployment |
| MongoDB Atlas | Cloud database |

---

## 11. Database Entities (Key Models)

| Entity | Key Fields |
|--------|-----------|
| `User` | name, email, phone, password (hashed), role, isActive |
| `Booking` | referenceNo, customerId, eventDate, hallPackage, decoratorId, videographerId, djArtistId, status, depositPaid, balancePaid |
| `Package` | name (Silver/Gold/Diamond), price, description |
| `Decorator` | userId, specialty, rating, isAvailable |
| `Videographer` | userId, packageType, rating, isAvailable |
| `DjArtist` | userId, serviceType, fee, rating, isAvailable |
| `Payment` | bookingId, type (deposit/balance), method (card/cash), amount, receiptUrl, confirmedAt |
| `Review` | bookingId, customerId, targetId, targetType, rating, reviewText, sentimentLabel |
| `Availability` | entityType, entityId, blockedDates[] |

---

## 12. API Route Structure (Planned)

```
/api/auth           → register, login, logout, reset-password, verify-email
/api/bookings       → CRUD, status transitions, availability checks
/api/packages       → hall packages, decoration types, videography, DJ fees (admin-configurable)
/api/payments       → deposit, balance, cash-confirm, receipt generation
/api/users          → customer profile, staff account management
/api/decorators     → list, availability, job management
/api/videographers  → list, availability, job management
/api/dj-artists     → list, availability, job management
/api/reviews        → submit review, sentiment analysis
/api/analytics      → booking traffic, revenue summaries, top-rated providers
/api/admin          → system config, overrides, staff management
```

---

## 13. Development Sprints (Agile Scrum)

| Sprint | Focus |
|--------|-------|
| Sprint 1 | Core architecture, authentication, DB schemas, hall showcase API |
| Sprint 2 | Full 4-step booking flow, payments, booking dashboard |
| Sprint 3 | Staff dashboards (Manager, Decorator, Videographer, DJ), notifications |
| Sprint 4 | Super Admin dashboard, analytics, sentiment analysis, final polish & deployment |

---

## 14. Individual Contribution

| Name | Contribution |
|------|-------------|
| S.Kavisheak (UWU/CST/22/065) | Landing Pages – Frontend, Customer Dashboard – Frontend, Homepage Design |
| MHM.Nazik (UWU/CST/22/103) | Decorator Dashboard – Frontend, Manager Dashboard – Frontend, Admin Dashboard – Frontend |
| AF.Ismiya (UWU/CST/22/072) | DJ Artist Dashboard – Frontend, Videographer Dashboard – Frontend |

---

## 15. Security Requirements

- All API endpoints protected with JWT authentication
- Role-based middleware: no cross-role data access
- Passwords: bcrypt hashing
- Data transmission: HTTPS (enforced in production)
- Input validation on all routes
- JWT expiry enforced

---

## 16. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Showcase pages load in a few seconds on standard connection |
| Performance | Availability checks respond within a few seconds |
| Usability | Customer-facing UI fully mobile-responsive |
| Usability | Booking flow completable in under 10 minutes |
| Scalability | MongoDB schema supports new service providers without changes |
| Scalability | Package/pricing fully admin-configurable (no code changes needed) |

---

*This document is the single source of truth for system context during development. Update as the system evolves.*
