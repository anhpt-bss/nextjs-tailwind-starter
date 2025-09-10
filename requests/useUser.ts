// requests/useUser.ts

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import api from '@/lib/axios'
import { saveAuthCookies } from '@/services/auth.service'
import { UserResponse } from '@/types/user'

// Requests
export const requestGetProfile = async () => {
  const res = await api.get('/api/users/me')
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

export const requestUpdateProfile = async (payload) => {
  const res = await api.put('/api/users/me', payload)
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

export const requestGetUsers = async (): Promise<UserResponse[]> => {
  const res = await api.get('/api/users')
  if (!res.data.success) throw res.data
  return res.data.data
}

export const requestCreateUser = async (payload: Partial<UserResponse>) => {
  const res = await api.post('/api/users', payload)
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

export const requestUpdateUser = async (payload: Partial<UserResponse>) => {
  const res = await api.put(`/api/users/${payload._id}`, payload)
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

export const requestDeleteUser = async (id: string) => {
  const res = await api.delete(`/api/users/${id}`)
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

// Hooks
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

export function useCreateUser(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<UserResponse, Partial<UserResponse>>(requestCreateUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(options?.successMessage || 'Created successfully!')
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useUpdateUser(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<UserResponse, Partial<UserResponse>>(requestUpdateUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(options?.successMessage || 'Updated successfully!')
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useDeleteUser(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<UserResponse, string>(requestDeleteUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(options?.successMessage || 'Deleted successfully!')
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}
