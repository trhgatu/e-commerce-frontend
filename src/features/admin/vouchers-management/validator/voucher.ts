import { z } from "zod";

export const baseVoucherSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Mã voucher phải có ít nhất 3 ký tự" })
    .max(20, { message: "Mã voucher tối đa 20 ký tự" }),

  type: z.enum(["percentage", "fixed"], {
    required_error: "Vui lòng chọn loại giảm giá",
  }),

  value: z
    .number({ invalid_type_error: "Giá trị giảm phải là số" })
    .min(1, { message: "Giá trị giảm phải lớn hơn 0" }),

  minOrderValue: z
    .number({ invalid_type_error: "Giá trị đơn hàng tối thiểu phải là số" })
    .min(0, { message: "Giá trị tối thiểu không được âm" }),

  maxDiscountValue: z
    .number({ invalid_type_error: "Giá trị giảm tối đa phải là số" })
    .min(0, { message: "Giá trị giảm tối đa không được âm" }),

  usageLimit: z
    .number({ invalid_type_error: "Số lượt sử dụng phải là số" })
    .min(1, { message: "Phải có ít nhất 1 lượt sử dụng" }),

  usagePerUser: z
    .number({ invalid_type_error: "Lượt dùng mỗi người phải là số" })
    .min(1, { message: "Ít nhất 1 lần mỗi người dùng" }),

  startDate: z
    .string({ required_error: "Vui lòng chọn ngày bắt đầu" }),

  endDate: z
    .string({ required_error: "Vui lòng chọn ngày kết thúc" }),

  isActive: z.boolean(),
});
