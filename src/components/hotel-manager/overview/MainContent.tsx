import React from 'react';
import ManagerHeader from './Header';
import Metrics from './Metrics';
import PendingBookings from './PendingBookings';
import ConfirmedHighlights from './ConfirmedHighlights';
import ManagerFooter from './Footer';

const ManagerMainContent = () => (
  <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
    <ManagerHeader />
    <main className="flex-1 px-4 lg:px-6 py-6 overflow-y-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-serif font-semibold text-gray-800">Welcome Back, Sattar</h2>
        <p className="text-sm italic text-[#A6955C] mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "Ensuring every union is an elite masterpiece."
        </p>
      </div>

      <Metrics />
      <PendingBookings />
      <ConfirmedHighlights />
    </main>
    <ManagerFooter />
  </div>
);

export default ManagerMainContent;
