// src/types/category.ts

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export interface ICategory {
  _id: string;
  name: string;
  parentId?: string;
  description?: string;
  icon?: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean
}

export interface CategoryFilter {
  search?: string;
  isDeleted?: boolean
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  status?: CategoryStatus;
  isDeleted?: boolean
}