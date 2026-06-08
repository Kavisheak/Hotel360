import React from 'react';
import Header from './Header';
import BookingStats from './BookingStats';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import BookingDetailsModal from './BookingDetailsModal';
import EventCalendar from './EventCalendar';
import RecentBookings from './RecentBookings';

const MainContent = () => {
  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col bg-[#FDF9F1]">
      <div className="px-4 py-6 sm:px-8 lg:px-10 max-w-7xl mx-auto w-full">
        <Header />
        <BookingStats />
        <BookingFilters />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.8fr)]">
          <div className="space-y-6">
            <BookingTable />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
              <EventCalendar />
              <RecentBookings />
            </div>
          </div>

          <div className="space-y-6">
            <BookingDetailsModal />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
