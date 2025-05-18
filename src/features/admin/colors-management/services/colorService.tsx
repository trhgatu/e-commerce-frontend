import axiosInstance from "@/services/axios";

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
