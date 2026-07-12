import React from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../shared/Footer';

// Booking data lookup by ID
const bookingData: Record<string, {
  status: 'UPCOMING' | 'CONFIRMED' | 'COMPLETED';
  confirmedDate: string;
  videoPackage: string;
  date: string;
  guests: string;
  shootWindow: string;
  venue: string;
  clientName: string;
  clientSubtitle: string;
  phone: string;
  email: string;
  coverImage: string;
  coverCaption: string;
}> = {
  'VG-2241': {
    status: 'CONFIRMED',
    confirmedDate: 'June 10, 2026',
    videoPackage: 'Cinematic Wedding Package',
    date: 'July 24, 2026',
    guests: '280 Guests',
    shootWindow: '09:00 AM – 09:00 PM',
    venue: 'Rosewood Estate, London',
    clientName: 'Eleanor Sterling',
    clientSubtitle: 'The Sterling-Vance Wedding',
    phone: '+44 20 7946 0321',
    email: 'eleanor.sterling@weddingmail.com',
    coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    coverCaption: '"Rosewood Estate — Golden Hour Ceremony Arch Sequence"',
  },
  'VG-2298': {
    status: 'UPCOMING',
    confirmedDate: 'July 15, 2026',
    videoPackage: 'Engagement Session Package',
    date: 'August 05, 2026',
    guests: '2 Subjects',
    shootWindow: '05:00 PM – 08:00 PM',
    venue: 'Hyde Park Gardens, London',
    clientName: 'Amara Okafor',
    clientSubtitle: 'Okafor Engagement Session',
    phone: '+44 79 4812 5543',
    email: 'amara.okafor@engagementmail.com',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    coverCaption: '"Hyde Park Gardens — Intimate Engagement Session"',
  },
  'VG-2354': {
    status: 'COMPLETED',
    confirmedDate: 'May 20, 2026',
    videoPackage: 'Corporate Event Package',
    date: 'June 14, 2026',
    guests: '450 Attendees',
    shootWindow: '06:00 PM – 11:00 PM',
    venue: "Claridge's Hotel, Mayfair",
    clientName: 'James Harrison',
    clientSubtitle: 'Harrison Corporate Gala',
    phone: '+44 20 7935 1100',
    email: 'j.harrison@harrisoncorp.com',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    coverCaption: '"Claridge\'s Mayfair — Annual Corporate Gala Main Stage"',
  },
  'VG-2381': {
    status: 'UPCOMING',
    confirmedDate: 'Aug 01, 2026',
    videoPackage: 'Premium Documentary Package',
    date: 'September 12, 2026',
    guests: '120 Guests',
    shootWindow: '03:00 PM – 11:00 PM',
    venue: 'The Savoy, London',
    clientName: 'Richard Montague',
    clientSubtitle: '25th Wedding Anniversary',
    phone: '+44 20 7836 4343',
    email: 'r.montague@savoy.events',
    coverImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    coverCaption: '"The Savoy — 25th Anniversary Grand Ballroom Reception"',
  },
};

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const data = bookingData[bookingId] ?? bookingData['VG-2241'];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Action Header */}
        <DetailHeader />
        
        {/* Hero Banner */}
        <DetailBanner
          code={bookingId}
          status={data.status}
          confirmedDate={data.confirmedDate}
          videoPackage={data.videoPackage}
          phone={data.phone}
        />

        {/* 4 Summary Stat Cards */}
        <DetailSummary
          date={data.date}
          guests={data.guests}
          shootWindow={data.shootWindow}
          venue={data.venue}
        />

        {/* Client Profile & Event Scene */}
        <DetailMiddle
          clientName={data.clientName}
          clientSubtitle={data.clientSubtitle}
          phone={data.phone}
          email={data.email}
          coverImage={data.coverImage}
          coverCaption={data.coverCaption}
        />

        {/* Package Details & Shoot Checklist */}
        <DetailBottom />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
