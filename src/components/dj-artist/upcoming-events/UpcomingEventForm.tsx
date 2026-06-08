"use client";

import React, { useState } from "react";

const UpcomingEventForm = () => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upcoming Event:", form);
    alert("Event Created Successfully");
  };

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Create Upcoming Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

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
          placeholder="Venue"
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          rows={4}
          className="w-full border border-[#E0D8C3] p-3 text-sm focus:border-[#B08D2C] outline-none"
        />

        <button
          type="submit"
          className="w-full bg-[#8C6A11] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#7A5C0F]"
        >
          Add Event
        </button>
      </form>
    </article>
  );
};

export default UpcomingEventForm;