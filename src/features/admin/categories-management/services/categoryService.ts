import axiosInstance from "@/services/axios";
import { CategoryCreateRequest } from "@/types";
export const getAllCategories = async (page: number, limit: number) => {
  const res = await axiosInstance.get("/categories", {
    params: {
      page: page,
      limit: limit,
    },
  });

  return {
    data: res.data.data,
    currentPage: res.data.currentPage,
    totalPages: res.data.totalPages,
    totalItems: res.data.totalItems,
  };
};

export const createCategory = async (data: CategoryCreateRequest) => {
  const response = await axiosInstance.post("/categories/create", data)
  return response.data
}

export const deleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/categories/delete/${id}`);
  return response.data;
};