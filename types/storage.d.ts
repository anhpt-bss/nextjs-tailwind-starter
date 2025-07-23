import { Types } from 'mongoose'
import { storageSchema, storedFileSchema } from '@/validators/storage.schema'

export type StoragePayload = z.infer<typeof storageSchema>

export type Platform = 'github' | 'cloudinary' | 'supabase' | 'imgur' | 'other'

export interface StorageResponse {
  _id: string
  user: string
  platform: Platform
  name: string
  owner: string
  repo: string
  token: string
  created_at: Date
  updated_at: Date
}

export type CreateStoragePayload = StoragePayload
export type UpdateStoragePayload = StoragePayload & { _id: string }

export interface StoredFileResponse {
  _id: string
  storage: string
  file_name: string
  file_path: string
  file_extension: string
  content_type: string
  size?: number
  sha: string
  download_url: string
  preview_url: string
  uploaded_by: string
  platform: Platform
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

export type StoredFilePayload = z.infer<typeof storedFileSchema>

export type UploadFilePayload = {
  storage: string
  base64_content: string
  file_path: string
  file_name: string
  file_extension: string
  content_type: string
  size: number
}

export type UploadLargeFilePayload = {
  storage: StorageResponse
  base64_content: string
  file_path: string
  file_name: string
  file_extension: string
  content_type: string
  size: number
}
