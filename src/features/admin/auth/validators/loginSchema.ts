import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Vui lòng nhập email hoặc tên đăng nhập')
    .max(100, 'Độ dài không hợp lệ'),
  password: z
    .string()
    .optional()
    /* .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu quá dài'), */
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
