import React from "react";
import Image from "next/image";

interface SpotlightBannerProps {
  imageSrc?: string;
}

export default function SpotlightBanner({ imageSrc = "/images/05.png" }: SpotlightBannerProps) {
  return (
    <section className="relative overflow-hidden border border-[#E0D8C3] bg-[#3E2D16] text-white">
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="DJ artist spotlight banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover opacity-60"
        />
      </div>

      <div className="relative flex min-h-[190px] flex-col justify-end p-8 md:max-w-[70%]">
        <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[#D7B85F]">
          Featured Spotlight
        </p>
        <h3 className="max-w-xl font-serif text-[32px] leading-tight">
          Your Summer Ibiza Residency Brochure is Ready.
        </h3>
        <button className="mt-5 w-fit bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A2112] transition hover:bg-[#F6E9C6]">
          Download Portfolio
        </button>
      </div>
    </section>
  );
}