"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Phone, Calendar, AlertTriangle, Menu, X, Moon, Sun } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useBookingFormStore } from "@/store/bookingFormStore";
import SignOutModal from "./SignOutModal";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useTheme } from "next-themes";

export default function MainNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const { user, fetchUser, clearUser, isLoading } = useAuthStore();
  const isLoggedIn = !!user;
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
   
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
    router.replace('/login');
  };

  const { favoriteVendors } = useVendorCartStore();

  useEffect(() => {
    fetchUser();
    setMounted(true);
  }, [fetchUser]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/customer/packages" },
    { name: "Vendors", path: "/customer/vendors" },
    { name: "Virtual Tour", path: "/customer/virtual-tour" },
    { name: "Book", path: "/book" },
    ...(isLoggedIn ? [{ name: "My Account", path: "/customer/myaccount" }] : []),
  ];

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const isHome = pathname === "/";

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${
          isHome && !isScrolled 
            ? "bg-transparent border-transparent text-gray-800 dark:text-white" 
            : "bg-white/85 dark:bg-[#0A0A0A]/85 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 text-gray-800 dark:text-gray-200 shadow-sm"
        }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center gap-3 group">
            <LogoIcon />
            <div className="flex flex-col select-none">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#C9A84C] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                EASCCA
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[0.12em] text-[#2c3e50] dark:text-[#E2E8F0] uppercase mt-1 leading-none" style={{ fontFamily: "'Jost', sans-serif" }}>
                CONFERENCE CENTRE
              </span>
              <span className="font-sans text-[8px] font-semibold tracking-[0.2em] text-[#2c3e50]/80 dark:text-[#E2E8F0]/80 uppercase mt-0.5 leading-none" style={{ fontFamily: "'Jost', sans-serif" }}>
                ERAVUR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[16px] font-bold text-[#2C3E50] dark:text-gray-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  style={{ fontFamily: "'Jost', sans-serif" }}
                  className={`relative py-2 transition-colors duration-200 ${
                    isActive
                      ? "text-[#E2952B] dark:text-[#F3BA46]"
                      : "text-[#2b354e] dark:text-gray-300 hover:text-[#E2952B] dark:hover:text-[#F3BA46]"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#E2952B] dark:bg-[#F3BA46] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call to Actions */}
          <div className="flex items-center gap-5">
            {/* Saved Items */}
            <Link href="/customer/saved" onClick={(e) => handleNavClick(e, "/customer/saved")} className="hidden lg:flex relative group text-gray-600 dark:text-gray-300 hover:text-[#E2952B] transition-colors">
              <Heart className="w-5 h-5" />
              {favoriteVendors?.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {favoriteVendors.length}
                </span>
              )}
            </Link>

            {/* Notification Center */}
            <div className="hidden lg:block">
              {isLoggedIn && <NotificationCenter role="customer" />}
            </div>



            {/* Book Event Button */}
            <Link
              href="/book"
              onClick={(e) => handleNavClick(e, "/book")}
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#E2952B] to-[#F3BA46] text-white hover:from-[#D0841A] hover:to-[#E2A732] px-5 py-2.5 rounded-md text-[15px] font-bold transition-all duration-200 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              <Calendar className="w-4 h-4 text-white" strokeWidth={2.5} />
              <span>Book Event</span>
            </Link>

            {/* Auth Actions */}
            <div className="hidden lg:flex items-center">
              {isLoading ? (
                <div className="w-16 h-4 bg-[#E8DFC9]/40 dark:bg-gray-800 animate-pulse rounded-sm shrink-0"></div>
              ) : isLoggedIn ? (
                <button
                  onClick={() => setIsSignOutModalOpen(true)}
                  title="Sign Out"
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={(e) => handleNavClick(e, "/login")}
                  className="text-[15px] font-bold text-[#2b354e] dark:text-gray-300 hover:text-[#E2952B] dark:hover:text-[#F3BA46] transition-colors duration-200"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Theme Toggle (Visible on all sizes) */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center p-2 mr-1 lg:mr-4 lg:ml-4 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Theme"
            >
              {mounted ? (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <div className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-[#E2952B] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden w-full bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-t border-gray-100 dark:border-zinc-800/80 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-6 gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={(e) => {
                        handleNavClick(e, link.path);
                        setIsMobileMenuOpen(false);
                      }}
                      style={{ fontFamily: "'Jost', sans-serif" }}
                      className={`text-center text-[16px] font-bold py-2 transition-colors duration-200 ${
                        isActive
                          ? "text-[#E2952B] dark:text-[#F3BA46]"
                          : "text-[#2b354e] dark:text-gray-300 hover:text-[#E2952B]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                
                {/* Mobile Extra Links */}
                <div className="h-px bg-gray-100 dark:bg-zinc-800/80 my-2"></div>
                
                <Link
                  href="/customer/saved"
                  onClick={(e) => { handleNavClick(e, "/customer/saved"); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-3 text-[16px] font-bold text-[#2b354e] dark:text-gray-300 hover:text-[#E2952B] py-2"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <Heart className="w-5 h-5" /> Saved Vendors
                  {favoriteVendors?.length > 0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{favoriteVendors.length}</span>}
                </Link>

                <Link
                  href="/book"
                  onClick={(e) => { handleNavClick(e, "/book"); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-[#E2952B] text-white px-5 py-3 rounded-md text-[15px] font-bold mt-2"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <Calendar className="w-4 h-4" /> Book Event
                </Link>

                {isLoggedIn ? (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsSignOutModalOpen(true); }}
                    className="flex items-center justify-center gap-2 text-red-500 font-bold py-3 mt-2 border border-red-100 dark:border-red-900/30 rounded-md"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={(e) => { handleNavClick(e, "/login"); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 text-[#2b354e] dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-bold py-3 mt-2 rounded-md"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

const LogoIcon = () => (
  <svg className="w-12 h-12 text-[#C9A84C] shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer pointed arch */}
    <path d="M 50 10 C 42 20 26 28 26 48 C 26 68 36 82 50 86 C 64 82 74 68 74 48 C 74 28 58 20 50 10 Z" />
    {/* Inner pointed arch */}
    <path d="M 50 16 C 44 24 32 31 32 48 C 32 64 40 76 50 80 C 60 76 68 64 68 48 C 68 31 56 24 50 16 Z" strokeWidth="1.5" />
    
    {/* Central Pillar */}
    <path d="M 50 30 L 50 78" />
    
    {/* Top leaf/bud */}
    <path d="M 50 25 C 47 28 47 32 50 35 C 53 32 53 28 50 25 Z" fill="currentColor" />
    
    {/* Top branches */}
    <path d="M 50 42 C 42 38 38 42 38 48 C 38 52 44 50 50 46" />
    <path d="M 50 42 C 58 38 62 42 62 48 C 62 52 56 50 50 46" />
    
    {/* Middle branches */}
    <path d="M 50 54 C 40 50 34 54 34 62 C 34 66 42 64 50 58" />
    <path d="M 50 54 C 60 50 66 54 66 62 C 66 66 58 64 50 58" />

    {/* Bottom branches */}
    <path d="M 50 66 C 38 62 30 66 30 74 C 30 78 40 76 50 70" />
    <path d="M 50 66 C 62 62 70 66 70 74 C 70 78 60 76 50 70" />
  </svg>
);
