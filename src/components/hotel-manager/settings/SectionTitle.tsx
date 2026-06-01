import React from 'react';

export const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-6 h-[1px] bg-gray-400" />
    <h3 className="text-xl font-serif text-gray-800">{title}</h3>
  </div>
);
