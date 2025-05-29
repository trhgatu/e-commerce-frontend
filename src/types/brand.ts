export interface IBrand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface BrandCreateRequest {
  name: string;
  description?: string;
  logo?: string;
}

export interface BrandFilter {
  search?: string;
  isDeleted?: boolean;
}