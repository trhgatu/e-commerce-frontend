import axiosInstance from "@/services/axios";
import { IVoucher, VoucherCreateRequest, VoucherFilter } from "@/types";

export const getAllVouchers = async (page: number, limit: number, filter: VoucherFilter = {}) => {
  const res = await axiosInstance.get("/vouchers", {
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

export const createVoucher = async (data: VoucherCreateRequest) => {
  const response = await axiosInstance.post("/vouchers/create", data)
  return response.data
}

export const getVoucherById = async (id: string): Promise<IVoucher> => {
  const response = await axiosInstance.get(`/vouchers/${id}`)
  return response.data.data
}

export const softDeleteVoucherById = async (id: string) => {
  const response = await axiosInstance.delete(`/vouchers/delete/${id}`);
  return response.data;
};

export const hardDeleteVoucherById = async (id: string) => {
  const response = await axiosInstance.delete(`/vouchers/hard-delete/${id}`);
  return response.data;
};

export const restoreVoucherById = async (id: string) => {
  const response = await axiosInstance.put(`/vouchers/restore/${id}`);
  return response.data;
}

export const updateVoucherById = async (id: string, data: VoucherCreateRequest) => {
  const response = await axiosInstance.put(`/vouchers/update/${id}`, data);
  return response.data;
};
