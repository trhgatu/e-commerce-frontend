import { IProduct } from "./product";
import { IColor } from "./color";

export interface IInventory {
    _id: string;
    productId: IProduct;
    colorId?: IColor;
    quantity: number;
    minQuantity: number;
    maxQuantity: number;
    location: string;
    status: "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
    lastRestocked: string;
    notes?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryFilter {
    search?: string;
    isDeleted?: boolean;
}

export interface InventoryCreateRequest {
    productId: string;
    colorId?: string;
    quantity: number;
    minQuantity?: number;
    maxQuantity?: number;
}

