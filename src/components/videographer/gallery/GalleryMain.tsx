import React from "react";
import GalleryGrid from "./GalleryGrid";
import Footer from "../shared/Footer";

const GalleryMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <GalleryGrid />
      </div>
      <Footer />
    </div>
  );
};

export default GalleryMain;
