import axiosInstance from "@/services/axios";
import { ColorCreateRequest, ColorFilter, IColor } from "@/types";

// userService.ts
export const getAllColors = async (page: number, limit: number, filter: ColorFilter = {} ) => {
  const res = await axiosInstance.get("/colors", {
    params: {
      pageNumber: page,
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

export const createColor = async (data: ColorCreateRequest) => {
  const response = await axiosInstance.post("/colors/create", data)
  return response.data
}

export const getColorById = async (id: string): Promise<IColor> => {
  const response = await axiosInstance.get(`/colors/${id}`)
  return response.data.data
}

export const softDeleteColorById = async (id: string) => {
  const response = await axiosInstance.delete(`/colors/delete/${id}`);
  return response.data;
};

export const hardDeleteColorById = async (id: string) => {
  const response = await axiosInstance.delete(`/colors/hard-delete/${id}`);
  return response.data;
};

export const restoreColorById = async (id: string) => {
  const response = await axiosInstance.put(`/colors/restore/${id}`);
  return response.data;
}