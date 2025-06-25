import axiosInstance from "@/services/axios";
import { InventoryCreateRequest, InventoryFilter } from "@/types";

export const getAllInventories = async (page: number, limit: number, filter: InventoryFilter = {}) => {
  const res = await axiosInstance.get("/inventories", {
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

export const createInventory = async (data: InventoryCreateRequest) => {
  const response = await axiosInstance.post("/inventories/create", data)
  return response.data
}

export const getInventoryById = async (id: string) => {
  const response = await axiosInstance.get(`/inventories/${id}`)
  return response.data
}

export const deleteInventoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/inventories/delete/${id}`);
  return response.data;
};

export const hardDeleteInventoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/inventories/hard-delete/${id}`);
  return response.data;
};

export const restoreInventoryById = async (id: string) => {
  const response = await axiosInstance.put(`/inventories/restore/${id}`);
  return response.data;
}

export const updateInventoryById = async (id: string, data: InventoryCreateRequest) => {
  const response = await axiosInstance.put(`/inventories/update/${id}`, data);
  return response.data;
};
