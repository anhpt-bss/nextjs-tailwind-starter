import { z } from 'zod'

export const blogCrudSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  summary: z.string().min(1, 'Tóm tắt không được để trống'),
  banner: z.union([
    z.instanceof(File, { message: 'Vui lòng upload banner' }),
    z.string().min(1, 'Vui lòng chọn banner'),
  ]),
  content: z.string().min(1, 'Nội dung không được để trống'),
})

export type BlogCrudFormValues = z.infer<typeof blogCrudSchema>
