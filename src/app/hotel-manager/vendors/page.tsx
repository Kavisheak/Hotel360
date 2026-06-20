import React from 'react';
import VendorsListMain from '@/components/hotel-manager/vendors/VendorsListMain';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import Header from '@/components/hotel-manager/overview/Header';
import Footer from '@/components/hotel-manager/overview/Footer';

export default function VendorsPage() {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <VendorsListMain />
        </main>
        <Footer />
      </div>
    </div>
  );
}
