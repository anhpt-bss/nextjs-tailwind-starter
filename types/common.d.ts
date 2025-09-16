export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: {
    code?: string
    details?: any
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

export interface CommonParam {
  search?: string
  sort?: string
  skip?: number
  limit?: number
}
