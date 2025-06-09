import { z } from "zod"

export const baseBrandSchema = z.object({
    name: z.string().min(2, "Tên thương hiệu là bắt buộc"),
    description: z.string().optional(),
    logo: z.string().url("Logo phải là URL hợp lệ").optional().or(z.literal("")),
    website: z.string().url("Website phải là URL hợp lệ").optional().or(z.literal("")),
    email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});