"use client";

import React, { useState } from "react";

const UpcomingEventFilters = () => {
  const [search, setSearch] = useState("");

  return (
    <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search upcoming events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-[#E0D8C3] bg-white p-3 text-sm focus:border-[#B08D2C] outline-none lg:max-w-md"
      />

      {/* FILTERS */}
      <div className="flex gap-3">
        <select className="border border-[#E0D8C3] p-2 text-sm">
          <option>All Dates</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>

        <select className="border border-[#E0D8C3] p-2 text-sm">
          <option>Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
        </select>
      </div>
    </section>
  );
};

export default UpcomingEventFilters;