"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ForcePasswordChangeModal from "./ForcePasswordChangeModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ROLE_REDIRECT: Record<string, string> = {
  super_admin: "/super-admin",
  manager: "/hotel-manager",
  customer: "/",
  decorator: "/decorator/my-jobs",
  videographer: "/videographer",
  dj_artist: "/dj-artist",
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, hasFetched, fetchUser } = useAuthStore();

  // On mount: fetch the user session ONCE if not already fetched.
  // We use an empty dependency array so this only runs once per mount.
  useEffect(() => {
    if (!hasFetched) {
      fetchUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // After the fetch has resolved, evaluate access.
  useEffect(() => {
    // Wait until the fetch is complete and not loading
    if (!hasFetched || isLoading) return;

    if (!user) {
      // Not authenticated at all
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
      // Authenticated but wrong role → redirect to their own dashboard
      const destination = ROLE_REDIRECT[user.role.toLowerCase()] ?? "/";
      router.replace(destination);
    }
  }, [hasFetched, isLoading, user, allowedRoles, router]);

  // Show loading spinner while session is being verified
  if (!hasFetched || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF9F1]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E0D8C3] border-t-[#B08D2C] mb-4"></div>
        <p className="text-sm text-gray-500 font-serif italic">Verifying secure session...</p>
      </div>
    );
  }

  // Render children only if the user is authenticated with the correct role
  if (user && (!allowedRoles || allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase()))) {
    return (
      <>
        {children}
        <ForcePasswordChangeModal />
      </>
    );
  }

  // Fallback: return null while the redirect in useEffect fires
  return null;
}
