"use client";

import React from "react";
import { ShieldCheck, Clock, CalendarDays, Award } from "lucide-react";

export default function TrustDivider() {
  return (
    <section className="bg-[#FAF6EE] dark:bg-[#1A1A1A] text-[#1A1512] dark:text-white border border-[#E8DFC9] dark:border-gray-800 rounded-sm">
      <div className="flex flex-col">
        
        <div className="flex items-start gap-4 p-6 border-b border-[#E8DFC9] dark:border-gray-800">
          <div className="text-[#C69C6D] mt-1 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-[15px] font-semibold mb-2">Secure Your Date</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
              We pledge 100% estate dedication. You alone will occupy the grand ballroom, arrival foyer, and gardens for the entire duration of your wedding.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 border-b border-[#E8DFC9] dark:border-gray-800">
          <div className="text-[#C69C6D] mt-1 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-[15px] font-semibold mb-2">Flexible Configurations</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Morning, Evening, or Full-Day configurations adapt precisely to your auspicious hour requirements, complete with early arrival suites.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 border-b border-[#E8DFC9] dark:border-gray-800">
          <div className="text-[#C69C6D] mt-1 shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-[15px] font-semibold mb-2">Complimentary Calendar Hold</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Enjoy a 48-hour complimentary calendar hold while coordinating payment transfers and booking walkthroughs.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6">
          <div className="text-[#C69C6D] mt-1 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-[15px] font-semibold mb-2">Verified & Trusted</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Professional, verified, and reviewed by hundreds of delighted couples.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
