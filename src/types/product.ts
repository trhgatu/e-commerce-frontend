import { IColor } from "@/types/color";
import { ICategory } from "@/types/category";
import { IBrand } from "@/types/brand";


export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  status?: ProductStatus;
  images: string[];
  thumbnail?: string;
  categoryId?: ICategory;
  brandId?: IBrand;
  rating: number;
  reviewCount: number;
  totalStock: number;
  availableColors?: IColor[];
  availableSizes?: string[];
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  discountPercent?: number;
  slug: string;
  tags?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}
export interface ProductFilter {
  search?: string;
  category?: string;
  brand?: string;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  isDeleted?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ProductCreateRequest {
  name: string;
  price: number;
  description?: string;
  images?: string[];
  thumbnail?: string;
  categoryId: string;
  brandId: string;
  isFeatured?: boolean;
  discountPercent?: number;
  tags?: string[];
  availableColors?: string[];
}

