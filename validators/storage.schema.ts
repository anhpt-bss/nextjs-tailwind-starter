import { z } from 'zod'

export const storageSchema = z.object({
  name: z.string().min(1),
  platform: z.enum(['github', 'cloudinary', 'supabase', 'imgur', 'other']),
  owner: z.string().min(1),
  repo: z.string().min(1),
  token: z.string().min(1),
})

export const storedFileSchema = z.object({
  storage: z.string().min(1),
  file_name: z.string().min(1),
  file_path: z.string().min(1),
  file_extension: z.string().optional(),
  content_type: z.string().optional(),
  size: z.number().optional(),
  sha: z.string().min(1),
  download_url: z.string().min(1),
  preview_url: z.string().optional(),
  uploaded_by: z.string().optional(),
  platform: z.enum(['github', 'cloudinary', 'supabase', 'imgur', 'other']).optional(),
  metadata: z.any().optional(),
})

export const uploadFileSchema = z.object({
  storage: z.string().min(1),
  base64_content: z.string().optional(),
  file_path: z.string().min(1),
})
