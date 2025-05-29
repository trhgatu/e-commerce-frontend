export interface IRole {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
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
