// hooks/useApiErrorHandler.ts
import { logoutAndClearSession } from '@/services/auth.service'
import { ApiResponse } from '@/types/common'
import { toast } from 'sonner'

export function handleApiError(error: any) {
  let message = error?.message || 'Unknown error'
  let code = error?.code || 'UNKNOWN_ERROR'
  let status = error?.status || 500

  if (error?.response) {
    const errorData: ApiResponse = error.response.data
    message = errorData.message || message
    code = errorData.error?.code || code
    status = error?.response?.status || status
  }

  toast.error(message)

  if (status === 401 || status === 403) {
    // Clear token/cookie, redirect login
    logoutAndClearSession()
    window.location.href = '/login'
  }
}
