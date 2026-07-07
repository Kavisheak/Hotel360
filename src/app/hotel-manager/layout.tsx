import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function HotelManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      {children}
    </ProtectedRoute>
  );
}
