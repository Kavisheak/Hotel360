// app/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] flex flex-col">
      {/* ================= MAIN ================= */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LEFT IMAGE */}
        <div className="relative w-full lg:w-1/2 min-h-[900px]">
          <Image
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
            alt="Wedding Hall"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Text */}
          <div className="absolute bottom-16 left-14 text-white max-w-[500px]">
            <h1 className="text-[64px] leading-[1] font-semibold">
              Begin Your
              <br />
              Journey
              <br />
              With Us
            </h1>

            <p className="mt-6 text-[16px] leading-7 text-[#f5f5f5]">
              Experience the pinnacle of hospitality and elegance at
              Sattar Elite Wedding Hall.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-[540px]">
            {/* Heading */}
            <h2 className="text-[40px] leading-tight font-semibold text-[#8b6b08]">
              Create Account
            </h2>

            <p className="mt-3 text-[16px] text-[#444]">
              Enter your details to start planning your elite event.
            </p>

            {/* FORM */}
            <form className="mt-14 space-y-8">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-[12px] uppercase tracking-[2px] font-semibold text-[#2d2d2d]">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="John"
                    className="w-full h-[60px] px-4 border border-[#d2c8b7] bg-[#fafafa] outline-none text-[18px] text-[#5b6470]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[12px] uppercase tracking-[2px] font-semibold text-[#2d2d2d]">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full h-[60px] px-4 border border-[#d2c8b7] bg-[#fafafa] outline-none text-[18px] text-[#5b6470]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-[12px] uppercase tracking-[2px] font-semibold text-[#2d2d2d]">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full h-[60px] px-4 border border-[#d2c8b7] bg-[#fafafa] outline-none text-[18px] text-[#5b6470]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-[12px] uppercase tracking-[2px] font-semibold text-[#2d2d2d]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-[60px] px-4 border border-[#d2c8b7] bg-[#fafafa] outline-none text-[18px] text-[#5b6470]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-[12px] uppercase tracking-[2px] font-semibold text-[#2d2d2d]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-[60px] px-4 pr-12 border border-[#d2c8b7] bg-[#fafafa] outline-none text-[18px] text-[#5b6470]"
                  />

                  {/* Simple Eye Icon */}
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8c816f] text-xl cursor-pointer">
                    👁
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-[12px] uppercase tracking-[2px] font-semibold text-[#2d2d2d]">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-[60px] px-4 border border-[#d2c8b7] bg-[#fafafa] outline-none text-[18px] text-[#5b6470]"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 mt-1 border border-[#c8bba5]"
                />

                <p className="text-[15px] text-[#3d3d3d] leading-7">
                  I agree to the{" "}
                  <span className="text-[#8b6b08]">
                    Event Hall Booking Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-[#8b6b08]">
                    Privacy Policy
                  </span>
                  , including reservation deposits, cancellation windows,
                  and guest data handling for event planning.
                </p>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full h-[60px] bg-[#b99607] hover:bg-[#a78906] transition uppercase tracking-[4px] text-[14px] font-semibold"
              >
                Create Account
              </button>

              {/* Bottom */}
              <p className="text-center text-[15px] text-[#333] pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#8b6b08] font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}