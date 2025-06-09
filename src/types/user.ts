// src/types/user.ts

import { IRole } from "@/types/role";

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending'
}
export interface IUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  roleId: IRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: string;
  membershipRankId?: string;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  emailVerified?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
