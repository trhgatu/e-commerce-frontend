// src/types/product.ts
export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  categoryId: string;
  brand: string;
  stock: number;
  colorVariants: { colorId: string; stock: number }[];
  createdAt: string;
  updatedAt: string;
}