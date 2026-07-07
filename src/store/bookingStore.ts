import { create } from "zustand";
import { persist } from "zustand/middleware";
import { customerBookingAPI } from "@/lib/api";

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
  id?: string;
  bookingRef: string;
  eventName?: string;
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
  package?: string;
  menuType: string;
  customMenuItems: string[];
  vendors: {
    decorator?: {
      vendorId: string | null;
      status: "Pending" | "Accepted" | "Declined" | "NotRequired";
      packageName: string;
    };
    dj?: {
      vendorId: string | null;
      status: "Pending" | "Accepted" | "Declined" | "NotRequired";
      packageName: string;
    };
    videographer?: {
      vendorId: string | null;
      status: "Pending" | "Accepted" | "Declined" | "NotRequired";
      packageName: string;
    };
    // Legacy fields for backward compatibility during transition
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
  addBooking: (booking: Booking) => void;
  getPendingBookings: () => Booking[];
  getConfirmedBookings: () => Booking[];
  updateBookingStatus: (id: string, status: string) => void;
  submitFeedback: (id: string, feedback: Feedback) => void;
  swapVendor: (bookingId: string, service: string, newVendorId: string) => Promise<void>;
  vendorRespondBooking: (bookingId: string, service: string, status: "Accepted" | "Declined") => Promise<void>;
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
      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
      updateBookingStatus: (id, status) => set((state) => ({
        bookings: state.bookings.map((b) => ((b.id || b._id) === id ? { ...b, status: status as any } : b))
      })),
      swapVendor: async (bookingId, service, newVendorId) => {
        try {
          const res = await customerBookingAPI.swapVendor(bookingId, { service, newVendorId });
          if (res.ok && res.data?.data) {
            const updatedBooking = res.data.data;
            set((state) => ({
              bookings: state.bookings.map((b) =>
                (b.id || b._id) === bookingId ? updatedBooking : b
              )
            }));
          }
        } catch (error) {
          console.error("Swap vendor error:", error);
        }
      },
      vendorRespondBooking: async (bookingId, service, status) => {
        // Just mock the state update for demonstration, as vendor routes require vendor auth token
        set((state) => ({
          bookings: state.bookings.map((b) =>
            (b.id || b._id) === bookingId ? {
              ...b,
              vendors: {
                ...b.vendors,
                [service]: {
                  ...(b.vendors?.[service as keyof typeof b.vendors] as any),
                  status
                }
              }
            } : b
          )
        }));
      },
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
