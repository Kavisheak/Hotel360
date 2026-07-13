"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/lib/api";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export default function AutoLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performLogout = useCallback(async () => {
    // Attempt to hit signout API to clear HTTP-only cookie
    try {
      await authAPI.signout();
    } catch (error) {
      console.error("Auto logout API error", error);
    }
    
    // Clear global state
    clearUser();
    
    // Redirect to login only if not already on public pages like login/signup/home
    if (pathname !== "/login" && pathname !== "/register") {
      window.location.replace("/login?reason=inactivity");
    }
  }, [clearUser, pathname]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Only set timer if user is logged in
    if (user) {
      timeoutRef.current = setTimeout(performLogout, INACTIVITY_TIMEOUT);
    }
  }, [user, performLogout]);

  useEffect(() => {
    // If user is not logged in, clear timer and stop listening
    if (!user) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    // Set initial timer
    resetTimer();

    // Events to track activity
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll", "click"];

    const handleActivity = () => resetTimer();

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, resetTimer]);

  return null; // Component does not render anything visually
}
