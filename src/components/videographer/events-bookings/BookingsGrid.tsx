"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Booking {
  code: string;
  status: "UPCOMING" | "CONFIRMED" | "COMPLETED";
  title: string;
  eventName: string;
  customer: string;
  date: string;
  location: string;
  videoPackage: string;
  image: string;
}

const bookingsData: Booking[] = [
  {
    code: "#VG-2241",
    status: "CONFIRMED",
    title: "The Sterling-Vance Wedding",
    eventName: "Wedding Ceremony & Reception",
    customer: "Eleanor Sterling",
    date: "July 24, 2026 · 10:00 AM",
    location: "Rosewood Estate, London",
    videoPackage: "Cinematic Wedding Package",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "#VG-2298",
    status: "UPCOMING",
    title: "Okafor Engagement Session",
    eventName: "Pre-Wedding Engagement Shoot",
    customer: "Amara Okafor",
    date: "August 05, 2026 · 05:00 PM",
    location: "Hyde Park Gardens, London",
    videoPackage: "Engagement Session Package",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "#VG-2354",
    status: "COMPLETED",
    title: "Harrison Corporate Gala",
    eventName: "Annual Corporate Event",
    customer: "James Harrison",
    date: "June 14, 2026 · 06:30 PM",
    location: "Claridge's Hotel, Mayfair",
    videoPackage: "Corporate Event Package",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "#VG-2381",
    status: "UPCOMING",
    title: "Montague Anniversary Gala",
    eventName: "25th Wedding Anniversary",
    customer: "Richard Montague",
    date: "September 12, 2026 · 03:00 PM",
    location: "The Savoy, London",
    videoPackage: "Premium Documentary Package",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80",
  },
];

const BookingsGrid = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

<<<<<<< Updated upstream
  const filteredBookings = bookingsData.filter(
=======
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          const mappedBookings = data.data.map((b: any) => ({
            _id: b._id,
            code: b.bookingRef || `#VG-${Math.floor(Math.random() * 9000)}`,
            status: b.vendors?.videographer?.status?.toUpperCase() || "PENDING",
            title: `${b.eventType} for ${b.clientName || (b.customerId ? `${b.customerId.firstName} ${b.customerId.lastName}` : "Client")}`,
            eventName: b.eventType,
            customer: b.clientName || (b.customerId ? `${b.customerId.firstName} ${b.customerId.lastName}` : "Client"),
            date: new Date(b.date).toLocaleDateString() + " · " + (b.timeslot || "10:00 AM"),
            location: b.location || "Venue TBD",
            videoPackage: b.vendors?.videographer?.packageName || "Custom Package",
            image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
          }));
          setBookings(mappedBookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
>>>>>>> Stashed changes
    (booking) =>
      booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by event title, customer or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] tracking-wide"
          />
        </div>

        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C]">
              <option>Status: All</option>
              <option>Upcoming</option>
              <option>Confirmed</option>
              <option>Completed</option>
            </select>

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C]">
              <option>Sort: Earliest Date</option>
              <option>Latest Date</option>
              <option>Status</option>
            </select>

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredBookings.map((booking) => (
          <div
            key={booking.code}
            className="bg-white border border-[#E0D8C3] overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative w-full sm:w-[42%] h-56 sm:h-auto shrink-0 overflow-hidden group">
              <img
                src={booking.image}
                alt={booking.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm ${booking.status === "CONFIRMED"
                        ? "bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]"
                        : booking.status === "COMPLETED"
                          ? "bg-[#EAF4EC] text-[#2E7A3E] border border-[#D8EBD9]"
                          : "bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]"
                      }`}
                  >
                    {booking.status}
                  </span>

                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                    {booking.code}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-1">
                  {booking.title}
                </h3>

                <p className="text-xs text-gray-500 mb-3 font-serif italic">{booking.eventName}</p>

                <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#A6955C]" />
                    <span>{booking.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#A6955C]" />
                    <span>{booking.location}</span>
                  </div>
                </div>

                <p className="text-xs font-serif italic text-gray-500 leading-relaxed border-l-2 border-[#E0D8C3] pl-3 py-0.5 mb-4">
                  {booking.videoPackage}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/videographer/events-bookings/${booking.code.replace('#', '')}`)}
                  className="flex-1 border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase"
                >
                  VIEW DETAILS
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 px-4 py-2 text-xs font-bold tracking-widest transition-colors uppercase"
                >
                  <Video size={12} />
                  CONTACT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 my-12">
        <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">
          <ChevronLeft size={14} />
        </button>

        <button className="w-9 h-9 border border-[#7C6A2E] bg-[#7C6A2E] text-white flex items-center justify-center font-bold text-xs">
          1
        </button>

        <button className="w-9 h-9 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 flex items-center justify-center font-bold text-xs transition-colors">
          2
        </button>

        <button className="w-9 h-9 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 flex items-center justify-center font-bold text-xs transition-colors">
          3
        </button>

        <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default BookingsGrid;
