import { IColor } from "@/types/color";
import { ICategory } from "@/types/category";
import { IBrand } from "@/types/brand";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  categoryId?: ICategory;
  brandId?: IBrand;
  rating: number;
  reviewCount: number;
  stock: number;
  colorVariants: { colorId: IColor; stock: number }[];
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
  stock: number;
  isFeatured?: boolean;
  discountPercent?: number;
  tags?: string[];
  colorVariants?: { colorId: string; stock: number }[];
}

