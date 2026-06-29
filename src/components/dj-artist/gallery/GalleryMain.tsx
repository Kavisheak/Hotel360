"use client";

import React, { useState, useEffect } from 'react';
import GalleryGrid from './GalleryGrid';
import Footer from '../overview/Footer';
import { djAPI } from '@/lib/api';

const GalleryMain = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await djAPI.getGalleryItems();
      if (res.ok && res.data?.data) {
        setItems(res.data.data);
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
        <GalleryGrid items={items} loading={loading} refresh={fetchItems} />
      </div>
      <Footer />
    </div>
  );
};

export default GalleryMain;
