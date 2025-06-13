import axiosInstance from "@/services/axios";
import { CategoryCreateRequest, CategoryFilter } from "@/types";

const prefixCategories = "/categories";

export const getAllCategories = async (page: number, limit: number, filter: CategoryFilter = {}) => {
  const res = await axiosInstance.get(`${prefixCategories}`, {
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
  const response = await axiosInstance.get(`${prefixCategories}/${id}`);
  return response.data;
};

export const createCategory = async (data: CategoryCreateRequest) => {
  const response = await axiosInstance.post(`${prefixCategories}/create`, data)
  return response.data
}

export const deleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`${prefixCategories}/delete/${id}`);
  return response.data;
};

export const softDeleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`${prefixCategories}/delete/${id}`);
  return response.data;
};

export const hardDeleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`${prefixCategories}/hard-delete/${id}`);
  return response.data;
};

export const restoreCategoryById = async (id: string) => {
  const response = await axiosInstance.put(`${prefixCategories}/restore/${id}`);
  return response.data;
}
export const updateCategoryById = async (id: string, data: CategoryCreateRequest) => {
  const response = await axiosInstance.put(`${prefixCategories}/update/${id}`, data);
  return response.data;
}