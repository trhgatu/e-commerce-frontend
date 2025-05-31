// src/types/color.ts
export interface IColorVariant {
  colorId: IColor;
  stock: number;
}

export interface IColor {
  _id: string;
  name: string;
  hexCode: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorCreateRequest {
  name: string;
  hexCode: string;
  description?: string
}

export interface ColorFilter {
  search?: string;
  isDeleted?: boolean;
}