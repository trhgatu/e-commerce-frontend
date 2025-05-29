import axiosInstance from "@/services/axios";
import { IRole, RoleCreateRequest, RoleFilter } from "@/types";

export const getAllRoles = async (page: number, limit: number, filter: RoleFilter = {}) => {
  const res = await axiosInstance.get("/roles", {
    params: {
      pageNumber: page,
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
};

export const createRole = async (data: RoleCreateRequest) => {
  const response = await axiosInstance.post("/roles/create", data)
  return response.data
}

export const getRoleById = async (id: string): Promise<IRole> => {
  const response = await axiosInstance.get(`/roles/${id}`)
  return response.data.data
}

export const softDeleteRoleById = async (id: string) => {
  const response = await axiosInstance.delete(`/roles/delete/${id}`);
  return response.data;
};

export const hardDeleteRoleById = async (id: string) => {
  const response = await axiosInstance.delete(`/roles/hard-delete/${id}`);
  return response.data;
};

export const restoreRoleById = async (id: string) => {
  const response = await axiosInstance.put(`/roles/restore/${id}`);
  return response.data;
}

export const updateRoleById = async (id: string, data: RoleCreateRequest) => {
  const response = await axiosInstance.put(`/roles/update/${id}`, data);
  return response.data;
};

