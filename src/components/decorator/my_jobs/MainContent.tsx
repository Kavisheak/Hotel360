"use client";

import React from 'react';
import Header from './Header';
import MyJobsMain from './MyJobsMain';
import Footer from './Footer';

const MainContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />
      <MyJobsMain />
      <Footer />
    </div>
  );
};

export default MainContent;
