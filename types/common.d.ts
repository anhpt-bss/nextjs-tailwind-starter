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
  data: T[]
  total: number
}
