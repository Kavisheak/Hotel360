import React from 'react';

const PortfolioInformation = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <span className="w-4 h-4 rounded-full bg-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">PORTFOLIO INFORMATION</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard label="FEATURED REELS" value="18" />
        <InfoCard label="CLIENT ALBUMS" value="42" />
        <InfoCard label="TURNAROUND" value="24 HRS" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <span className="text-xs font-semibold text-gray-700">Portfolio Link</span>
          <span className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">hotel360video.com/amaan</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <span className="text-xs font-semibold text-gray-700">Upload Status</span>
          <span className="text-[10px] font-bold tracking-widest text-[#4C7A4F] uppercase">SYNCED</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">Featured Client Types</span>
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">WEDDINGS · GALA · BRAND EVENTS</span>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-4 shadow-sm">
    <p className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">{label}</p>
    <p className="text-2xl font-serif font-bold text-[#7C6A2E] tracking-tight">{value}</p>
  </div>
);

export default PortfolioInformation;
