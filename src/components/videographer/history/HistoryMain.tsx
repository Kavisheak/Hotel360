import React from 'react';
import Footer from '../shared/Footer';
import HistoryHeader from './HistoryHeader';
import HistoryStats from './HistoryStats';
import HistoryTable from './HistoryTable';
import MediaArchive from './MediaArchive';

const HistoryMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <HistoryHeader />
        <HistoryStats />
        <HistoryTable />
        <MediaArchive />
      </div>
      <Footer />
    </div>
  );
};

export default HistoryMain;
