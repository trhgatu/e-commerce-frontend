import axiosInstance from "@/services/axios";
import { ProductCreateRequest } from "@/types";

// userService.ts
export const getALlProducts = async (page: number, size: number) => {
  const res = await axiosInstance.get("/products", {
    params: {
      pageNumber: page,
      pageSize: size,
    },
  });

  return {
    data: res.data.data,
    currentPage: res.data.currentPage,
    totalPages: res.data.totalPages,
    totalItems: res.data.totalItems,
  };
};

export const createProduct = async (data: ProductCreateRequest) => {
  const response = await axiosInstance.post("/products/create", data)
  return response.data
}
