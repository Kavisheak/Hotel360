// app/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authAPI } from "@/lib/api";
import { Mail, Lock, Eye, ArrowRight, Paintbrush, Briefcase, ShieldCheck, User, Phone, CheckCircle2, Tag, Headset } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle mode
  const toggleMode = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsLogin(!isLogin);
    setLoginError("");
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    const { ok, data } = await authAPI.signin({ email, password });

    if (!ok) {
      setLoginError(data?.message || "Invalid email or password.");
      return;
    }

    // Redirect based on role
    const role = data.user.role;
    localStorage.setItem("user", role);
    
    if      (role === "super_admin")   router.push("/super-admin");
    else if (role === "manager")       router.push("/hotel-manager");
    else if (role === "decorator")     router.push("/decorator");
    else if (role === "videographer")  router.push("/videographer");
    else if (role === "dj_artist")     router.push("/dj-artist");
    else                               router.push("/customer/home");
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (regPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { ok, data } = await authAPI.signup({
      name: `${firstName} ${lastName}`.trim(),
      email: regEmail,
      phone: phone,
      password: regPassword
    });

    if (!ok) {
      alert(data?.message || "Failed to create account");
      return;
    }

    localStorage.setItem("user", "customer");
    router.push("/customer/home");
  };

  // Animation variants
  const leftSideVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const rightSideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center lg:justify-end p-6 lg:p-20 font-sans overflow-x-hidden overflow-y-auto">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/Frontimg.png"
          alt="Luxury Hall"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark Overlays for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-[#0a0a0a]/80" />
      </div>

      {/* Top Left Logo (Always visible) */}
      <div className="fixed top-12 left-12 z-10 hidden lg:flex items-center gap-4">
        <div className="w-14 h-14 relative flex items-center justify-center border border-[#C9A84C] rounded-full">
           <svg className="absolute -top-3 text-[#C9A84C] w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
           </svg>
           <span className="text-[#C9A84C] font-serif text-3xl">E</span>
        </div>
        <div>
          <h1 className="text-white text-3xl tracking-widest font-serif">EASCC</h1>
          <p className="text-[#C9A84C] text-[9px] uppercase tracking-[0.3em]">Conference Center</p>
        </div>
      </div>

      {/* Dynamic Left Side Content */}
      <div className="fixed bottom-16 left-12 z-10 hidden lg:block max-w-[500px]">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="login-text" variants={leftSideVariants} initial="initial" animate="animate" exit="exit">
              <p className="uppercase tracking-[5px] text-[#C9A84C] text-xs mb-4 font-bold">
                Client Portal
              </p>
              <h2 className="text-white text-5xl md:text-6xl leading-tight font-serif mb-6">
                Your evening,<br/>
                <span className="italic text-[#C9A84C]">in your hands.</span>
              </h2>
              <p className="text-gray-300 text-sm font-light leading-relaxed">
                Plan, personalize, and perfect every detail of<br/> your celebration with ease.
              </p>
            </motion.div>
          ) : (
            <motion.div key="register-text" variants={leftSideVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-white text-5xl md:text-6xl leading-tight font-serif mb-4">
                Your perfect stay<br/>
                <span className="italic text-[#C9A84C]">starts here.</span>
              </h2>
              <p className="text-gray-300 text-sm font-light leading-relaxed mb-12 max-w-sm">
                Create an account to explore exclusive offers, manage your bookings, and enjoy a seamless experience with EASCC.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#C9A84C]" />
                  <h4 className="text-white text-[10px] font-bold">Secure & Safe</h4>
                  <p className="text-gray-400 text-[9px] leading-relaxed">Your data is protected with top security.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Tag className="w-6 h-6 text-[#C9A84C]" />
                  <h4 className="text-white text-[10px] font-bold">Best Rates</h4>
                  <p className="text-gray-400 text-[9px] leading-relaxed">Access exclusive deals and special offers.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Headset className="w-6 h-6 text-[#C9A84C]" />
                  <h4 className="text-white text-[10px] font-bold">Personalized Service</h4>
                  <p className="text-gray-400 text-[9px] leading-relaxed">Personalized support for a seamless experience.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glassmorphism Right Panel */}
      <div className="relative z-10 w-full max-w-[500px] backdrop-blur-xl bg-[#111111]/40 border border-white/10 rounded-2xl shadow-2xl my-auto">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="login-form" variants={rightSideVariants} initial="initial" animate="animate" exit="exit" className="p-6 md:p-8">
              {/* Login Form Content */}
              <div className="flex flex-col items-center mb-5">
                <div className="text-[#C9A84C] mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 14 6 18 6C18 6 15 8 15 12C15 16 18 18 18 18C14 18 12 22 12 22C12 22 10 18 6 18C6 18 9 16 9 12C9 8 6 6 6 6C10 6 12 2 12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="uppercase tracking-[4px] text-[#C9A84C] text-[9px] font-bold mb-2">
                  Welcome Back
                </p>
                <h1 className="text-3xl font-serif text-white text-center">
                  Sign in to <span className="italic text-[#C9A84C]">EASCC</span>
                </h1>
                <p className="text-gray-300 text-xs mt-2 font-light">
                  Continue planning your evening.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-2 font-bold">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="customer@gmail.com"
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-xs"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2.5 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-xs"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#C9A84C] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-gray-300 text-[10px] cursor-pointer hover:text-white transition-colors">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer w-3.5 h-3.5 opacity-0 absolute" />
                      <div className="w-3.5 h-3.5 border border-white/30 rounded bg-white/5 peer-checked:bg-[#C9A84C] peer-checked:border-[#C9A84C] flex items-center justify-center transition-all">
                         <svg className="w-2.5 h-2.5 text-[#1A1512] opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                      </div>
                    </div>
                    Remember me
                  </label>
                  <Link href="#" className="text-[#C9A84C] text-[10px] hover:underline hover:text-[#B89238] transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#B89238] via-[#D4C9A8] to-[#B89238] text-[#1A1512] py-3 rounded-md flex items-center justify-center gap-2 uppercase tracking-[3px] text-[11px] font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 mt-2 bg-[length:200%_auto] hover:bg-right"
                >
                  Sign In <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {loginError && <p className="text-xs text-red-400 text-center">{loginError}</p>}
              </form>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="shrink-0 mx-4 text-gray-500 text-[9px] uppercase tracking-[2px]">Or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="text-center text-[11px] text-gray-300 mb-5">
                New to EASCC? <button type="button" onClick={toggleMode} className="text-[#C9A84C] hover:underline cursor-pointer bg-transparent border-none p-0">Create an account</button>
              </div>

              {/* Dashboard Links */}
              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <Link href="/decorator" className="flex items-center gap-2 text-gray-400 hover:text-[#C9A84C] transition-colors group">
                  <Paintbrush className="w-5 h-5 text-[#C9A84C] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest leading-none mb-1">Decorator</span>
                    <span className="text-[9px] font-bold leading-none">Dashboard</span>
                  </div>
                </Link>
                
                <Link href="/hotel-manager" className="flex items-center gap-2 text-gray-400 hover:text-[#C9A84C] transition-colors group">
                  <Briefcase className="w-5 h-5 text-[#C9A84C] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest leading-none mb-1">Manager</span>
                    <span className="text-[9px] font-bold leading-none">Dashboard</span>
                  </div>
                </Link>

                <Link href="/super-admin" className="flex items-center gap-2 text-gray-400 hover:text-[#C9A84C] transition-colors group">
                  <ShieldCheck className="w-5 h-5 text-[#C9A84C] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest leading-none mb-1">Admin</span>
                    <span className="text-[9px] font-bold leading-none">Dashboard</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="register-form" variants={rightSideVariants} initial="initial" animate="animate" exit="exit" className="p-6 md:p-8">
              {/* Register Form Content */}
              <div className="flex flex-col items-center mb-4">
                <div className="text-[#C9A84C] mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 14 6 18 6C18 6 15 8 15 12C15 16 18 18 18 18C14 18 12 22 12 22C12 22 10 18 6 18C6 18 9 16 9 12C9 8 6 6 6 6C10 6 12 2 12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-serif text-white text-center">
                  Create <span className="italic text-[#C9A84C]">Your Account</span>
                </h1>
                <p className="text-gray-300 text-[11px] mt-1.5 font-light text-center max-w-xs">
                  Join EASCC and unlock a world of comfort and convenience.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="flex gap-3">
                  {/* First Name */}
                  <div className="flex-1">
                    <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="First name"
                        className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-[11px]"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Last name"
                        className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-[11px]"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="youremail@gmail.com"
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-[11px]"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                    Phone Number
                  </label>
                  <div className="relative flex">
                    <div className="bg-white/5 border border-white/10 rounded-l-md border-r-0 py-2 pl-3 pr-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {/* Sri Lanka Flag */}
                      <img 
                        src="https://flagcdn.com/w20/lk.png" 
                        width="16" 
                        height="12" 
                        alt="Sri Lanka" 
                        className="ml-0.5 object-cover rounded-[1px]"
                      />
                      <span className="text-white text-[10px] ml-0.5">+94</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Your mobile number"
                      className="w-full bg-white/5 border border-white/10 rounded-r-md py-2 pl-2 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-[11px]"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-[11px]"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#C9A84C] transition-colors"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block uppercase tracking-[2px] text-[9px] text-gray-300 mb-1.5 font-bold">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] focus:bg-white/10 transition-all text-[11px]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#C9A84C] transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Password strength indicators */}
                <div className="pt-1 pb-1">
                  <p className="text-[9px] text-gray-400 mb-1.5">Password must contain:</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    <div className="flex items-center gap-1 text-[#C9A84C]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span className="text-[8px] uppercase tracking-wider">At least 8 chars</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C9A84C]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span className="text-[8px] uppercase tracking-wider">Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C9A84C]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span className="text-[8px] uppercase tracking-wider">Number</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C9A84C]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span className="text-[8px] uppercase tracking-wider">Special character</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start pt-0.5 mb-2">
                  <label className="flex items-start gap-2 text-gray-300 text-[9px] cursor-pointer hover:text-white transition-colors">
                    <div className="relative flex items-center mt-0.5">
                      <input type="checkbox" className="peer w-2.5 h-2.5 opacity-0 absolute" />
                      <div className="w-3 h-3 border border-white/30 rounded bg-white/5 peer-checked:bg-[#C9A84C] peer-checked:border-[#C9A84C] flex items-center justify-center transition-all">
                         <svg className="w-2 h-2 text-[#1A1512] opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                      </div>
                    </div>
                    <span className="leading-tight">
                      I agree to the <Link href="#" className="text-[#C9A84C] hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-[#C9A84C] hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#B89238] via-[#D4C9A8] to-[#B89238] text-[#1A1512] py-2.5 rounded-md flex items-center justify-center gap-2 uppercase tracking-[3px] text-[10px] font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 bg-[length:200%_auto] hover:bg-right"
                >
                  Create Account <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="shrink-0 mx-4 text-gray-500 text-[8px] uppercase tracking-[2px]">Or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Social Logins */}
              <div className="flex gap-2 mb-4">
                <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors py-1.5 rounded-md flex items-center justify-center gap-2 text-white text-[9px] font-medium">
                  <svg viewBox="0 0 24 24" className="w-3 h-3">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors py-1.5 rounded-md flex items-center justify-center gap-2 text-white text-[9px] font-medium">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <div className="text-center text-[12px] text-gray-300">
                Already have an account? <button type="button" onClick={toggleMode} className="text-[#C9A84C] hover:underline cursor-pointer bg-transparent border-none p-0">Sign in</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}