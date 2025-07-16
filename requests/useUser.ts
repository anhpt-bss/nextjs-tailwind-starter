// requests/useUser.ts
import api from '@/lib/axios'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { UserResponse } from '@/types/user'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { saveAuthCookies } from '@/services/auth.service'
import { requestGetProfile, requestUpdateProfile, requestGetUsers } from '@/services/user.service'

export function useProfile() {
  return useCustomQuery<UserResponse>(['profile'], requestGetProfile)
}

export function useUpdateProfile(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<UserResponse, Partial<UserResponse>>(requestUpdateProfile, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(options?.successMessage || 'Profile updated!')

      saveAuthCookies(undefined, data)

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('profile-changed'))
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useUsers() {
  return useCustomQuery<UserResponse[]>(['users'], requestGetUsers)
}
