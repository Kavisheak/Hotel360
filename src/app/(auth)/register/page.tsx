// app/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { useAuthStore } from "@/store/authStore";
import { validateEmail, validatePhone } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const { user, fetchUser, isLoading } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      hasError = true;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const { authAPI } = await import("@/lib/api");
    const { ok, data } = await authAPI.signup({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      phone,
      password
    });

    if (!ok) {
      alert(data?.message || "Failed to create account");
      return;
    }

    await fetchUser(true);
    router.replace("/");
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

  if (isLoading || user) return null;

  return (
    <div className="min-h-screen bg-[#F0E6D0] flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="w-full border-b border-[#D4C9A8] bg-[#F0E6D0]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between h-20 px-8">
          {/* Logo */}
          <h1 className="text-[34px] italic font-semibold text-[#A67C52]">
            Sattar Elite
          </h1>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-16 text-[15px] tracking-[2px] uppercase text-[#2C1E14]">
            <Link href="/" className="nav-link-animated">Home</Link>
            <Link href="/" className="nav-link-animated">Packages</Link>
            <Link href="/" className="nav-link-animated">Availability</Link>
            <Link href="/" className="nav-link-animated">Contact</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="uppercase tracking-[2px] text-[15px] font-semibold hover:text-[#C9A84C] transition-colors"
            >
              Sign In
            </Link>

            <button className="btn-interactive bg-[#C9A84C] hover:bg-[#B89238] transition px-8 py-3 uppercase tracking-[3px] text-[14px] font-semibold text-[#2C1E14]">
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LEFT IMAGE */}
        <div className="relative w-full lg:w-1/2 min-h-[900px]">
          <Image
            src="/images/wedding.jpg"
            alt="Wedding Hall"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#2C1E14]/35" />

          {/* Text */}
          <div className="absolute bottom-16 left-14 text-white max-w-[500px] text-reveal">
            <h1 className="text-[80px] leading-[0.95] font-semibold">
              Begin Your
              <br />
              Journey
              <br />
              With Us
            </h1>

            <p className="mt-8 text-[18px] leading-9 text-[#f5f5f5]">
              Experience the pinnacle of hospitality and elegance at
              Sattar Elite Wedding Hall.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-[600px] flex-shrink-0 flex flex-col justify-center px-12 pb-16">
          <div className="w-full max-w-[540px] text-reveal stagger-2">
            {/* Heading */}
            <h2 className="text-[56px] leading-none font-semibold text-[#A67C52]">
              Create Account
            </h2>

            <p className="mt-4 text-[20px] text-[#444]">
              Enter your details to start planning your elite event.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-14 space-y-8">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-3 text-[14px] uppercase tracking-[2px] font-semibold text-[#2C1E14]">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                    }}
                    className="input-glow w-full h-[74px] px-5 border border-[#D4C9A8] bg-[#fafaf5] outline-none text-[24px] text-[#5b6470] transition-all duration-300"
                  />
                  {errors.firstName && <p className="text-red-500 text-[14px] mt-2">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block mb-3 text-[14px] uppercase tracking-[2px] font-semibold text-[#2C1E14]">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                    }}
                    className="input-glow w-full h-[74px] px-5 border border-[#D4C9A8] bg-[#fafaf5] outline-none text-[24px] text-[#5b6470] transition-all duration-300"
                  />
                  {errors.lastName && <p className="text-red-500 text-[14px] mt-2">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-3 text-[14px] uppercase tracking-[2px] font-semibold text-[#2C1E14]">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className="input-glow w-full h-[74px] px-5 border border-[#D4C9A8] bg-[#fafaf5] outline-none text-[24px] text-[#5b6470] transition-all duration-300"
                />
                {errors.email && <p className="text-red-500 text-[14px] mt-2">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-3 text-[14px] uppercase tracking-[2px] font-semibold text-[#2C1E14]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="0771234567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className="input-glow w-full h-[74px] px-5 border border-[#D4C9A8] bg-[#fafaf5] outline-none text-[24px] text-[#5b6470] transition-all duration-300"
                />
                {errors.phone && <p className="text-red-500 text-[14px] mt-2">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-3 text-[14px] uppercase tracking-[2px] font-semibold text-[#2C1E14]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className="input-glow w-full h-[74px] px-5 pr-14 border border-[#D4C9A8] bg-[#fafaf5] outline-none text-[24px] text-[#5b6470] transition-all duration-300"
                  />

                  {/* Simple Eye Icon */}
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A67C52] text-xl cursor-pointer hover:scale-110 transition-transform select-none"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
                {errors.password && <p className="text-red-500 text-[14px] mt-2">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-3 text-[14px] uppercase tracking-[2px] font-semibold text-[#2C1E14]">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className="input-glow w-full h-[74px] px-5 border border-[#D4C9A8] bg-[#fafaf5] outline-none text-[24px] text-[#5b6470] transition-all duration-300"
                />
                {errors.confirmPassword && <p className="text-red-500 text-[14px] mt-2">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-4 pt-2">
                <input
                  type="checkbox"
                  className="w-6 h-6 mt-1 border border-[#D4C9A8] accent-[#C9A84C]"
                />

                <p className="text-[17px] text-[#3d3d3d] leading-8">
                  I agree to the{" "}
                  <span className="text-[#A67C52] hover:underline cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#A67C52] hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="btn-interactive w-full h-[74px] bg-[#C9A84C] hover:bg-[#B89238] transition uppercase tracking-[5px] text-[16px] font-semibold text-[#2C1E14]"
              >
                Create Account
              </button>

              {/* Bottom */}
              <p className="text-center text-[18px] text-[#333] pt-3">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#A67C52] font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#D4C9A8] bg-[#F0E6D0]">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-center px-8 py-12 gap-8">
          {/* Left */}
          <div>
            <h2 className="text-[34px] italic font-semibold text-[#A67C52]">
              Sattar Elite
            </h2>

            <p className="mt-4 text-[16px] text-[#444]">
              © 2024 Sattar Elite Wedding Hall. All rights reserved.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-14 text-[16px] text-[#333]">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">FAQ</Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}