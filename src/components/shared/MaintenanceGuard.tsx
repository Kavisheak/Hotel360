"use client";

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const ADMIN_ROLES = ['super_admin'];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const { user } = useAuthStore();
    const pathname = usePathname();

    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/public/system-status?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
            });
            const data = await res.json();
            setIsMaintenance(data.success && data.maintenanceMode === true);
        } catch (err) {
            // Server unreachable — silently keep previous state
        }
    }, []);

    useEffect(() => {
        // Check immediately on mount
        checkStatus();

        // Poll every 5 seconds for near-instant lockout
        const interval = setInterval(checkStatus, 5000);

        // Also re-check whenever the user switches back to this tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') checkStatus();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkStatus]);

    // Only super_admin and admin/login paths are exempt from maintenance lockout
    const isSuperAdmin = user?.role === 'super_admin';
    const isLoginPath = pathname?.startsWith('/login') || pathname?.startsWith('/admin/login');
    const isSuperAdminPath = pathname?.startsWith('/super-admin') || pathname?.startsWith('/admin');
    const isExempt = isSuperAdmin || isLoginPath || isSuperAdminPath;

    if (isMaintenance && !isExempt) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 z-50 fixed inset-0">
                <div className="max-w-lg w-full bg-white border border-[#E0D8C3] shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-sm p-8 sm:p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center mb-6 text-[#7C6A2E]">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.25em] text-[#A6955C] uppercase mb-2">
                        EASCCA LUXURY EXPERIENCE
                    </p>
                    <h1 className="text-3xl sm:text-4xl text-[#3D3000] font-serif font-bold mb-4 leading-tight">
                        Scheduled System Refinement
                    </h1>
                    <div className="w-12 h-0.5 bg-[#D4AF37] mb-6"></div>
                    <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed mb-6">
                        We are currently performing brief, scheduled enhancements to elevate your reservation experience. We warmly invite you to return shortly.
                    </p>
                    <div className="bg-[#FAF6EE] border border-[#E0D8C3] p-4 rounded-sm w-full mb-6 text-left">
                        <p className="text-[10px] font-bold tracking-wider text-[#7C6A2E] uppercase mb-1">
                            Urgent Booking Inquiries
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            For urgent date reservations or immediate event assistance, our concierge remains at your disposal at <span className="font-semibold text-gray-800">+94 65 224 0000</span> or <span className="font-semibold text-gray-800">concierge@eascca.luxury</span>.
                        </p>
                    </div>
                    <a
                        href="/admin/login"
                        className="text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:text-[#3D3000] uppercase transition-colors"
                    >
                        System Administrator Sign In →
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
