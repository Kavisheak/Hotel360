// app/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { validateEmail, validatePhone } from "@/lib/validation";
import { Mail, Lock, Eye, ArrowRight, Paintbrush, Briefcase, ShieldCheck, User, Phone, CheckCircle2, Tag, Headset, Loader2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const { user, fetchUser, isLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // Register State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    regEmail?: string;
    firstName?: string;
    lastName?: string;
    regPassword?: string;
    confirmPassword?: string;
  }>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Toggle mode
  const toggleMode = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsLogin(!isLogin);
    setLoginError("");
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && user) {
      const role = user.role.toLowerCase();
      if      (role === "super_admin")   router.replace("/super-admin");
      else if (role === "manager")       router.replace("/hotel-manager");
      else if (role === "decorator")     router.replace("/decorator");
      else if (role === "videographer")  router.replace("/videographer");
      else if (role === "dj_artist")     router.replace("/dj-artist");
      else                               router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      if (event.persisted) {
        try {
          const { ok, data } = await authAPI.getMe();
          if (ok && data.user) {
            useAuthStore.getState().updateUser(data.user);
            const role = data.user.role.toLowerCase();
            if      (role === "super_admin")   window.location.replace("/super-admin");
            else if (role === "manager")       window.location.replace("/hotel-manager");
            else if (role === "decorator")     window.location.replace("/decorator");
            else if (role === "videographer")  window.location.replace("/videographer");
            else if (role === "dj_artist")     window.location.replace("/dj-artist");
            else                               window.location.replace("/");
          } else {
            useAuthStore.getState().clearUser();
          }
        } catch (e) {
          useAuthStore.getState().clearUser();
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  if (isLoading || user) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsForgotLoading(true);
    setForgotError("");
    setForgotSuccess(false);

    const { ok, data } = await authAPI.forgotPassword(forgotEmail);
    if (ok) {
      setForgotSuccess(true);
    } else {
      setForgotError(data.message || "Failed to send temporary password.");
    }
    setIsForgotLoading(false);
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    const { ok, data } = await authAPI.signin({ email, password });

    if (!ok) {
      setLoginError(data?.message || "Invalid email or password.");
      return;
    }

    // Update global state now that we have a valid session
    await fetchUser(true);

    // Redirect based on role
    const role = data.user.role;
    
    if      (role === "super_admin")   router.replace("/super-admin");
    else if (role === "manager")       router.replace("/hotel-manager");
    else if (role === "decorator")     router.replace("/decorator");
    else if (role === "videographer")  router.replace("/videographer");
    else if (role === "dj_artist")     router.replace("/dj-artist");
    else                               router.replace("/");
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    
    let hasError = false;
    const newErrors: typeof errors = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      hasError = true;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      hasError = true;
    }
    if (!validateEmail(regEmail)) {
      newErrors.regEmail = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }
    if (!regPassword) {
      newErrors.regPassword = "Password is required.";
      hasError = true;
    } else if (!isStrongPassword) {
      newErrors.regPassword = "Password does not meet strength requirements.";
      setShowPasswordRequirements(true);
      hasError = true;
    }
    if (regPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const { ok, data } = await authAPI.signup({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: regEmail,
      phone: phone,
      password: regPassword
    });

    if (!ok) {
      alert(data?.message || "Failed to create account");
      return;
    }

    // Update global state now that we have a valid session
    await fetchUser(true);

    router.replace("/");
  };

  const validations = {
    length: regPassword.length >= 8,
    uppercase: /[A-Z]/.test(regPassword),
    number: /[0-9]/.test(regPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(regPassword)
  };
  const isStrongPassword = Object.values(validations).every(Boolean);

  // Animation variants
  const leftSideVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const rightSideVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="h-screen relative flex items-center justify-center lg:justify-end p-6 lg:p-16 font-sans overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/eascc.png"
          alt="EASCC Venue"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Very subtle dark gradient to ensure white card pops without making image too dark */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/30" />
      </div>

      {/* Bottom Left Floating Features */}
      <div className="fixed bottom-12 left-12 z-10 hidden lg:flex items-center gap-8 bg-white/20 backdrop-blur-3xl px-10 py-5 rounded-[20px] shadow-2xl border border-white/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/50 bg-white/40 flex items-center justify-center text-gray-900 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-gray-900 text-sm font-bold mb-0.5">Trusted Venue</h4>
            <p className="text-gray-500 text-xs leading-relaxed">A premier venue for<br/>memorable events.</p>
          </div>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/50 bg-white/40 flex items-center justify-center text-gray-900 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-gray-900 text-sm font-bold mb-0.5">Seamless Planning</h4>
            <p className="text-gray-500 text-xs leading-relaxed">Everything you need<br/>in one place.</p>
          </div>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/50 bg-white/40 flex items-center justify-center text-gray-900 shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-gray-900 text-sm font-bold mb-0.5">Dedicated Support</h4>
            <p className="text-gray-500 text-xs leading-relaxed">We're here to help<br/>you succeed.</p>
          </div>
        </div>
      </div>

      {/* Glassmorphism Right Panel */}
      <div className="relative z-10 w-full max-w-[440px] lg:mr-16 bg-white/20 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/40 my-auto ml-auto max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="login-form" variants={rightSideVariants} initial="initial" animate="animate" exit="exit" className="p-5 md:p-6">
              {/* Login Form Content */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-32 h-14 relative">
                  <Image src="/images/elite_logo.png" alt="EASCCA Logo" fill className="object-contain" priority />
                </div>
                <h1 className="text-2xl font-serif text-white text-center mb-0.5 mt-2">
                  Welcome Back
                </h1>
                <p className="text-white text-sm font-serif mb-0.5">
                  Sign in to EASCC
                </p>
                <p className="text-white/90 text-xs font-light mt-0.5">
                  Continue planning your evening.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="manager@gmail.com"
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-8 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                    />
                    {email && !errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 mt-2.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 text-gray-600 text-xs cursor-pointer hover:text-gray-900 transition-colors">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer w-3.5 h-3.5 opacity-0 absolute" />
                      <div className="w-3.5 h-3.5 border border-[#C9A84C] rounded bg-transparent peer-checked:bg-[#C9A84C] flex items-center justify-center transition-all">
                         <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                      </div>
                    </div>
                    Remember me
                  </label>
                  <button type="button" onClick={() => setShowForgotModal(true)} className="text-white font-medium text-xs hover:underline hover:text-white/80 transition-colors shadow-sm">
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E6D5A7] via-[#D4B86A] to-[#C9A84C] text-gray-900 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 mt-3 shadow-sm border border-[#C9A84C]/20"
                >
                  Sign In <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
              </form>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="shrink-0 mx-4 text-gray-400 text-[10px] uppercase">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="text-center w-full mb-4">
                <button type="button" onClick={toggleMode} className="w-full bg-white border border-[#C9A84C]/40 text-gray-600 py-2.5 rounded-lg hover:bg-[#FAF7F2] transition-colors text-xs flex justify-center items-center gap-1.5 shadow-sm">
                  <User className="w-3.5 h-3.5 text-[#C9A84C]" /> New to EASCC? <span className="text-[#C9A84C] font-semibold">Create an account.</span>
                </button>
              </div>

              <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-400 pb-1">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                EASCCA Conference Centre, Eravur, Sri Lanka
              </div>
            </motion.div>
          ) : (
            <motion.div key="register-form" variants={rightSideVariants} initial="initial" animate="animate" exit="exit" className="p-5 md:p-6">
              {/* Register Form Content */}
              <div className="flex flex-col items-center mb-2">
                <div className="w-24 h-12 relative">
                   <Image src="/images/elite_logo.png" alt="EASCCA Logo" fill className="object-contain" priority />
                </div>
                <h1 className="text-2xl font-serif text-white text-center mb-0.5 mt-2">
                  Create Account
                </h1>
                <p className="text-white/90 text-xs text-center">
                  Join EASCC to manage your bookings.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-2.5" autoComplete="off">
                <div className="flex gap-3">
                  {/* First Name */}
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="First name"
                        autoComplete="off"
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                        }}
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-[10px] mt-0.5">{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Last name"
                        autoComplete="off"
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                        }}
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-[10px] mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="youremail@gmail.com"
                      autoComplete="off"
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (errors.regEmail) setErrors({ ...errors, regEmail: undefined });
                      }}
                    />
                  </div>
                  {errors.regEmail && <p className="text-red-500 text-[10px] mt-0.5">{errors.regEmail}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative flex shadow-sm rounded-lg">
                    <div className="bg-gray-50 border border-gray-200 rounded-l-lg border-r-0 py-2 pl-3 pr-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <img 
                        src="https://flagcdn.com/w20/lk.png" 
                        width="14" 
                        height="10" 
                        alt="Sri Lanka" 
                        className="object-cover rounded-[2px]"
                      />
                      <span className="text-gray-600 text-[11px] font-medium">+94</span>
                    </div>
                    <input
                      type="tel"
                      title="Please enter a valid Sri Lankan phone number (e.g., 0771234567 or 771234567)."
                      placeholder="Mobile number"
                      autoComplete="off"
                      className="w-full bg-white border border-gray-200 rounded-r-lg py-2 pl-2 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-9 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (errors.regPassword) setErrors({ ...errors, regPassword: undefined });
                      }}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {errors.regPassword && <p className="text-red-500 text-[10px] mt-0.5">{errors.regPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A84C]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-9 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all text-xs shadow-sm"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                      }}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-0.5">{errors.confirmPassword}</p>}
                </div>

                {/* Password strength indicators */}
                {showPasswordRequirements && !isStrongPassword && (
                  <div className="pt-1 pb-1 bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                    <p className="text-xs text-red-600 mb-2 font-bold">Password must contain:</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      <div className={`flex items-center gap-1 transition-colors ${validations.length ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-medium">At least 8 chars</span>
                      </div>
                      <div className={`flex items-center gap-1 transition-colors ${validations.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 transition-colors ${validations.number ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Number</span>
                      </div>
                      <div className={`flex items-center gap-1 transition-colors ${validations.special ? 'text-green-600' : 'text-red-500'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Special character</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="flex items-start pt-1">
                  <label className="flex items-start gap-1.5 text-gray-600 text-[11px] cursor-pointer hover:text-gray-900 transition-colors">
                    <div className="relative flex items-center mt-0.5">
                      <input type="checkbox" className="peer w-3.5 h-3.5 opacity-0 absolute" />
                      <div className="w-3.5 h-3.5 border border-[#C9A84C] rounded bg-transparent peer-checked:bg-[#C9A84C] flex items-center justify-center transition-all">
                         <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                      </div>
                    </div>
                    <span className="leading-tight">
                      I agree to the <Link href="#" className="text-[#C9A84C] hover:underline font-medium">Terms</Link> and <Link href="#" className="text-[#C9A84C] hover:underline font-medium">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E6D5A7] via-[#D4B86A] to-[#C9A84C] text-gray-900 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 shadow-sm border border-[#C9A84C]/20 mt-1"
                >
                  Create Account <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="shrink-0 mx-4 text-gray-400 text-[10px] uppercase">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social Logins */}
              <div className="flex gap-2 mb-2">
                <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 transition-colors py-2 rounded-lg flex items-center justify-center gap-1.5 text-gray-600 text-xs font-medium shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 transition-colors py-2 rounded-lg flex items-center justify-center gap-1.5 text-gray-600 text-xs font-medium shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <div className="text-center text-xs text-gray-600 font-medium pb-0.5">
                Already have an account? <button type="button" onClick={toggleMode} className="text-[#C9A84C] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0">Sign in</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/20 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                  setForgotError("");
                  setForgotEmail("");
                }}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-full border border-white/50 bg-white/40 flex items-center justify-center text-white shadow-sm mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">Reset Password</h3>
                
                {forgotSuccess ? (
                  <div className="space-y-4">
                    <p className="text-white/90 text-sm">
                      A temporary 15-minute password has been sent to your email address. Please use it to log in.
                    </p>
                    <button
                      onClick={() => {
                        setShowForgotModal(false);
                        setForgotSuccess(false);
                      }}
                      className="w-full bg-[#C9A84C] text-gray-900 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#B89238] transition-colors"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-white/90 text-sm">
                      Enter your email address and we'll send you a temporary password to regain access to your account.
                    </p>
                    
                    <div>
                      <label className="block text-xs font-medium text-white/90 mb-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/70">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-white/10 border border-white/30 rounded-lg py-2 pl-9 pr-3 text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-xs"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {forgotError && <p className="text-red-400 text-xs">{forgotError}</p>}

                    <button
                      type="submit"
                      disabled={isForgotLoading || !forgotEmail}
                      className="w-full bg-gradient-to-r from-[#E6D5A7] via-[#D4B86A] to-[#C9A84C] text-gray-900 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isForgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Temporary Password"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}