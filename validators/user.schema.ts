import { z } from 'zod'

export const userCrudSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (val.length >= 9 &&
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /\d/.test(val) &&
          /[^A-Za-z0-9]/.test(val)),
      {
        message: 'Mật khẩu phải có ít nhất 9 ký tự, gồm hoa, thường, số và ký tự đặc biệt',
      }
    ),
  is_admin: z.boolean().optional(),
})

export type UserCrudFormValues = z.infer<typeof userCrudSchema>
