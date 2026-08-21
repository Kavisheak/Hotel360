"use client";

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import GlobalReviewPrompt from '@/components/myaccount/GlobalReviewPrompt';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="flex flex-col min-h-screen bg-[#F0E6D0] dark:bg-[#0A0A0A] font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
        <main className="flex-grow w-full">
          {children}
        </main>
        <GlobalReviewPrompt />
      </div>
    </ProtectedRoute>
  );
}
