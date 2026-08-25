"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Vendor } from "@/components/landing/vendors/types";
import { vendorAPI } from "@/lib/api";
import VendorsHeader from "@/components/landing/vendors/VendorsHeader";
import VendorProfileHero from "@/components/landing/vendorProfile/VendorProfileHero";
import VendorProfileStats from "@/components/landing/vendorProfile/VendorProfileStats";
import VendorProfileContent from "@/components/landing/vendorProfile/VendorProfileContent";
import { useAuthStore } from "@/store/authStore";
import { useVendorStore } from "@/store/vendorStore";

function VendorProfileInner() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBooking = searchParams.get("booking") === "true";
  const [vendor, setVendor] = useState<Vendor | null>(null);

  const { fetchUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && user.role.toLowerCase() !== "customer" && user.role.toLowerCase() !== "decorator") {
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
            // Fallback to checking local mock vendors if API fails
            await useVendorStore.getState().fetchVendors();
            const localVendor = useVendorStore.getState().vendors.find(v => v.id === id);
            if (localVendor) setVendor(localVendor);
            else router.push("/vendors");
          }
        } catch (error) {
          // Fallback to checking local mock vendors if API fails
          await useVendorStore.getState().fetchVendors();
          const localVendor = useVendorStore.getState().vendors.find(v => v.id === id);
          if (localVendor) setVendor(localVendor);
          else router.push("/vendors");
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
      <VendorProfileContent vendor={vendor} isBooking={isBooking} />
    </div>
  );
}

export default function VendorProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C69C6D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#A6955C] tracking-widest uppercase text-xs font-bold">Loading Profile...</p>
        </div>
      </div>
    }>
      <VendorProfileInner />
    </Suspense>
  );
}
