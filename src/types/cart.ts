// src/types/cart.ts
export interface ICart {
    _id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
    }[];
    createdAt: string;
    updatedAt: string;
  }