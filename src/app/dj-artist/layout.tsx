import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function DjArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["dj_artist"]}>
      {children}
    </ProtectedRoute>
  );
}
