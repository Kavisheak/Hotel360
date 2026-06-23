"use client";

import React, { useState } from 'react';
import PortfolioHeader from './PortfolioHeader';
import PortfolioFilters from './PortfolioFilters';
import PortfolioGallery from './PortfolioGallery';
import Footer from '../my_jobs/Footer';

const PortfolioMain = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { decoratorAPI } = await import('@/lib/api');
      const res = await decoratorAPI.getPortfolioItems();
      if (res.ok && res.data?.data) {
        setPortfolioItems(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="py-20 text-center text-[#7C6A2E] animate-pulse">Loading gallery...</div>
        ) : (
          <PortfolioGallery activeCategory={activeCategory} items={portfolioItems} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PortfolioMain;
