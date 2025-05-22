export interface IBrand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
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