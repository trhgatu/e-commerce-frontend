import axiosInstance from "@/services/axios";
import { BrandCreateRequest } from "@/types";

// userService.ts
export const getAllBrands = async (page: number, limit: number) => {
  const res = await axiosInstance.get("/brands", {
    params: {
      page: page,
      limit: limit
    },
  });

  return {
    data: res.data.data,
    currentPage: res.data.currentPage,
    totalPages: res.data.totalPages,
    totalItems: res.data.totalItems,
  };
};

export const createBrand = async (data: BrandCreateRequest) => {
  const response = await axiosInstance.post("/brands/create", data)
  return response.data
}

export const deleteBrandById = async (id: string) => {
  const response = await axiosInstance.delete(`/brands/delete/${id}`);
  return response.data;
};