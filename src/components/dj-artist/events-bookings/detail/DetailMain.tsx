import React from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../overview/Footer';

const bookingData: Record<string, {
  status: 'UPCOMING' | 'CONFIRMED' | 'COMPLETED';
  confirmedDate: string;
  djPackage: string;
  date: string;
  guests: string;
  setWindow: string;
  venue: string;
  clientName: string;
  clientSubtitle: string;
  phone: string;
  email: string;
  venueImage: string;
  venueCaption: string;
}> = {
  'BK-8842': {
    status: 'CONFIRMED',
    confirmedDate: 'June 10, 2026',
    djPackage: 'Diamond DJ Package',
    date: 'July 24, 2026',
    guests: '320 Guests',
    setWindow: '06:00 PM – 12:00 AM',
    venue: 'Rosewood Estate',
    clientName: 'Eleanor Sterling',
    clientSubtitle: 'The Sterling-Vance Wedding',
    phone: '+44 20 7946 0321',
    email: 'eleanor.sterling@weddingmail.com',
    venueImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    venueCaption: '"Rosewood Estate — Grand Ballroom Reception · Diamond DJ Package"',
  },
  'BK-9012': {
    status: 'UPCOMING',
    confirmedDate: 'July 15, 2026',
    djPackage: 'Premium DJ Package',
    date: 'August 02, 2026',
    guests: '500 Attendees',
    setWindow: '07:00 PM – 11:00 PM',
    venue: 'Grand Convention Hall',
    clientName: 'James Harrison',
    clientSubtitle: 'Harrison Corporate Annual Gala',
    phone: '+44 20 7935 1100',
    email: 'j.harrison@harrisoncorp.com',
    venueImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    venueCaption: '"Grand Convention Hall — Annual Corporate Gala · Premium DJ Package"',
  },
  'BK-9104': {
    status: 'COMPLETED',
    confirmedDate: 'May 20, 2026',
    djPackage: 'Gold DJ Package',
    date: 'June 14, 2026',
    guests: '180 Guests',
    setWindow: '08:00 PM – 02:00 AM',
    venue: 'Ocean View Resort',
    clientName: 'Amara Okafor',
    clientSubtitle: 'Birthday Celebration',
    phone: '+44 79 4812 5543',
    email: 'amara.okafor@partymail.com',
    venueImage: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
    venueCaption: '"Ocean View Resort — Birthday Bash · Gold DJ Package"',
  },
};

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const data = bookingData[bookingId] ?? bookingData['BK-8842'];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <DetailHeader />
        <DetailBanner
          code={bookingId}
          status={data.status}
          confirmedDate={data.confirmedDate}
          djPackage={data.djPackage}
        />
        <DetailSummary
          date={data.date}
          guests={data.guests}
          setWindow={data.setWindow}
          venue={data.venue}
        />
        <DetailMiddle
          clientName={data.clientName}
          clientSubtitle={data.clientSubtitle}
          phone={data.phone}
          email={data.email}
          venueImage={data.venueImage}
          venueCaption={data.venueCaption}
        />
        <DetailBottom />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
