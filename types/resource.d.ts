import { z } from 'zod'

import {
  ResourceBaseSchema,
  ResourceCreateSchema,
  ResourceResponseSchema,
} from '@/validators/resource.schema'

import { StorageResponse } from './storage'

export type ResourceBase = z.infer<typeof ResourceBaseSchema>
export type ResourceCreate = z.infer<typeof ResourceCreateSchema>
export type ResourceResponse = z.infer<typeof ResourceResponseSchema>

export type UploadCloudResourcePayload = {
  platform: 'local' | 'github' | 'cloudinary' | 'supabase' | 'imgur' | 'other'
  storage: StorageResponse
  base64_content: string
  saved_path: string
  filename: string
  size: number
  mimetype: string
}
