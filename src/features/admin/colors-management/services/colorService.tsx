import axiosInstance from "@/services/axios";
import { ColorCreateRequest } from "@/types";

// userService.ts
export const getAllColors = async (page: number, size: number) => {
  const res = await axiosInstance.get("/colors", {
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

export const createColor = async (data: ColorCreateRequest) => {
  const response = await axiosInstance.post("/colors/create", data)
  return response.data
}