// app/login/login.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (email === "deco@gmail.com" && password === "deco123") {
      localStorage.setItem("user", "decorator");
      router.push("/decorator");
      return;
    }

    if (email === "manager@gmail.com" && password === "manager123") {
      localStorage.setItem("user", "manager");
      router.push("/hotel-manager");
      return;
    }

    if (email === "admin@gmail.com" && password === "admin123") {
      router.push("/super-admin");
      return;
    }

    if (email === "customer@gmail.com" && password === "customer123") {
      localStorage.setItem("user", "customer");
      router.push("/");
      return;
    }

    setError("Invalid email or password.");
  };

  return (
    <div className="min-h-screen flex bg-[#F0E6D0]">
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
        <div className="absolute inset-0 bg-[#5A4A32]/55" />

        {/* Logo */}
        <div className="absolute top-16 left-14 z-10 text-reveal stagger-1">
          <h1 className="text-white text-4xl font-light tracking-wide">
            EASCC <span className="text-[#C9A84C]">Conference Center</span>
          </h1>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-16 left-14 z-10 text-reveal stagger-2">
          <p className="uppercase tracking-[6px] text-[#C9A84C] text-sm mb-6">
            Client Portal
          </p>

          <h2 className="text-white text-5xl leading-tight font-light">
            Your evening,{" "}
            <span className="italic text-[#C9A84C]">
              in your hands.
            </span>
          </h2>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-10 md:px-20">
        <div className="w-full max-w-lg text-reveal stagger-3">
          {/* Header */}
          <p className="uppercase tracking-[6px] text-[#C9A84C] text-sm mb-8">
            Welcome Back
          </p>

          <h1 className="text-5xl font-light text-[#2C1E14] leading-tight">
            Sign in to{" "}
            <span className="italic text-[#C9A84C]">EASCC.</span>
          </h1>

          <p className="text-gray-600 text-xl mt-5 mb-12">
            Continue planning your evening.
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block uppercase tracking-[5px] text-xs text-[#2C1E14] mb-4">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="input-glow w-full bg-transparent border-b border-[#D4C9A8] pb-3 text-xl text-gray-500 outline-none placeholder:text-gray-400 transition-all duration-300"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block uppercase tracking-[5px] text-xs text-[#2C1E14] mb-4">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="input-glow w-full bg-transparent border-b border-[#D4C9A8] pb-3 text-xl text-gray-500 outline-none placeholder:text-gray-400 transition-all duration-300"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-3 text-gray-700 text-base">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[#C9A84C]"
                />
                Remember me
              </label>

              <Link
                href="#"
                className="text-[#C9A84C] text-base hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn-interactive w-full bg-[#C9A84C] text-[#2C1E14] py-4 mt-3 uppercase tracking-[5px] text-sm font-semibold hover:bg-[#B89238] transition-all duration-300"
            >
              Sign In
            </button>

            <div className="mt-4 p-4 bg-[#E4D8BD]/50 border border-[#D4C9A8] rounded text-sm text-gray-700">
              <p className="font-semibold mb-2">Sample Accounts:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Customer: customer@gmail.com / customer123</li>
                <li>Decorator: deco@gmail.com / deco123</li>
                <li>Manager: manager@gmail.com / manager123</li>
              </ul>
            </div>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
          </form>

          {/* Bottom Link */}
          <div className="text-center mt-16 text-xl">
            <span className="text-gray-700">
              New to ?{" "}
            </span>

            <Link
              href="#"
              className="text-[#C9A84C] hover:underline"
            >
              Create an account
            </Link>
          </div>

          <div className="text-center mt-6 text-sm flex flex-col gap-2">
            <Link
              href="/decorator"
              className="uppercase tracking-[3px] text-[#C9A84C] hover:underline hover:text-[#A67C52] transition-colors"
            >
              Decorator Dashboard
            </Link>
            <Link
              href="/hotel-manager"
              className="uppercase tracking-[3px] text-[#C9A84C] hover:underline hover:text-[#A67C52] transition-colors"
            >
              Manager Dashboard
            </Link>
            <Link
              href="/super-admin"
              className="uppercase tracking-[3px] text-[#d7a04d] hover:underline"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}