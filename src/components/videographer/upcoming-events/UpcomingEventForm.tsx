"use client";

import React, { useState } from "react";

const UpcomingEventForm = () => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    eventType: "Wedding",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upcoming Shoot:", form);
    alert("Shoot Added Successfully");
  };

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Add Upcoming Shoot
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event / Wedding Name"
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <select
          name="eventType"
          value={form.eventType}
          onChange={handleChange}
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none bg-white text-gray-700"
        >
          <option>Wedding</option>
          <option>Engagement Session</option>
          <option>Pre-Wedding Shoot</option>
          <option>Corporate Event</option>
          <option>Anniversary</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <input
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Venue / Location"
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (shot list, special requirements...)"
          rows={4}
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <button
          type="submit"
          className="w-full bg-[#8C6A11] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#7A5C0F]"
        >
          Add Shoot
        </button>
      </form>
    </article>
  );
};

export default UpcomingEventForm;
