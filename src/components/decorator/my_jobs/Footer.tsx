import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#EBE5D9] border-t border-[#E0D8C3] py-8 px-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          <p className="font-serif italic text-xl text-[#7C6A2E] mb-1">Sattar Elite</p>
          <p className="text-gray-600">© 2024 Sattar Elite Wedding Hall. All rights reserved.</p>
        </div>
        
        <div className="flex space-x-6 text-gray-600 font-medium">
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
