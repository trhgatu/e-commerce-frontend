export interface IProduct {
    _id: string;
    name: string;
    price: number;
    description?: string;
    images: string[];
    thumbnail?: string;
    createdAt: string;
  }