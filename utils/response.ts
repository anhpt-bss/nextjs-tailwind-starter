// utils/response.ts

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: {
    code?: string
    details?: any
  }
}

export function successResponse<T>(data: T, message = 'Operation successful.', status = 200) {
  return {
    status,
    body: {
      success: true,
      message,
      data,
    },
  }
}

export function errorResponse(message: string, code: string, status = 400, details: any = null) {
  return {
    status,
    body: {
      success: false,
      message,
      error: {
        code,
        details,
      },
    },
  }
}
