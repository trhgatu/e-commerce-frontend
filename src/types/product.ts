import { IColor } from "@/types/color";
import { ICategory } from "@/types/category";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  categoryId: ICategory;
  brand: string;
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
