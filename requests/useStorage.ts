// requests/useStorage.ts

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import api from '@/lib/axios'
import type {
  StorageResponse,
  StoragePayload,
  CreateStoragePayload,
  UpdateStoragePayload,
} from '@/types/storage'

// Requests
export const requestGetStorages = async () => {
  const res = await api.get('/api/storage')
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse[]
}

export const requestCreateStorage = async (payload: CreateStoragePayload) => {
  const res = await api.post('/api/storage', payload)
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse
}

export const requestUpdateStorage = async (payload: UpdateStoragePayload) => {
  const res = await api.put(`/api/storage/${payload._id}`, payload)
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse
}

export const requestDeleteStorage = async (id: string) => {
  const res = await api.delete(`/api/storage/${id}`)
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse
}

export const requestGetDefaultStorages = async () => {
  const res = await api.get('/api/storage/default')
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse[]
}

// Hooks
export function useStorages(options = {}) {
  return useCustomQuery<StorageResponse[]>(['storages'], requestGetStorages, options)
}

export function useCreateStorage(options = {}) {
  const queryClient = useQueryClient()
  return useCustomMutation<StorageResponse, StoragePayload>(requestCreateStorage, {
    ...options,
    onSuccess: (data, variables) => {
      toast.success('Storage created successfully!')
      queryClient.invalidateQueries({ queryKey: ['storages'] })
    },
  })
}

export function useUpdateStorage(options = {}) {
  const queryClient = useQueryClient()
  return useCustomMutation<StorageResponse, StoragePayload>(requestUpdateStorage, {
    ...options,
    onSuccess: (data, variables) => {
      toast.success('Storage updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['storages'] })
    },
  })
}

export function useDeleteStorage(options = {}) {
  return useCustomMutation<StorageResponse, string>(requestDeleteStorage, options)
}

export function useDefautlStorages(options = {}) {
  return useCustomQuery<StorageResponse[]>(['storages'], requestGetDefaultStorages, options)
}
