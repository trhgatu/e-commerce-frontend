import { z } from 'zod'

export const basePermissionSchema = z.object({
    name: z.string()
        .min(1, "Tên quyền là bắt buộc")
        .min(3, "Tên quyền phải có ít nhất 3 ký tự"),
    label: z.string()
        .min(1, "Nhãn quyền là bắt buộc")
        .min(3, "Nhãn quyền phải có ít nhất 3 ký tự"),
    group: z.string()
        .min(1, "Nhóm quyền là bắt buộc"),
    description: z.string().optional(),
});