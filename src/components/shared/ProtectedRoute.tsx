"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuthStore();
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const verify = async () => {
      // If we don't have a user and aren't already loading one from a previous check
      if (!user) {
        await fetchUser();
      }
      if (isMounted) {
        setHasVerified(true);
      }
    };
    
    verify();
    
    return () => {
      isMounted = false;
    };
  }, [user, fetchUser]);

  useEffect(() => {
    if (!isLoading && hasVerified) {
      if (!user) {
        // Not authenticated
        router.replace("/login");
      } else if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
        // Authenticated but wrong role -> Redirect to their respective dashboard
        switch (user.role.toLowerCase()) {
          case "super_admin":
            router.replace("/super-admin");
            break;
          case "manager":
            router.replace("/hotel-manager");
            break;
          case "customer":
            router.replace("/");
            break;
          case "decorator":
            router.replace("/decorator/my-jobs");
            break;
          case "videographer":
            router.replace("/videographer");
            break;
          case "dj_artist":
            router.replace("/dj-artist");
            break;
          default:
            router.replace("/");
        }
      }
    }
  }, [user, isLoading, hasVerified, allowedRoles, router]);

  // Show a loading spinner while validating session
  if (isLoading || !hasVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF9F1]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E0D8C3] border-t-[#B08D2C] mb-4"></div>
        <p className="text-sm text-gray-500 font-serif italic">Verifying secure session...</p>
      </div>
    );
  }

  // If user is authenticated and has the right role, render children
  if (user && (!allowedRoles || allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase()))) {
    return <>{children}</>;
  }

  // Fallback (will be redirected by the useEffect anyway)
  return null;
}
