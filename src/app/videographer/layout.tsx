import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function VideographerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["videographer"]}>
      {children}
    </ProtectedRoute>
  );
}
