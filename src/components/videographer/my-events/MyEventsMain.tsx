import React from 'react';
import Footer from '../shared/Footer';
import MyEventsHeader from './MyEventsHeader';
import MyEventsStats from './MyEventsStats';
import MyEventsGrid from './MyEventsGrid';

const MyEventsMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <MyEventsHeader />
        <MyEventsStats />
        <MyEventsGrid />
      </div>
      <Footer />
    </div>
  );
};

export default MyEventsMain;
