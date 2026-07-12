import React from 'react';
import { useAuthStore } from '@/store/authStore';

const OverviewHeader = () => {
  const { user } = useAuthStore();
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Lead Videographer";

  return (
    <div className="mb-8 mt-4">
      <p className="text-sm font-serif italic text-[#A6955C] mb-1">Capturing every moment</p>
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
          Welcome back, {displayName}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Track assigned events, live coverage progress, equipment readiness, and media delivery from one calm, structured workspace.
        </p>
      </div>
    </div>
  );
};

export default OverviewHeader;
