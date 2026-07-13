"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useBookingFormStore } from "@/store/bookingFormStore";
import SignOutModal from "./SignOutModal";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function MainNavbar() {
 const pathname = usePathname();
 const router = useRouter();
 
 const { user, fetchUser, clearUser } = useAuthStore();
 const isLoggedIn = !!user;
 const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  
 const { isDirty, clearForm } = useBookingFormStore();
 const [showLeaveModal, setShowLeaveModal] = useState(false);
 const [pendingPath, setPendingPath] = useState("");

 const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
   if (pathname === "/book" && isDirty && path !== "/book") {
     e.preventDefault();
     setPendingPath(path);
     setShowLeaveModal(true);
   }
 };

 const confirmLeave = () => {
   clearForm();
   setShowLeaveModal(false);
   if (pendingPath) {
     router.push(pendingPath);
   }
 };

 const handleSignOut = async () => {
   await authAPI.signout();
   clearUser();
   setIsSignOutModalOpen(false);
   window.location.replace('/login');
 };
 const { favoriteVendors } = useVendorCartStore();

 useEffect(() => {
   fetchUser();
 }, [fetchUser]);

 const navLinks = [
 { name: "Home", path: "/" },
 { name: "Packages", path: "/customer/packages" },
 { name: "Vendors", path: "/customer/vendors" },
 { name: "Virtual Tour", path: "/customer/virtual-tour" },
 { name: "Book Now", path: "/book" },
 ];

 return (
  <>
 <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4C9A8] dark:border-[#C9A84C]/50 text-gray-800 dark:text-gray-200 shadow-xl dark:shadow-[0_8px_40px_rgba(201,168,76,0.4)] transition-shadow duration-300">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
  {/* Brand Logo */}
  <Link href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center gap-3 group">
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
  onClick={(e) => handleNavClick(e, link.path)}
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
  <Link href="/customer/saved" onClick={(e) => handleNavClick(e, "/customer/saved")} className="relative group text-gray-600 dark:text-gray-300 hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors">
  <Heart className="w-5 h-5" />
  {favoriteVendors?.length > 0 && (
  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
  {favoriteVendors.length}
  </span>
  )}
  </Link>

  {isLoggedIn ? (
  <div className="flex items-center gap-4">
    <Link
    href="/customer/myaccount"
    onClick={(e) => handleNavClick(e, "/customer/myaccount")}
    className="text-xs uppercase tracking-widest font-semibold text-gray-600 dark:text-gray-300 hover:text-[#2C1E14] dark:hover:text-white transition-colors duration-200"
    >
    My Account
    </Link>
    <button
    onClick={() => setIsSignOutModalOpen(true)}
    title="Sign Out"
    className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
    >
    <LogOut className="w-5 h-5" />
    </button>
  </div>
  ) : (
  <Link
  href="/login"
  onClick={(e) => handleNavClick(e, "/login")}
  className="text-xs uppercase tracking-widest font-semibold text-gray-600 dark:text-gray-300 hover:text-[#2C1E14] dark:hover:text-white transition-colors duration-200"
  >
  Sign In
  </Link>
  )}
  </div>
  </div>
</header>

    {/* Sign Out Confirmation Modal */}
    <SignOutModal 
      isOpen={isSignOutModalOpen}
      onClose={() => setIsSignOutModalOpen(false)}
      onConfirm={handleSignOut}
    />

    {/* Leave Booking Confirmation Modal */}
    <AnimatePresence>
      {showLeaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLeaveModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-[#1A1A1A] p-8 max-w-md w-full rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#E8DFC9] dark:border-[#C9A84C]/30 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-3">Leave Booking?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Are you sure you want to leave? Your current booking progress will be lost and your selections will be discarded.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-3 border border-[#E8DFC9] dark:border-gray-700 text-[#1A1512] dark:text-gray-300 text-xs uppercase font-bold tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLeave}
                className="flex-1 py-3 bg-red-500 text-white text-xs uppercase font-bold tracking-widest hover:bg-red-600 transition-colors rounded-sm"
              >
                Leave & Discard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
  );
}
