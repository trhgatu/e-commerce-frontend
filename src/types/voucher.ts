export interface IVoucher {
    _id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrderValue: number;
    maxDiscountValue: number;
    usageLimit: number;
    usageCount: number;
    usagePerUser: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherCreateRequest {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrderValue: number;
    maxDiscountValue: number;
    usageLimit: number;
    usagePerUser: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface VoucherFilter {
    search?: string;
    isDeleted?: boolean;
}
