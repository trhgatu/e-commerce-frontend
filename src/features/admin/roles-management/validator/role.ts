import { z } from "zod"

export const baseRoleSchema =
    z.object({
        name: z.string().min(3, 'Role name must be at least 3 characters long').max(255, 'Role name must not exceed 255 characters'),
        description: z.string().optional(),
        permissions: z.array(z.string()).min(1, "Phải chọn ít nhất 1 quyền")
    });