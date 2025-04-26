// src/types/order.ts
export interface IOrder {
    _id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  }