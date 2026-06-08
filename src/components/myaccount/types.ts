// ==========================================
// TYPES & DATASETS FOR MY ACCOUNT PAGE
// ==========================================

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  avatar: string;
  memberSince: string;
  tier: "silver" | "gold" | "diamond";
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  isPrimary: boolean;
  cardholderName: string;
}

export interface BookingHistoryItem {
  id: string;
  eventName: string;
  date: string;
  package: string;
  status: "confirmed" | "completed" | "pending" | "cancelled";
  total: string;
  guests: number;
}

export interface NotificationPref {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

export const USER_PROFILE: UserProfile = {
  firstName: "Farhan",
  lastName: "Ahmed",
  email: "farhan.ahmed@example.com",
  phone: "+94 77 123 4567",
  address: "42 Galle Face Terrace",
  city: "Colombo 03, Sri Lanka",
  avatar: "/images/Frontimg.png",
  memberSince: "January 2025",
  tier: "gold",
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "visa",
    last4: "4242",
    expiry: "09/27",
    isPrimary: true,
    cardholderName: "Farhan Ahmed",
  },
  {
    id: "pm-2",
    type: "mastercard",
    last4: "5555",
    expiry: "03/28",
    isPrimary: false,
    cardholderName: "Farhan Ahmed",
  },
];

export const BOOKING_HISTORY: BookingHistoryItem[] = [
  {
    id: "BK-9012",
    eventName: "Farhan & Zainab Wedding Gala",
    date: "June 4, 2026",
    package: "Gold Package",
    status: "confirmed",
    total: "LKR 3,700,000",
    guests: 380,
  },
  {
    id: "BK-7801",
    eventName: "Ahmed Family Engagement",
    date: "December 15, 2025",
    package: "Silver Package",
    status: "completed",
    total: "LKR 1,800,000",
    guests: 200,
  },
  {
    id: "BK-6543",
    eventName: "Corporate Gala Dinner",
    date: "August 20, 2025",
    package: "Diamond Package",
    status: "completed",
    total: "LKR 5,900,000",
    guests: 450,
  },
];

export const NOTIFICATION_PREFS: NotificationPref[] = [
  {
    id: "notif-1",
    title: "Booking Confirmations",
    description: "Receive confirmations when your booking status changes.",
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "notif-2",
    title: "Concierge Messages",
    description: "Important directives and updates from your dedicated concierge.",
    email: true,
    sms: true,
    push: false,
  },
  {
    id: "notif-3",
    title: "Payment Reminders",
    description: "Alerts for upcoming installment deadlines and payment receipts.",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "notif-4",
    title: "Promotions & Offers",
    description: "Exclusive seasonal offers and early-bird discounts.",
    email: false,
    sms: false,
    push: false,
  },
  {
    id: "notif-5",
    title: "Vendor Updates",
    description: "Portfolio updates and new packages from your selected vendors.",
    email: true,
    sms: false,
    push: false,
  },
];
