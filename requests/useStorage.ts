import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import {
  requestGetStorages,
  requestCreateStorage,
  requestUpdateStorage,
  requestDeleteStorage,
} from '@/services/storage.service'
import type { StorageResponse, StoragePayload } from '@/types/storage'

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
