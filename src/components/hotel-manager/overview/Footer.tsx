import React from 'react';

const ManagerFooter = () => (
  <footer className="flex flex-col md:flex-row justify-between items-center px-4 lg:px-6 py-4 bg-white border-t border-[#E0D8C3] text-xs gap-3">
    <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
      <span className="font-serif italic text-[#7C6A2E] font-semibold tracking-wide">Sattar Elite</span>
      <span className="text-gray-400">© 2024 Sattar Elite Wedding Hall. All Rights Reserved.</span>
    </div>
    <div className="flex gap-5">
      {['Privacy Policy', 'Terms of Service', 'Support'].map((link) => (
        <a key={link} href="#" className="text-gray-400 hover:text-[#7C6A2E] transition-colors">
          {link}
        </a>
      ))}
    </div>
  </footer>
);

export default ManagerFooter;
