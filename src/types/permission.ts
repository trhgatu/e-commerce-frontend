export interface IPermission {
    _id: string;
    name: string;
    description: string;
    label: string;
    group: string;
}

export interface PermissionCreateRequest {
    name: string;
    description: string;
    label: string;
    group: string;
}
export interface PermissionFilter {
    search?: string;
    isDeleted?: boolean;
}