import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const FooterSection = () => {
 return (
 <footer className="w-full bg-white dark:bg-[#0A0A0A] flex flex-col items-center transition-colors duration-300 relative overflow-hidden">
 
 {/* Footer Dark Mode Background Image */}
 <div className="absolute inset-0 z-0 hidden dark:block pointer-events-none">
 <Image src="/luxury_ballroom_bg.png" alt="Footer Dark Background" fill sizes="100vw" className="object-cover opacity-30" />
 <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]"></div>
 </div>

 {/* Top CTA Section */}
 <div className="w-full relative py-16 md:py-20 px-6 flex flex-col items-center text-center z-10">
 {/* Background Image Light */}
 <div className="absolute inset-0 z-0 dark:hidden">
 <Image src="/light_ballroom_bg.png" alt="CTA Background Light" fill sizes="100vw" className="object-cover opacity-40 mix-blend-overlay" />
 <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white"></div>
 </div>
 {/* Background Image Dark */}
 <div className="absolute inset-0 z-0 hidden dark:block">
 <Image src="/luxury_ballroom_bg.png" alt="CTA Background Dark" fill sizes="100vw" className="object-cover opacity-20 mix-blend-overlay" />
 <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]"></div>
 </div>
 
 <div className="relative z-10 max-w-3xl flex flex-col items-center">
 <p className="text-[#805D3A] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
 Reservations Open
 </p>
 <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2C1E14] dark:text-white leading-tight mb-4">
 Begin the conversation.
 </h2>
 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 max-w-md">
 A bespoke evening starts with a single date. View availability and compose your celebration in minutes.
 </p>
 <Link href="/customer/book" className="btn-interactive bg-[#D4AF37] dark:bg-transparent dark:border dark:border-[#C69C6D] text-white px-6 py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-semibold hover:bg-[#C9A84C] dark:hover:bg-[#C69C6D]/20 transition-colors">
 Reserve Your Date
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>
 </div>
 </div>

 {/* Main Footer Content */}
 <div className="w-full px-6 md:px-12 lg:px-20 py-12 max-w-6xl relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
 
 {/* Left Column - Brand */}
 <div className="lg:col-span-5 flex flex-col">
 <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
 EASCC
 </p>
 <h3 className="text-xl md:text-2xl font-serif text-[#2C1E14] dark:text-white mb-4 leading-snug max-w-sm">
 Where every union becomes a <span className="italic text-[#D4AF37] ">legacy.</span>
 </h3>
 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
 A singular wedding sanctuary in the heart of Colombo — crafted for couples who measure celebration in details.
 </p>
 </div>

 {/* Spacer for large screens */}
 <div className="hidden lg:block lg:col-span-3"></div>

 {/* Middle Column - Explore */}
 <div className="lg:col-span-2 flex flex-col">
 <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
 Explore
 </p>
 <ul className="flex flex-col gap-3 text-gray-600 dark:text-gray-400 text-sm">
 <li><Link href="/customer/packages" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Packages</Link></li>
 <li><Link href="/customer/vendors" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Vendors</Link></li>
 <li><Link href="/customer/virtual-tour" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Virtual Tour</Link></li>
 <li><Link href="/customer/book" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Reserve a Date</Link></li>
 <li><Link href="/customer/myaccount" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Client Portal</Link></li>
 </ul>
 </div>

 {/* Right Column - Visit */}
 <div className="lg:col-span-2 flex flex-col">
 <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
 Visit
 </p>
 <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-400 text-sm mb-6">
 <p>Main Highway Road<br />Eravur, Sri Lanka</p>
 <p><a href="tel:+94115551820" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">+94 11 555 1820</a></p>
 <p><a href="mailto:concierge@eascc.lk" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">concierge@eascc.lk</a></p>
 </div>
 {/* Social Links */}
 <div className="flex items-center gap-4 text-gray-500 text-xs">
 <Link href="#" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Instagram</Link>
 <Link href="#" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">Facebook</Link>
 <Link href="#" className="hover:text-[#D4AF37] :text-[#C9A84C] transition-colors duration-200">YouTube</Link>
 </div>
 </div>

 </div>
 </div>

 {/* Copyright Footer */}
 <div className="w-full max-w-6xl px-6 md:px-12 lg:px-20 relative z-10">
 <div className="w-full border-t border-[#D4C9A8] dark:border-[#C69C6D]/20 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-500 dark:text-gray-500 uppercase tracking-widest">
 <p>© 2026 EASCC · All Rights Reserved</p>
 <p>Crafted with Intention</p>
 </div>
 </div>

 </footer>
 );
};

export default FooterSection;
