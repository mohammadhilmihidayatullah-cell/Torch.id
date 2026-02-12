
import React from 'react';
import { Plane, GraduationCap, Moon, Briefcase, Coffee } from 'lucide-react';
import { UserCategory } from './types';

export const COLORS = {
  primary: '#1D4ED8',
  primaryHover: '#1E40AF',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#F3F4F6',
  accent: '#DBEAFE'
};

export const CATEGORY_ICONS: Record<UserCategory, React.ReactNode> = {
  [UserCategory.TRAVELING]: <Plane size={24} />,
  [UserCategory.BACK_TO_SCHOOL]: <GraduationCap size={24} />,
  [UserCategory.UMRAH_IBADAH]: <Moon size={24} />,
  [UserCategory.KANTORAN]: <Briefcase size={24} />,
  [UserCategory.HANGOUT]: <Coffee size={24} />,
};

export const PRODUCT_COLLECTIONS = [
  'Backpack',
  'Travel Bag',
  'Sling Bag',
  'Messenger Bag',
  'Waist Bag',
  'Tote Bag',
  'Apparel & Footwear',
  'Perlengkapan Ibadah',
  'Aksesories',
  'Pouch & Wallet',
  'Laptop Sleeve'
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Adi Pratama', category: UserCategory.TRAVELING, km: 1240, streak: 12 },
  { rank: 2, name: 'Siti Aminah', category: UserCategory.KANTORAN, km: 850, streak: 8 },
  { rank: 3, name: 'Budi Santoso', category: UserCategory.HANGOUT, km: 420, streak: 5 },
  { rank: 4, name: 'Lestari', category: UserCategory.TRAVELING, km: 310, streak: 3 },
  { rank: 5, name: 'Rizky', category: UserCategory.BACK_TO_SCHOOL, km: 150, streak: 2 },
];
