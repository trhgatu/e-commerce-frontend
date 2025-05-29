import axiosInstance from "@/services/axios";
import { UserFilter } from "@/types";
// userService.ts
export const getAllUsers = async (page: number, limit: number, filter : UserFilter = {}) => {
  const res = await axiosInstance.get("/users", {
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
