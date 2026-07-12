export const VENUE_NAME = "EASCCA Wedding Hall";

export const getApiBase = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getApiImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${getApiBase()}${path}`;
  return path;
};

export const getClientFullName = (booking: any) => {
  if (booking?.customerId?.firstName) {
    return `${booking.customerId.firstName} ${booking.customerId.lastName || ""}`.trim();
  }
  if (booking?.clientName) return booking.clientName;
  return "Client";
};

export const getClientPhone = (booking: any) =>
  booking?.phone || booking?.customerId?.phone || "Not provided";

export const getClientEmail = (booking: any) =>
  booking?.email || booking?.customerId?.email || "Not provided";

export const getClientFirstName = (booking: any) => {
  if (booking?.customerId?.firstName) return booking.customerId.firstName;
  if (booking?.clientFirstName) return booking.clientFirstName;
  if (booking?.clientName) return booking.clientName.split(" ")[0];
  return "Client";
};

export const getClientDisplayName = (booking: any) => {
  const first = getClientFirstName(booking);
  return booking?.eventType ? `${first}'s ${booking.eventType}` : first;
};

export const getVendorStatus = (booking: any, vendorKey: "decorator" | "dj" | "videographer") =>
  booking?.vendors?.[vendorKey]?.status || "Pending";

export const isUpcomingVendorJob = (booking: any, vendorKey: "decorator" | "dj" | "videographer") => {
  const status = getVendorStatus(booking, vendorKey);
  if (status === "Completed" || status === "Declined" || status === "NotRequired") return false;
  return new Date(booking.date) >= new Date(new Date().setHours(0, 0, 0, 0));
};

export const isActiveVendorJob = (booking: any, vendorKey: "decorator" | "dj" | "videographer") => {
  const status = getVendorStatus(booking, vendorKey);
  return status !== "Completed" && status !== "Declined" && status !== "NotRequired";
};

export const formatTimeslot = (booking: any) => booking?.timeslot || "18:00 - 23:00";

export const getPackageName = (booking: any, vendorKey: "decorator" | "dj" | "videographer") =>
  booking?.vendors?.[vendorKey]?.packageName || booking?.packageName || "Custom Package";

export const getBookingRef = (booking: any) =>
  booking?.bookingRef || `#${(booking?._id || "").slice(-6).toUpperCase()}`;

export const parseBookingDate = (value?: string | Date | null): Date => {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  return new Date(String(value));
};

export const isSameCalendarDay = (a: Date, b: Date): boolean => {
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const normalizeCalendarDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
