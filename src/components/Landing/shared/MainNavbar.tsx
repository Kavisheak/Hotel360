"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { useVendorCartStore } from "@/store/vendorCartStore";

export default function MainNavbar() {
 const pathname = usePathname();
 
 // Mock logged-in state. In a real app, you would get this from auth context.
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const { cartVendors, favoriteVendors } = useVendorCartStore();

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
 <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4C9A8] dark:border-[#C9A84C]/50 text-gray-800 dark:text-gray-200 shadow-xl dark:shadow-[0_8px_40px_rgba(201,168,76,0.4)] transition-shadow duration-300">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
  {/* Brand Logo */}
  <Link href="/" className="flex items-center gap-3 group">
  <div className="w-5 h-[1px] bg-[#C9A84C] group-hover:w-8 transition-all duration-300"></div>
  <span className="font-serif text-lg tracking-wider text-[#2C1E14] dark:text-white normal-case">
  EASCC <span className="font-light italic text-[#805D3A] dark:text-[#A6955C] text-sm hidden sm:inline">Conference Center</span>
  </span>
  </Link>

  {/* Desktop Navigation Links */}
  <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-gray-600 dark:text-gray-300">
  {navLinks.map((link) => {
  const isActive = pathname === link.path;
  return (
  <Link
  key={link.name}
  href={link.path}
  className={`nav-link-animated transition-colors duration-200 ${
  isActive
  ? "text-[#C9A84C] dark:text-[#C9A84C] border-b border-[#C9A84C] pb-0.5 font-bold tracking-widest"
  : "hover:text-[#2C1E14] dark:hover:text-white"
  }`}
  >
  {link.name}
  </Link>
  );
  })}
  </nav>

  {/* Call to Actions */}
  <div className="flex items-center gap-4">
  <Link href="/customer/saved" className="relative group text-gray-600 dark:text-gray-300 hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors">
  <Heart className="w-5 h-5" />
  {favoriteVendors?.length > 0 && (
  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
  {favoriteVendors.length}
  </span>
  )}
  </Link>

  <Link href="/customer/saved" className="relative group text-gray-600 dark:text-gray-300 hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors mr-2">
  <ShoppingCart className="w-5 h-5" />
  {cartVendors?.length > 0 && (
  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
  {cartVendors.length}
  </span>
  )}
  </Link>

  {isLoggedIn ? (
  <Link
  href="/customer/myaccount"
  className="text-xs uppercase tracking-widest font-semibold text-gray-600 dark:text-gray-300 hover:text-[#2C1E14] dark:hover:text-white transition-colors duration-200"
  >
  My Account
  </Link>
  ) : (
  <Link
  href="/login"
  className="text-xs uppercase tracking-widest font-semibold text-gray-600 dark:text-gray-300 hover:text-[#2C1E14] dark:hover:text-white transition-colors duration-200"
  >
  Sign In
  </Link>
  )}

  <Link
  href="/book"
  className="btn-interactive bg-[#C69C6D] text-white px-4 py-1.5 hover:bg-[#B58B5C] dark:hover:bg-[#B89238] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest"
  >
  Inquire
  </Link>
  </div>
 </div>
 </header>
 );
}
