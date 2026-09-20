"use client";

import React from 'react';
import MyJobsMain from './MyJobsMain';
import Footer from './Footer';

const MainContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <MyJobsMain />
      <Footer />
    </div>
  );
};

export default MainContent;
