"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Vendor } from "@/components/landing/vendors/types";
import { vendorAPI } from "@/lib/api";
import VendorsHeader from "@/components/landing/vendors/VendorsHeader";
import VendorProfileHero from "@/components/landing/vendorProfile/VendorProfileHero";
import VendorProfileStats from "@/components/landing/vendorProfile/VendorProfileStats";
import VendorProfileContent from "@/components/landing/vendorProfile/VendorProfileContent";
import { useAuthStore } from "@/store/authStore";

export default function VendorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);

  const { fetchUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && user.role !== "customer" && user.role !== "decorator") {
      router.push("/login");
      return;
    }
    if (!user) return;

    const loadVendor = async () => {
      if (typeof id === "string") {
        try {
          const res = await vendorAPI.getVendorById(id);
          if (res.ok && res.data.success) {
            setVendor(res.data.data);
          } else {
            router.push("/customer/vendors");
          }
        } catch (error) {
          router.push("/customer/vendors");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadVendor();
  }, [id, router, user]);

  if (isLoading || !vendor) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C69C6D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#A6955C] tracking-widest uppercase text-xs font-bold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-[#1A1512] dark:text-gray-100 font-sans selection:bg-[#C69C6D] selection:text-black">
      <VendorsHeader />

      <VendorProfileHero vendor={vendor} />
      <VendorProfileStats vendor={vendor} />
      <VendorProfileContent vendor={vendor} />
    </div>
  );
}
