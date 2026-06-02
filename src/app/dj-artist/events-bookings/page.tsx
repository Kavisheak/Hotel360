import React from 'react';
import Sidebar from '../../../components/dj-artist/events-bookings/Sidebar';
import EventsMain from '../../../components/dj-artist/events-bookings/EventsMain';

const DjEventsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <EventsMain />
      </div>
    </div>
  );
};

export default DjEventsPage;
