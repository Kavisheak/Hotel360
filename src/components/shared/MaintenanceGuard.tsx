"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const { user } = useAuthStore();
    const pathname = usePathname();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/system-status`);
                const data = await res.json();

                if (data.success && data.maintenanceMode) {
                    setIsMaintenance(true);
                } else {
                    setIsMaintenance(false);
                }
            } catch (err) {
                // Silently fail if server is down, assume not maintenance to avoid locking admins out entirely if connection issues occur, though server down essentially equals maintenance
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const isSuperAdmin = user?.role === 'super_admin';
    const isAdminOrManagerContext = pathname?.startsWith('/super-admin') || pathname?.startsWith('/hotel-manager');

    if (isMaintenance && !isSuperAdmin && !isAdminOrManagerContext) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 z-50 fixed inset-0">
                <h1 className="text-4xl text-[#7C6A2E] font-playfair mb-4">Under Maintenance</h1>
                <p className="text-gray-600 max-w-md text-center mb-8">
                    The EASCC booking platform is currently undergoing scheduled maintenance. Please check back later.
                </p>
                <div className="w-16 h-1 bg-[#D4AF37] opacity-60"></div>
            </div>
        );
    }

    return <>{children}</>;
}
