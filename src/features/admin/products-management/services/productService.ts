import axiosInstance from "@/services/axios";
import { IProduct, ProductCreateRequest } from "@/types";
import { ProductFilter } from "@/types";

export const getAllProducts = async (page: number, limit: number, filter: ProductFilter = {}) => {
  const res = await axiosInstance.get("/products", {
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

export const createProduct = async (data: ProductCreateRequest) => {
  const response = await axiosInstance.post("/products/create", data)
  return response.data
}

export const getProductById = async (id: string): Promise<IProduct> => {
  const response = await axiosInstance.get(`/products/${id}`)
  return response.data.data
}

export const softDeleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/products/delete/${id}`);
  return response.data;
};

export const hardDeleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/products/hard-delete/${id}`);
  return response.data;
};

export const restoreProductById = async (id: string) => {
  const response = await axiosInstance.put(`/products/restore/${id}`);
  return response.data;
}

export const updateProductById = async (id: string, data: ProductCreateRequest) => {
  const response = await axiosInstance.put(`/products/update/${id}`, data);
  return response.data;
};

