import axiosInstance from "@/services/axios"
import { IPermission, PermissionCreateRequest, PermissionFilter } from "@/types/permission";

export const getAllPermissions = async (page: number, limit: number, filter: PermissionFilter = {}) => {
    const res = await axiosInstance.get("/permissions", {
        params: {
            page: page,
            limit: limit,
            ...filter,
        },
    });
    return {
        data: res.data.data,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalItems: res.data.totalItems,
    };
}

export const createPermission = async (data: PermissionCreateRequest) => {
  const response = await axiosInstance.post("/permissions/create", data)
  return response.data
}

export const getPermissionById = async (id: string): Promise<IPermission> => {
  const response = await axiosInstance.get(`/permissions/${id}`)
  return response.data.data
}

export const softDeletePermissionById = async (id: string) => {
  const response = await axiosInstance.delete(`/permissions/delete/${id}`);
  return response.data;
};

export const hardDeletePermissionById = async (id: string) => {
  const response = await axiosInstance.delete(`/permissions/hard-delete/${id}`);
  return response.data;
};

export const restorePermissionById = async (id: string) => {
  const response = await axiosInstance.put(`/permissions/restore/${id}`);
  return response.data;
}

export const updatePermissionById = async (id: string, data: PermissionCreateRequest) => {
  const response = await axiosInstance.put(`/permissions/update/${id}`, data);
  return response.data;
};