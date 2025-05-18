import axiosInstance from "@/services/axios";
import { IProduct, ProductCreateRequest } from "@/types";

// userService.ts
export const getAllProducts = async (page: number, size: number) => {
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

export const getProductById = async (id: string): Promise<IProduct> => {
  const response = await axiosInstance.get(`/products/${id}`)
  return response.data.data
}

export const deleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/products/delete/${id}`);
  return response.data;
};

