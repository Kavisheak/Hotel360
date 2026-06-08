// Shared types, static data and status config for the Staff section

export type Role = 'all' | 'managers' | 'decorators';

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  roleCategory: 'managers' | 'decorators' | 'other';
  roleBadge: string;
  rating: number;
  reviews: number;
  status: 'active' | 'on_leave' | 'suspended';
  avatar: string;
}

export const staffData: StaffMember[] = [
  {
    id: 1,
    name: 'Eleanor Sterling',
    email: 'eleanor.s@eliteexcellence.com',
    role: 'Senior Manager',
    roleCategory: 'managers',
    roleBadge: 'Senior Manager',
    rating: 5.0,
    reviews: 124,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80',
  },
  {
    id: 2,
    name: 'Julian Vane',
    email: 'j.vane@eliteexcellence.com',
    role: 'Lead Decorator',
    roleCategory: 'decorators',
    roleBadge: 'Lead Decorator',
    rating: 4.8,
    reviews: 89,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80',
  },
  {
    id: 3,
    name: 'Sophia Rossi',
    email: 'sophia.cinema@eliteexcellence.com',
    role: 'Cinematographer',
    roleCategory: 'other',
    roleBadge: 'Cinematographer',
    rating: 4.9,
    reviews: 210,
    status: 'on_leave',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80',
  },
  {
    id: 4,
    name: 'Marcus Thorne',
    email: 'm.thorne@eliteexcellence.com',
    role: 'DJ Artist',
    roleCategory: 'other',
    roleBadge: 'DJ Artist',
    rating: 4.7,
    reviews: 56,
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80',
  },
];

export const statusConfig = {
  active: { label: 'ACTIVE', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  on_leave: { label: 'ON LEAVE', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  suspended: { label: 'SUSPENDED', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

export const avgRating = (
  staffData.reduce((sum, m) => sum + m.rating, 0) / staffData.length
).toFixed(2);
