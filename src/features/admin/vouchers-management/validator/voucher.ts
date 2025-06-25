import { z } from "zod";

export const baseVoucherSchema = z.object({
  code: z.string().min(1, "Mã voucher không được để trống"),
  type: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Vui lòng chọn loại giảm giá" }),
  }),
  value: z.number().min(1, "Giá trị giảm phải lớn hơn 0"),
  minOrderValue: z.number().min(0),
  maxDiscountValue: z.number().min(0),
  usageLimit: z.number().min(1),
  usagePerUser: z.number().min(1),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
  isActive: z.boolean(),
});
