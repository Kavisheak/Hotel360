import React from "react";
import UpcomingEventFilters from "./UpcomingEventFilters";
import UpcomingEventForm from "./UpcomingEventForm";
import UpcomingEventList from "./UpcomingEventList";
import Footer from "../shared/Footer";

const UpcomingEventsMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8 mt-4">
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
            <span>VIDEOGRAPHER</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#7C6A2E]">UPCOMING EVENTS</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Upcoming Events
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Manage your upcoming shoot schedule, add new events, and track confirmation status.
          </p>
        </div>

        {/* Filters */}
        <UpcomingEventFilters />

        {/* Main Layout: Form + List */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1.2fr)] gap-6">
          <UpcomingEventForm />
          <UpcomingEventList />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpcomingEventsMain;
