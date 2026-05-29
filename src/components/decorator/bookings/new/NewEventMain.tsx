import React from 'react';
import NewEventHeader from './NewEventHeader';
import ClientInformation from './ClientInformation';
import DecorationSpecifications from './DecorationSpecifications';
import VisualInspirationUpload from './VisualInspirationUpload';
import EventLogistics from './EventLogistics';
import PackageTheme from './PackageTheme';
import Footer from '../../my_jobs/Footer';

const NewEventMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs & Header */}
        <NewEventHeader />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Client Details, Specs, Upload dropzone */}
          <div className="lg:col-span-2 space-y-6">
            <ClientInformation />
            <DecorationSpecifications />
            <VisualInspirationUpload />
          </div>

          {/* Right Column: Event Logistics, Package/Theme selection */}
          <div className="space-y-6">
            <EventLogistics />
            <PackageTheme />
          </div>
        </div>

        {/* Create Event Submit row */}
        <div className="flex justify-end border-t border-[#E0D8C3] pt-6 mb-12">
          <button className="bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-8 py-3.5 font-semibold text-xs tracking-widest transition-colors shadow-md uppercase">
            CREATE EVENT BRIEF
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewEventMain;
