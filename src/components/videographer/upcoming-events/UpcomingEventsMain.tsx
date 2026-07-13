"use client";

import React, { useState } from "react";
import UpcomingEventFilters from "./UpcomingEventFilters";
import UpcomingEventList from "./UpcomingEventList";
import Footer from "../shared/Footer";

const UpcomingEventsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <div className="mb-8 mt-4">
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
            <span>VIDEOGRAPHER</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#7C6A2E]">UPCOMING EVENTS</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Assigned Shoots
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            View shoots assigned by the manager or from customer bookings. Accept or decline new requests here.
          </p>
        </div>

        <UpcomingEventFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <UpcomingEventList searchTerm={searchTerm} statusFilter={statusFilter} />
      </div>

      <Footer />
    </div>
  );
};

export default UpcomingEventsMain;
