import { ResourceResponse } from './resource'

export interface BlogResponse {
  _id: string
  title: string
  summary: string
  banner: string
  content: string
  slug?: string
  banner_resource?: ResourceResponse
  is_published?: boolean
  created_by?: string
  created_time?: string
}
