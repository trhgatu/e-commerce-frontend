// src/types/category.ts
export interface ICategory {
  _id: string;
  name: string;
  parentId?: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean
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
}