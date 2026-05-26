import React from 'react';
import BookingsHeader from './historyHeader';
import StatsCards from './StatsCards';
import BookingsTable from './historyTable';
import VisualArchive from './VisualArchive';
import Footer from '../my_jobs/Footer';

const BookingsMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <BookingsHeader />
        <StatsCards />
        <BookingsTable />
        <VisualArchive />
      </div>
      <Footer />
    </div>
  );
};

export default BookingsMain;
