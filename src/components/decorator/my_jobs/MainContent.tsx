import React from 'react';
import Header from './Header';
import JobQueue from './JobQueue';
import Footer from './Footer';

const MainContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />
      <div className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-serif text-[#7C6A2E] mb-2 tracking-tight">Job Queue</h2>
            <p className="text-gray-500 font-serif italic text-lg">Overseeing elegance for upcoming celebrations.</p>
          </div>
        </div>
        
        <JobQueue />
      </div>
      <Footer />
    </div>
  );
};

export default MainContent;
