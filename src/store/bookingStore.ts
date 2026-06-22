import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Feedback {
  overall: number;
  food: number;
  decorator?: number;
  dj?: number;
  videographer?: number;
  comments: {
    overall: string;
    food: string;
    decorator?: string;
    dj?: string;
    videographer?: string;
  };
}

export interface Booking {
  _id: string;
  bookingRef: string;
  clientName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  eventType: string;
  date: string;
  timeslot: string;
  durationHours: number;
  extraHours: number;
  guests: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
  totalCost: number;
  depositAmount: number;
  balanceAmount: number;
  packageId?: string;
  packageName: string;
  menuType: string;
  customMenuItems: string[];
  vendors: {
    decoratorId?: string;
    videographerId?: string;
    djId?: string;
  };
  pricingBreakdown: {
    hallFixedPrice: number;
    extraHoursPremium: number;
    foodCost: number;
    timeslotPremium: number;
    decoratorCost: number;
    videographerCost: number;
    djCost: number;
  };
  createdAt: string;
  feedback?: Feedback;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchUserBookings: () => Promise<void>;
  addBookingLocally: (booking: Booking) => void;
  getPendingBookings: () => Booking[];
  getConfirmedBookings: () => Booking[];
  submitFeedback: (id: string, feedback: Feedback) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: false,
      error: null,
      fetchUserBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          // Import here to avoid circular dependency issues if any
          const { customerBookingAPI } = await import("@/lib/api");
          const res = await customerBookingAPI.getMyBookings();
          if (res.ok && res.data.success) {
            // Note: backend may return bookings inside data.data or data.bookings depending on controller
            // The account controller returns data.bookings, but our new controller might return data.data.
            // Actually `getMyBookings` in booking.controller returns { success: true, data: bookings }
            const fetchedBookings = res.data.data || res.data.bookings || [];
            set({ bookings: fetchedBookings, isLoading: false });
          } else {
            set({ error: res.data.message || "Failed to load bookings", isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
      addBookingLocally: (booking) => 
        set((state) => ({ bookings: [booking, ...state.bookings] })),
      getPendingBookings: () => get().bookings.filter(b => b.status === "Pending"),
      getConfirmedBookings: () => get().bookings.filter(b => b.status === "Confirmed"),
      submitFeedback: (id, feedback) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b._id === id ? { ...b, feedback } : b
          )
        })),
    }),
    {
      name: "booking-storage-v3",
    }
  )
);
