import React from 'react';
import { UploadCloud } from 'lucide-react';
import Link from 'next/link';

const PortfolioHeader = () => {
  return (
    <div className="mb-8 mt-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-4">
        <span>PORTAL</span>
        <span className="text-gray-400">›</span>
        <span className="text-[#7C6A2E]">MY PORTFOLIO</span>
      </div>

      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          {/* Main grand header matching the mockup serif title font size and italic subtitle */}
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Gallery of Excellence
          </h1>
          <p className="text-sm font-serif italic text-gray-500 max-w-2xl leading-relaxed">
            Curating the artistry of high-status celebrations and immersive event environments.
          </p>
        </div>

        {/* Upload Button matches mockup style */}
        <Link 
          href="/decorator/portfolio/new" 
          className="flex items-center justify-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-3.5 font-semibold text-xs tracking-widest transition-colors shadow-md shrink-0 self-start md:mt-1 uppercase"
        >
          <UploadCloud size={16} />
          <span>UPLOAD NEW WORK</span>
        </Link>
      </div>
    </div>
  );
};

export default PortfolioHeader;
