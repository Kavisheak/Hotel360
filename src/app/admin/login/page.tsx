"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { validateEmail } from "@/lib/validation";
import { Mail, Lock, Eye, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, fetchUser, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{ email?: string }>({});

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role.toLowerCase() === "super_admin") {
        router.replace("/admin/dashboard");
      } else {
        // If a non-admin is logged in, boot them out of the admin portal
        router.replace("/");
      }
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
      </div>
    );
  }

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    const { ok, data } = await authAPI.adminSignin({ email, password });
    setIsSubmitting(false);

    if (!ok) {
      setLoginError(data?.message || "Invalid administrator credentials.");
      return;
    }

    // Update global state now that we have a valid admin session
    await fetchUser(true);
    router.replace("/admin/dashboard");
  };

  const formVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans p-6">
      <div className="w-full max-w-[440px] relative z-10">
        <motion.div variants={formVariants} initial="initial" animate="animate" className="bg-slate-800/50 backdrop-blur-xl rounded-[24px] shadow-2xl border border-slate-700/50 p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white text-center tracking-tight">
              Administrator Login
            </h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              Secure portal for EASCCA platform management.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="admin@eascca.com"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-inner"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                />
                {email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider mt-5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 pb-2">
              <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer hover:text-slate-300 transition-colors">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer w-4 h-4 opacity-0 absolute cursor-pointer" />
                  <div className="w-4 h-4 border border-slate-600 rounded bg-slate-900/50 peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center transition-all">
                      <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  </div>
                </div>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>

            {loginError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-sm text-red-400">{loginError}</p>
              </div>
            )}
          </form>
          
          <div className="mt-8 text-center border-t border-slate-700 pt-6">
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Customer Login
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
