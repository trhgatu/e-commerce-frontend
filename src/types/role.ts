import { IPermission } from "@/types/permission";

export interface IRole {
    _id: string;
    name: string;
    description?: string;
    permissions: IPermission[];
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
export interface RoleCreateRequest {
    name: string;
    description?: string;
    permissions: string[];
}
export interface RoleFilter {
    search?: string;
    isDeleted?: boolean;
}
