import React from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../my_jobs/Footer';

const DetailMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Action Button Header */}
        <DetailHeader />
        
        {/* Hero banner for event */}
        <DetailBanner 
<<<<<<< Updated upstream
          code="#BK-8842" 
          status="AWAITING PREP" 
          confirmedDate="Sept 12, 2024" 
=======
          code={booking.bookingRef} 
          status={vendorStatus} 
          confirmedDate={new Date(booking.date).toLocaleDateString()} 
          clientEmail={booking.email}
          clientPhone={getClientPhone(booking)}
>>>>>>> Stashed changes
        />

        {/* 4 Summary Stats Cards */}
        <DetailSummary 
          date="Oct 24, 2024" 
          guests="600 Guests" 
          window="08:00 AM – 02:00 PM" 
          venue="Grand Majestic Hall" 
        />

        {/* Client details & Visuals */}
        <DetailMiddle 
          clientName="Zahra & Omar" 
          clientSubtitle="The Al-Sayyed Wedding" 
          phone="+971 50 123 4567" 
          email="z.omar@weddingmail.com" 
          inspirationImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" 
          inspirationCaption="“Luxury Floral Stage Concept - White Orchid Cascade”" 
        />

        {/* Package components checklist & tasks */}
        <DetailBottom />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
