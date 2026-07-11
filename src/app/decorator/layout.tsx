import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function DecoratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["decorator"]}>
      {children}
    </ProtectedRoute>
  );
}
