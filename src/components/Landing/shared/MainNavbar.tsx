"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNavbar() {
  const pathname = usePathname();
  
  // Mock logged-in state. In a real app, you would get this from auth context.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // You can toggle this manually or via some global state to simulate login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/customer/packages" },
    { name: "Vendors", path: "/customer/vendors" },
    { name: "Food Menu", path: "/customer/food-menu" },
    { name: "Virtual Tour", path: "/customer/virtual-tour" },
    { name: "Book", path: "/book" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2C1E14]/95 backdrop-blur-md border-b border-[#C9A84C]/20 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-5 h-[1px] bg-[#C9A84C] group-hover:w-8 transition-all duration-300"></div>
          <span className="font-serif text-lg tracking-wider text-[#F0E6D0] normal-case">
            EASCC <span className="font-light italic text-[#C9A84C] text-sm hidden sm:inline">Conference Center</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-gray-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`nav-link-animated transition-colors duration-200 ${
                  isActive
                    ? "text-[#C9A84C] border-b border-[#C9A84C] pb-0.5 font-bold tracking-widest"
                    : "hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Call to Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/customer/myaccount"
              className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-white transition-colors duration-200"
            >
              My Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/book"
            className="btn-interactive bg-[#C9A84C] text-[#2C1E14] px-4 py-1.5 hover:bg-[#B89238] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest"
          >
            Reserve
          </Link>
        </div>
      </div>
    </header>
  );
}
