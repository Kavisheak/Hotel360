"use client";

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const ADMIN_ROLES = ['super_admin', 'manager'];
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

    // Determine if current user/path is exempt from the maintenance lockout
    const isAdminRole = user?.role && ADMIN_ROLES.includes(user.role);
    const isAdminPath = pathname?.startsWith('/super-admin') || pathname?.startsWith('/hotel-manager');
    const isLoginPath = pathname?.startsWith('/login');
    const isExempt = isAdminRole || isAdminPath || isLoginPath;

    if (isMaintenance && !isExempt) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 z-50 fixed inset-0">
                <div className="w-16 h-16 rounded-full bg-[#FAF6EE] flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-[#7C6A2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl text-[#7C6A2E] font-playfair mb-4 text-center">Under Maintenance</h1>
                <p className="text-gray-500 max-w-md text-center mb-6 leading-relaxed">
                    The EASCC booking platform is currently undergoing scheduled maintenance. Please check back later.
                </p>
                <div className="w-16 h-0.5 bg-[#D4AF37] opacity-60 mb-6"></div>
                <p className="text-xs text-gray-400 tracking-widest uppercase">EASCCA Conference Centre</p>
            </div>
        );
    }

    return <>{children}</>;
}
