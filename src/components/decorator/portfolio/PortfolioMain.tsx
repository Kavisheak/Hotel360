"use client";

import React, { useState } from 'react';
import PortfolioHeader from './PortfolioHeader';
import PortfolioFilters from './PortfolioFilters';
import PortfolioGallery from './PortfolioGallery';
import Footer from '../my_jobs/Footer';

const PortfolioMain = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Gallery Header */}
        <PortfolioHeader />

        {/* Dynamic Category Filtering Filters */}
        <PortfolioFilters 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />

        {/* Dynamic Gallery List */}
        <PortfolioGallery activeCategory={activeCategory} />
      </div>
      <Footer />
    </div>
  );
};

export default PortfolioMain;
