import React from 'react';

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white rounded-md shadow-sm border border-[#EDE6D6] p-6">
    <p className="text-xs font-bold tracking-[0.15em] text-gray-500 uppercase">{title}</p>
    <p className="text-2xl font-bold text-[#7C6A2E] mt-2">{value}</p>
  </div>
);

const OverviewMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="px-10 py-6 border-b border-[#E0D8C3] bg-[#FDF9F1]"></div>

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-5xl font-serif text-[#7C6A2E] mb-2 tracking-tight">Welcome back, DJ Artist</h1>
          <p className="text-gray-500 font-serif italic text-lg">Your curated itinerary for the season ahead.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Bookings" value="142" />
          <StatCard title="This Month" value="18" />
          <StatCard title="Average Rating" value="4.9" />
          <StatCard title="Pending Actions" value="03" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#EDE6D6] rounded-md p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Monthly Performance</h3>
            <div className="h-48 bg-gradient-to-b from-[#FFF6E8] to-white rounded-md flex items-center justify-center text-gray-300">[Chart Placeholder]</div>
          </div>

          <aside className="bg-white border border-[#EDE6D6] rounded-md p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Recent Activity</h3>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="border-b border-[#F2EADA] pb-3">Claridge's Wedding — Confirmed</li>
              <li className="border-b border-[#F2EADA] pb-3">The Ritz Gala — Deposit Paid</li>
              <li>New Review — 5.0 Star</li>
            </ul>
          </aside>
        </div>

        <div className="mt-8 bg-[#F7EFD9] border border-[#E6DCC2] rounded-md p-8 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-serif text-[#7C6A2E]">Your Summer Ibiza Residency Brochure is Ready.</h4>
            <p className="text-sm text-gray-700 mt-2">Download your updated portfolio for prospective clients.</p>
          </div>
          <button className="bg-[#7C6A2E] hover:bg-[#685724] text-white px-6 py-3 rounded-md font-semibold shadow-md">Download Portfolio</button>
        </div>
      </div>
    </div>
  );
};

export default OverviewMain;
