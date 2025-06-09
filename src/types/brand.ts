
export enum BrandStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface IBrand {
  _id: string;
  name: string;
  description?: string;
  status: BrandStatus;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
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
