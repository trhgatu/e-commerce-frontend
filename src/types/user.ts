// src/types/user.ts

export interface IUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string; // ISO date string
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string; // ISO date string
  membershipRankId?: string;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}
