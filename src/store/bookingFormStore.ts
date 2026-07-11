import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingFormState {
  currentStep: number;
  selectedDate: number;
  startTime: string;
  endTime: string;
  selectedPackage: string;
  eventType: string;
  guestCount: number;
  isDirty: boolean;
  
  setStep: (step: number) => void;
  setSelectedDate: (date: number) => void;
  setTime: (start: string, end: string) => void;
  setSelectedPackage: (pkg: string) => void;
  setEventType: (type: string) => void;
  setGuestCount: (count: number) => void;
  setField: (key: keyof BookingFormState, value: any) => void;
  clearForm: () => void;
}

export const useBookingFormStore = create<BookingFormState>()(
  persist(
    (set) => ({
      currentStep: 1,
      selectedDate: 0,
      startTime: "18:00",
      endTime: "23:00",
      selectedPackage: "gold",
      eventType: "Wedding",
      guestCount: 380,
      isDirty: false,

      setStep: (step) => set({ currentStep: step }),
      setSelectedDate: (date) => set({ selectedDate: date, isDirty: true }),
      setTime: (start, end) => set({ startTime: start, endTime: end, isDirty: true }),
      setSelectedPackage: (pkg) => set({ selectedPackage: pkg, isDirty: true }),
      setEventType: (type) => set({ eventType: type, isDirty: true }),
      setGuestCount: (count) => set({ guestCount: count, isDirty: true }),
      setField: (key, value) => set({ [key]: value, isDirty: true } as any),
      clearForm: () => set({
        currentStep: 1,
        selectedDate: 0,
        startTime: "18:00",
        endTime: "23:00",
        selectedPackage: "gold",
        eventType: "Wedding",
        guestCount: 380,
        isDirty: false,
      }),
    }),
    {
      name: "booking-form", // unique name for localStorage key
    }
  )
);
