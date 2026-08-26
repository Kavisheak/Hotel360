"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Phone, Calendar, AlertTriangle, Menu, X, Moon, Sun, User } from "lucide-react";
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
    { name: "Packages", path: "/packages" },
    { name: "Vendors", path: "/vendors" },
    { name: "Virtual Tour", path: "/virtual-tour" },
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
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none transition-all duration-500">
        <header 
          className={`pointer-events-auto w-full max-w-7xl rounded-[20px] px-5 sm:px-8 py-3 flex items-center justify-between transition-all duration-500 ${
            isHome && !isScrolled 
              ? "bg-[#FDFBF7]/85 dark:bg-[#1A1A1A]/85 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm" 
              : "bg-[#FDFBF7]/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#E8DFC9]/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
          }`}
        >
          
          {/* Brand Logo */}
          <Link href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center gap-3 group shrink-0">
            <LogoIcon />
            <div className="flex flex-col select-none">
              <span className="font-serif text-[22px] sm:text-2xl font-bold tracking-wider text-[#C9A84C] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                EASCCA
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] font-bold tracking-[0.12em] text-[#2C3E50] dark:text-[#E2E8F0] uppercase mt-1 leading-none" style={{ fontFamily: "'Jost', sans-serif" }}>
                CONFERENCE CENTRE
              </span>
              <span className="font-sans text-[7px] sm:text-[8px] font-semibold tracking-[0.2em] text-[#2C3E50]/80 dark:text-[#E2E8F0]/80 uppercase mt-0.5 leading-none" style={{ fontFamily: "'Jost', sans-serif" }}>
                ERAVUR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[16px] font-medium text-[#2C3E50] dark:text-gray-300 mx-auto absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  style={{ fontFamily: "'Jost', sans-serif" }}
                  className={`relative py-2 transition-colors duration-300 ${
                    isActive
                      ? "text-[#C9A84C]"
                      : "text-[#2C3E50] dark:text-gray-300 hover:text-[#C9A84C] dark:hover:text-[#C9A84C]"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#C9A84C] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call to Actions */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Saved Items */}
            <Link href="/customer/saved" onClick={(e) => handleNavClick(e, "/customer/saved")} className="hidden lg:flex relative group text-[#2C3E50] dark:text-gray-300 hover:text-[#C9A84C] transition-colors">
              <Heart className="w-[18px] h-[18px] stroke-[2px]" />
              {favoriteVendors?.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C9A84C] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {favoriteVendors.length}
                </span>
              )}
            </Link>

            {/* Notification Center */}
            <div className="hidden lg:block">
              {isLoggedIn && <NotificationCenter role="customer" />}
            </div>

            {/* Call to Action Button */}
            {isLoggedIn ? (
              <Link
                href="/book"
                onClick={(e) => handleNavClick(e, "/book")}
                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-white hover:from-[#C9A84C] hover:to-[#B58B5C] px-5 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-300 shadow-[0_4px_14px_rgba(201,168,76,0.25)] hover:shadow-[0_6px_20px_rgba(201,168,76,0.35)] shrink-0"
                style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.03em" }}
              >
                <Calendar className="w-[14px] h-[14px] text-white" strokeWidth={2.5} />
                <span className="uppercase">Book Now</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={(e) => handleNavClick(e, "/login")}
                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-white hover:from-[#C9A84C] hover:to-[#B58B5C] px-5 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-300 shadow-[0_4px_14px_rgba(201,168,76,0.25)] hover:shadow-[0_6px_20px_rgba(201,168,76,0.35)] shrink-0"
                style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.03em" }}
              >
                <User className="w-[14px] h-[14px] text-white" strokeWidth={2.5} />
                <span className="uppercase">Sign In</span>
              </Link>
            )}

            {/* Desktop Sign Out Button */}
            {isLoggedIn && (
              <button
                onClick={() => setIsSignOutModalOpen(true)}
                className="hidden lg:flex items-center justify-center group text-[#2C3E50] dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1"
                aria-label="Sign Out"
                title="Sign Out"
              >
                <LogOut className="w-[18px] h-[18px] stroke-[2px]" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden items-center justify-center p-1.5 text-[#2C3E50] dark:text-gray-300 hover:text-[#C9A84C] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[2px]" /> : <Menu className="w-5 h-5 stroke-[2px]" />}
            </button>
          </div>

        </header>
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
                      className={`text-center text-[18px] font-bold py-2 transition-colors duration-200 ${
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
