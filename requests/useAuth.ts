// requests/useAuth.ts
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { logoutAndClearSession, saveAuthCookies } from '@/services/auth.service'
import { requestLogin, requestRegister, requestLogout } from '@/services/auth.service'
import { UserResponse } from '@/types/user'

export function useLogin(options?: { successMessage?: string; redirectUrl?: string }) {
  const router = useRouter()
  return useCustomMutation<
    { token: string; user: UserResponse },
    { email: string; password: string }
  >(requestLogin, {
    onSuccess: (data) => {
      toast.success(options?.successMessage || 'Login successful!')

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
      toast.success(options?.successMessage || 'Registration successful!')

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
