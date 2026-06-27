"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { djAPI } from "@/lib/api";

interface Booking {
  _id: string;
  bookingRef?: string;
  status: "UPCOMING" | "CONFIRMED" | "COMPLETED";
  title: string;
  date: string;
  location: string;
  djPackage: string;
  image: string;
}

const bookingsData: Booking[] = [
  {
    code: "#BK-8842",
    status: "CONFIRMED",
    title: "The Sterling-Vance Wedding",
    date: "July 24, 2026 · 06:00 PM",
    location: "Rosewood Estate",
    djPackage: "Diamond DJ Package",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "#BK-9012",
    status: "UPCOMING",
    title: "Corporate Annual Gala",
    date: "August 02, 2026 · 07:00 PM",
    location: "Grand Convention Hall",
    djPackage: "Premium DJ Package",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "#BK-9104",
    status: "COMPLETED",
    title: "Birthday Celebration",
    date: "June 14, 2026 · 08:00 PM",
    location: "Ocean View Resort",
    djPackage: "Gold DJ Package",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=600&q=80",
  },
];

interface BookingsGridProps {
  bookings: any[];
  loading: boolean;
}

const BookingsGrid = ({ bookings = [], loading = false }: BookingsGridProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Earliest Date");
  
  let filteredBookings = [...bookings].filter(
    (booking) =>
      (booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.eventType?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || (booking.vendors?.dj?.status || "Pending") === statusFilter)
  );

  if (sortFilter === 'Earliest Date') {
    filteredBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortFilter === 'Latest Date') {
    filteredBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortFilter === 'Status') {
    filteredBookings.sort((a, b) => (a.vendors?.dj?.status || '').localeCompare(b.vendors?.dj?.status || ''));
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

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
            placeholder="Search by event title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] tracking-wide"
          />
        </div>

        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
            </select>

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select 
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            >
              <option value="Earliest Date">Sort: Earliest Date</option>
              <option value="Latest Date">Latest Date</option>
              <option value="Status">Status</option>
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
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-gray-500 animate-pulse">
            Loading DJ bookings...
          </div>
        ) : currentItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic">
            No DJ bookings found.
          </div>
        ) : currentItems.map((booking, idx) => {
          const djStatus = booking.vendors?.dj?.status || 'Pending';
          const imgUrl = booking.vendors?.dj?.completionPhotos?.[0] || 
            (idx % 2 === 0 
              ? 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80' 
              : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80');

          return (
          <div
            key={booking._id}
            className="bg-white border border-[#E0D8C3] overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative w-full sm:w-[42%] h-56 sm:h-auto shrink-0 overflow-hidden group">
              <img
                src={imgUrl}
                alt={booking.eventType || "Event"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm ${
                      djStatus === "Accepted"
                        ? "bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]"
                        : djStatus === "Completed"
                        ? "bg-[#EAF4EC] text-[#2E7A3E] border border-[#D8EBD9]"
                        : "bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]"
                    }`}
                  >
                    {djStatus === "Pending" ? "ACTION REQUIRED" : djStatus.toUpperCase()}
                  </span>

                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                    {booking.bookingRef || `#${booking._id.slice(-6).toUpperCase()}`}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-3">
                  {booking.clientName ? `${booking.clientName}'s ${booking.eventType}` : booking.eventType}
                </h3>

                <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#A6955C]" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#A6955C]" />
                    <span>Venue</span>
                  </div>
                </div>

                <p className="text-xs font-serif italic text-gray-500 leading-relaxed border-l-2 border-[#E0D8C3] pl-3 py-0.5 mb-4">
                  {booking.package?.name || "Custom Package"}
                </p>
              </div>

              <button
                onClick={() => router.push(`/dj-artist/events-bookings/${booking._id}`)}
                className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase text-center block"
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        )})}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 my-12">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 border flex items-center justify-center font-bold text-xs transition-colors ${
                currentPage === i + 1 
                  ? 'border-[#7C6A2E] bg-[#7C6A2E] text-white' 
                  : 'border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsGrid;