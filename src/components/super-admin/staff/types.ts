export type Role = 'all' | 'managers' | 'decorators' | 'videographers' | 'djs';

export interface StaffMember {
  id: number | string;
  name: string;
  email: string;
  role: string;
  roleCategory: 'managers' | 'decorators' | 'videographers' | 'djs' | 'other';
  roleBadge: string;
  rating: number;
  reviews: number;
  status: 'active' | 'on_leave' | 'suspended';
  avatar: string;
  completedEvents?: number;
  assignedThisWeek?: number;
  availability?: string;
}

export const statusConfig = {
  active: { label: 'ACTIVE', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  on_leave: { label: 'ON LEAVE', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  suspended: { label: 'SUSPENDED', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};
