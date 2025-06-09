// src/types/color.ts

export enum ColorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface IColorVariant {
  colorId: IColor;
  stock: number;
}

export interface IColor {
  _id: string;
  name: string;
  hexCode: string;
  description: string;
  status: ColorStatus;
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