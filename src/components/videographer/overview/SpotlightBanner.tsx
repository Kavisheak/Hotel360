import React from 'react';

export default function SpotlightBanner() {
  return (
    <section className="relative overflow-hidden border border-[#E0D8C3] bg-[#3E2D16] text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=80')",
        }}
      />
      <div className="relative flex min-h-[190px] flex-col justify-end p-8 md:max-w-[70%]">
        <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[#D7B85F]">
          Featured Portfolio
        </p>
        <h3 className="max-w-xl font-serif text-[32px] leading-tight">
          Your Summer Wedding Showreel is Ready.
        </h3>
        <button className="mt-5 w-fit bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A2112] transition hover:bg-[#F6E9C6]">
          Download Showreel
        </button>
      </div>
    </section>
  );
}
