import { z } from 'zod'

export const blogCrudSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  banner: z.union([
    z.instanceof(File, { message: 'Please upload a banner' }),
    z.string().min(1, 'Please select a banner'),
  ]),
  content: z.string().min(1, 'Content is required'),
  is_published: z.boolean().optional(),
})

export type BlogCrudFormValues = z.infer<typeof blogCrudSchema>
