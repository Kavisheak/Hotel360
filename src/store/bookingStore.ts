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
  status: "Pending" | "DEPOSIT_PAID" | "Pending Confirmation" | "Pending Hall Confirmation" | "Confirmed" | "Completed" | "Cancelled" | "Rejected" | "CancellationRequested";
  rejectionReason?: string;
  totalCost: number;
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate?: string;
  paymentHistory?: {
    _id?: string;
    amount: number;
    paymentType: string;
    method: string;
    status: string;
    timestamp: string;
    note?: string;
  }[];
  bookingCredit?: number;
  packageId?: string;
  packageName: string;
  package?: string;
  menuType: string;
  customMenuItems: string[];
  vendors: {
    decorator?: {
      vendorId: string | null;
      status: "Awaiting Hall Confirmation" | "Pending" | "Accepted" | "Declined" | "Expired" | "NotRequired";
      packageName: string;
    };
    dj?: {
      vendorId: string | null;
      status: "Awaiting Hall Confirmation" | "Pending" | "Accepted" | "Declined" | "Expired" | "NotRequired";
      packageName: string;
    };
    videographer?: {
      vendorId: string | null;
      status: "Awaiting Hall Confirmation" | "Pending" | "Accepted" | "Declined" | "Expired" | "NotRequired";
      packageName: string;
    };
    photographer?: {
      vendorId: string | null;
      status: "Awaiting Hall Confirmation" | "Pending" | "Accepted" | "Declined" | "Expired" | "NotRequired";
      packageName: string;
    };
    cake?: {
      vendorId: string | null;
      status: "Awaiting Hall Confirmation" | "Pending" | "Accepted" | "Declined" | "Expired" | "NotRequired";
      packageName: string;
    };
    florist?: {
      vendorId: string | null;
      status: "Awaiting Hall Confirmation" | "Pending" | "Accepted" | "Declined" | "Expired" | "NotRequired";
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
    photographerCost?: number;
    cakeCost?: number;
    floristCost?: number;
    customMenuSurcharge?: number;
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
  submitFeedback: (id: string, feedback: Feedback) => Promise<void>;
  initiateVendorSwap: (bookingId: string, service: string, newVendorId: string, packageName?: string, financialChoice?: string) => Promise<{ success: boolean; pendingSwap?: boolean; data?: any }>;
  confirmSwapPayment: (bookingId: string, pendingSwapId: string) => Promise<{ success: boolean; data?: any }>;
  removeVendor: (bookingId: string, service: string, action?: 'refund' | 'apply_to_balance') => Promise<void>;
  vendorRespondBooking: (bookingId: string, service: string, status: "Accepted" | "Declined") => Promise<void>;
  deleteBookingHistory: (id: string) => Promise<void>;
  clearBookingHistory: () => Promise<void>;
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
      initiateVendorSwap: async (bookingId, service, newVendorId, packageName, financialChoice) => {
        try {
          const res = await customerBookingAPI.initiateVendorSwap(bookingId, { service, newVendorId, packageName, financialChoice });
          if (res.ok && res.data) {
            if (!res.data.pendingSwap && res.data.data) {
              const updatedBooking = res.data.data;
              set((state) => ({
                bookings: state.bookings.map((b) =>
                  (b.id || b._id) === bookingId ? updatedBooking : b
                )
              }));
            }
            return res.data;
          }
          return { success: false, message: res.data?.message || "Request failed" };
        } catch (error) {
          console.error("Initiate swap error:", error);
          return { success: false, message: "Network error" };
        }
      },
      confirmSwapPayment: async (bookingId, pendingSwapId) => {
        try {
          const res = await customerBookingAPI.confirmSwapPayment(bookingId, { pendingSwapId });
          if (res.ok && res.data?.data) {
            const updatedBooking = res.data.data;
            set((state) => ({
              bookings: state.bookings.map((b) =>
                (b.id || b._id) === bookingId ? updatedBooking : b
              )
            }));
            return res.data;
          }
          return { success: false };
        } catch (error) {
          console.error("Confirm swap error:", error);
          return { success: false };
        }
      },
      removeVendor: async (bookingId, service, financialChoice) => {
        try {
          const res = await customerBookingAPI.removeVendor(bookingId, { service, financialChoice });
          if (res.ok) {
            const updatedBooking = res.data?.data || res.data?.booking;
            if (updatedBooking) {
              set((state) => ({
                bookings: state.bookings.map((b) =>
                  (b.id || b._id) === bookingId ? updatedBooking : b
                )
              }));
            }
          }
        } catch (error) {
          console.error("Remove vendor error:", error);
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
      submitFeedback: async (id, feedback) => {
        try {
          const booking = get().bookings.find(b => (b.id || b._id) === id);
          if (!booking) return;

          const reviewsPayload: any[] = [];
          const validServices = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
          
          for (const service of validServices) {
            const rating = feedback[service as keyof typeof feedback] as number;
            const reviewText = (feedback.comments as any)[service];
            const vendorId = booking.vendors?.[service as keyof typeof booking.vendors]?.vendorId;
            
            if (rating && vendorId && vendorId !== "none") {
              reviewsPayload.push({
                service,
                vendorId,
                rating,
                reviewText: reviewText || ""
              });
            }
          }

          if (reviewsPayload.length > 0) {
            const res = await customerBookingAPI.submitReview(id, { reviews: reviewsPayload });
            if (res.ok) {
              set((state) => ({
                bookings: state.bookings.map((b) =>
                  b._id === id || b.id === id ? { ...b, feedback } : b
                )
              }));
            }
          } else {
             // Still save local state if there are no vendor reviews (e.g. only food/overall)
             set((state) => ({
                bookings: state.bookings.map((b) =>
                  b._id === id || b.id === id ? { ...b, feedback } : b
                )
              }));
          }
        } catch (error) {
          console.error("Failed to submit feedback:", error);
        }
      },
      deleteBookingHistory: async (id) => {
        try {
          const res = await customerBookingAPI.deleteBookingHistory(id);
          if (res.ok && res.data.success) {
            set((state) => ({
              bookings: state.bookings.filter(b => (b.id || b._id) !== id)
            }));
          }
        } catch (error) {
          console.error("Delete booking history error:", error);
        }
      },
      clearBookingHistory: async () => {
        try {
          const res = await customerBookingAPI.clearBookingHistory();
          if (res.ok && res.data.success) {
            set({ bookings: [] });
          }
        } catch (error) {
          console.error("Clear booking history error:", error);
        }
      },
    }),
    {
      name: "booking-storage-v3",
    }
  )
);
