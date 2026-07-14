import React from 'react';

const ReportsHeader = () => (
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
    <div>
      <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800">
        Performance Reports
      </h2>
      <p className="text-sm italic text-[#A6955C] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Comprehensive analytics for the period of 2024 fiscal year
      </p>
    </div>
  </div>
);

export default ReportsHeader;
