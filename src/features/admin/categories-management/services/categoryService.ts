import axiosInstance from "@/services/axios";
import { CategoryCreateRequest, CategoryFilter } from "@/types";
export const getAllCategories = async (page: number, limit: number, filter: CategoryFilter = {}) => {
  const res = await axiosInstance.get("/categories", {
    params: {
      page: page,
      limit: limit,
      ...filter
    },
  });

  return {
    data: res.data.data,
    currentPage: res.data.currentPage,
    totalPages: res.data.totalPages,
    totalItems: res.data.totalItems,
  };
};

export const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: CategoryCreateRequest) => {
  const response = await axiosInstance.post("/categories/create", data)
  return response.data
}

export const deleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/categories/delete/${id}`);
  return response.data;
};

export const softDeleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/categories/delete/${id}`);
  return response.data;
};

export const hardDeleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/categories/hard-delete/${id}`);
  return response.data;
};

export const restoreCategoryById = async (id: string) => {
  const response = await axiosInstance.put(`/categories/restore/${id}`);
  return response.data;
}
