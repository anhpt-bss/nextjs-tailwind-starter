// requests/useAuth.ts

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useCustomMutation } from '@/hooks/useCustomMutation'
import api from '@/lib/axios'
import { logoutAndClearSession, saveAuthCookies } from '@/services/auth.service'
import { UserResponse } from '@/types/user'

// Requests
export const requestLogin = async (payload) => {
  const res = await api.post('/api/auth/login', payload)
  if (!res.data.success) throw res.data
  return res.data.data
}

export const requestRegister = async (payload) => {
  const res = await api.post('/api/auth/register', payload)
  if (!res.data.success) throw res.data
  return res.data.data
}

export const requestLogout = async () => {
  const res = await api.post('/api/auth/logout')
  if (!res.data.success) throw res.data
  return res.data.data
}

// Hooks
export function useLogin(options?: { successMessage?: string; redirectUrl?: string }) {
  const router = useRouter()
  return useCustomMutation<
    { token: string; user: UserResponse },
    { email: string; password: string }
  >(requestLogin, {
    onSuccess: (data) => {
      toast.success(options?.successMessage || 'Login successfully!')

      saveAuthCookies(data.token, data.user)

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('profile-changed'))
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useRegister(options?: { successMessage?: string; redirectUrl?: string }) {
  const router = useRouter()
  return useCustomMutation<
    { user: UserResponse },
    { name: string; email: string; password: string }
  >(requestRegister, {
    onSuccess: (data) => {
      toast.success(options?.successMessage || 'Registration successfully!')

      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useLogout(options?: { successMessage?: string; redirectUrl?: string }) {
  const router = useRouter()
  return useCustomMutation<null>(requestLogout, {
    onSuccess: () => {
      toast.success(options?.successMessage || 'Logged out successfully!')

      logoutAndClearSession()

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('profile-changed'))
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}
