import React from "react";
import Sidebar from "@/components/dj-artist/overview/Sidebar";

const UpcomingEventsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#8C6A11]">
            Upcoming Events
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            View and manage all scheduled upcoming DJ events
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: FORM */}
          <div className="border border-[#E0D8C3] bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#7C6A2E] mb-4">
              Create Upcoming Event
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                className="w-full border p-3 text-sm"
              />

              <input
                type="date"
                className="w-full border p-3 text-sm"
              />

              <input
                type="time"
                className="w-full border p-3 text-sm"
              />

              <input
                type="text"
                placeholder="Venue"
                className="w-full border p-3 text-sm"
              />

              <textarea
                placeholder="Notes"
                className="w-full border p-3 text-sm"
                rows={4}
              />

              <button
                type="submit"
                className="w-full bg-[#8C6A11] text-white py-3 text-xs tracking-widest font-bold"
              >
                ADD EVENT
              </button>
            </form>
          </div>

          {/* RIGHT: LIST */}
          <div className="border border-[#E0D8C3] bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#7C6A2E] mb-4">
              Scheduled Events
            </h2>

            <div className="space-y-4">
              <div className="border p-4">
                <p className="font-semibold">Wedding Event</p>
                <p className="text-xs text-gray-500">Oct 24, 2024</p>
              </div>

              <div className="border p-4">
                <p className="font-semibold">Corporate Night</p>
                <p className="text-xs text-gray-500">Nov 12, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpcomingEventsPage;