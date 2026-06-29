import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
export default function OverviewPage() {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}