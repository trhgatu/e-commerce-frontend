export enum PermissionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DEPRECATED = 'deprecated',
}

export interface IPermission {
    _id: string;
    name: string;
    description: string;
    status: PermissionStatus;
    label: string;
    group: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PermissionCreateRequest {
    name: string;
    description?: string;
    label: string;
    group: string;
}
export interface PermissionFilter {
    search?: string;
    isDeleted?: boolean;
    group?: string;
}