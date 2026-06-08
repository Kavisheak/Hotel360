import React from "react";
import Image from "next/image";

const images = [
  { src: "/images/01.png", label: "01" },
  { src: "/images/02.png", label: "02" },
  { src: "/images/03.png", label: "03" },
  { src: "/images/04.png", label: "04" },
];

export default function ImageGallery() {
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[28px] font-serif text-gray-800">Performance Moments</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Gallery</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {images.map((image) => (
          <div key={image.label} className="group relative aspect-[4/5] overflow-hidden border border-[#E0D8C3] bg-[#EFE7D7]">
            <Image
              src={image.src}
              alt={`DJ performance ${image.label}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Moment {image.label}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}