import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#EBE5D9] border-t border-[#E0D8C3] py-8 px-6 sm:px-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm gap-4">
        {/* Left Side: Brand info, centered on mobile */}
        <div className="text-center md:text-left">
          <p className="font-serif italic text-xl text-[#7C6A2E] mb-1">EASCCA</p>
          <p className="text-gray-500 text-xs sm:text-sm">© 2024 EASCCA Wedding Hall. All rights reserved.</p>
        </div>
        
        {/* Right Side: Links, wrapped and centered on mobile */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-500 text-xs sm:text-sm font-semibold">
          <a href="#" className="hover:text-[#7C6A2E] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#7C6A2E] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#7C6A2E] transition-colors">FAQ</a>
          <a href="#" className="hover:text-[#7C6A2E] transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
