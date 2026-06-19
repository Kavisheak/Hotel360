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
  id: string;
  clientName: string;
  email: string;
  eventType: string; // e.g. "Grand Ballroom Ceremony" derived from package
  date: string; // Formatted date string
  guests: number;
  status: "Pending" | "Confirmed" | "Rejected" | "Completed";
  totalCost: number;
  package?: string;
  vendors: {
    decorator: string;
    dj: string;
    videographer: string;
  };
  menuType: string;
  createdAt: string;
  feedback?: Feedback;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: "Pending" | "Confirmed" | "Rejected" | "Completed") => void;
  submitFeedback: (id: string, feedback: Feedback) => void;
  getPendingBookings: () => Booking[];
  getConfirmedBookings: () => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [
        // Initialize with some mock data for the dashboard to look populated
        {
          id: "bk-1001",
          clientName: "Eleanor Rigby",
          email: "eleanor@example.com",
          eventType: "Grand Wedding Gala",
          date: "Oct 24, 2024",
          guests: 250,
          status: "Pending",
          totalCost: 4500000,
          vendors: { decorator: "none", dj: "none", videographer: "none" },
          menuType: "signature",
          createdAt: new Date().toISOString()
        },
        {
          id: "bk-1002",
          clientName: "Amelia & Thomas",
          email: "amelia@example.com",
          eventType: "Grand Ballroom Ceremony",
          date: "Oct 12, 2024",
          guests: 250,
          status: "Confirmed",
          totalCost: 5200000,
          vendors: { decorator: "none", dj: "none", videographer: "none" },
          menuType: "custom",
          createdAt: new Date().toISOString()
        },
        {
          id: "bk-1003",
          clientName: "Royal Polo Club",
          email: "royal@example.com",
          eventType: "Corporate Anniversary",
          date: "Oct 28, 2024",
          guests: 400,
          status: "Confirmed",
          totalCost: 3800000,
          vendors: { decorator: "none", dj: "none", videographer: "none" },
          menuType: "signature",
          createdAt: new Date().toISOString()
        },
        {
          id: "bk-1004",
          clientName: "David & Sarah",
          email: "david@example.com",
          eventType: "Intimate Garden Wedding",
          date: "Sep 15, 2023",
          guests: 100,
          status: "Completed",
          totalCost: 2100000,
          vendors: { decorator: "Floral Symphony", dj: "DJ Spark", videographer: "Cinematic Memories" },
          menuType: "signature",
          createdAt: new Date().toISOString()
        }
      ],
      addBooking: (booking) => 
        set((state) => ({ bookings: [booking, ...state.bookings] })),
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === id ? { ...b, status } : b
          )
        })),
      getPendingBookings: () => get().bookings.filter(b => b.status === "Pending"),
      getConfirmedBookings: () => get().bookings.filter(b => b.status === "Confirmed"),
      submitFeedback: (id, feedback) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, feedback } : b
          )
        })),
    }),
    {
      name: "booking-storage-v3",
    }
  )
);
