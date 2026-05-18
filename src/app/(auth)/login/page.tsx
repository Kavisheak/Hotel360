// app/login/login.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-[#f7f5f2]">
      {/* Left Side */}
      <div className="relative hidden lg:flex w-1/2 h-screen overflow-hidden ">
        <Image
          src="/images/Frontimg.png"
          alt="Luxury Hall"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#3a1e0f]/55" />

        {/* Logo */}
        <div className="absolute top-16 left-14 z-10">
          <h1 className="text-white text-4xl font-light tracking-wide">
            EASCC <span className="text-[#d7a04d]">Conference Center</span>
          </h1>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-16 left-14 z-10">
          <p className="uppercase tracking-[6px] text-[#d7a04d] text-sm mb-6">
            Client Portal
          </p>

          <h2 className="text-white text-5xl leading-tight font-light">
            Your evening,{" "}
            <span className="italic text-[#d7a04d]">
              in your hands.
            </span>
          </h2>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-10 md:px-20">
        <div className="w-full max-w-lg">
          {/* Header */}
          <p className="uppercase tracking-[6px] text-[#d7a04d] text-sm mb-8">
            Welcome Back
          </p>

          <h1 className="text-5xl font-light text-black leading-tight">
            Sign in to{" "}
            <span className="italic text-[#d7a04d]">EASCC.</span>
          </h1>

          <p className="text-gray-600 text-xl mt-5 mb-12">
            Continue planning your evening.
          </p>

          {/* Form */}
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block uppercase tracking-[5px] text-xs text-black mb-4">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-xl text-gray-500 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block uppercase tracking-[5px] text-xs text-black mb-4">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-xl text-gray-500 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-3 text-gray-700 text-base">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-black"
                />
                Remember me
              </label>

              <Link
                href="#"
                className="text-[#d7a04d] text-base hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 mt-3 uppercase tracking-[5px] text-sm hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {/* Bottom Link */}
          <div className="text-center mt-16 text-xl">
            <span className="text-gray-700">
              New to ?{" "}
            </span>

            <Link
              href="/register"
              className="text-[#d7a04d] hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}