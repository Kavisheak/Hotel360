import React from 'react';
import BookingsHeader from './BookingsHeader';
import VenueImage from './VenueImage';
import ClientInfo from './ClientInfo';
import SelectedPackage from './SelectedPackage';
import AssignedArtisans from './AssignedArtisans';
import ManagerActions from './ManagerActions';

const BookingsMain = () => (
  <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
    {/* Sticky top header matching overview */}
    <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
      <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Bookings</h2>
    </header>

    <main className="flex-1 px-4 lg:px-6 py-6">
      <BookingsHeader />

      {/* Two-column layout: main content + side panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: main booking content */}
        <div className="flex-1 min-w-0">
          <VenueImage />

          {/* Client Info + Package grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
            <ClientInfo />
            <SelectedPackage />
          </div>

          <AssignedArtisans />
        </div>

        {/* Right: manager action panel */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <ManagerActions />
        </div>
      </div>
    </main>
  </div>
);

export default BookingsMain;
