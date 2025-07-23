import { requestDeleteMultipleFile, uploadLargeFilesToStorage } from '@/services/storedFile.service'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import {
  requestGetFiles,
  requestUploadFile,
  requestDeleteFile,
  requestUpdateFile,
} from '@/services/storedFile.service'
import {
  StoredFilePayload,
  StoredFileResponse,
  UploadFilePayload,
  UploadLargeFilePayload,
} from '@/types/storage'
import { useCustomInfiniteQuery } from '@/hooks/useCustomInfiniteQuery'
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { PaginatedResponse } from '@/types/common'

type MutationContext = { toastId: string }

export function useStorageFiles(params: any, options?: any) {
  return useCustomQuery(['files', params], () => requestGetFiles(params), options)
}

export function useUploadFile(options?: any) {
  const queryClient = useQueryClient()
  return useCustomMutation<StoredFileResponse, UploadFilePayload[], unknown, MutationContext>(
    requestUploadFile,
    {
      ...options,
      onMutate: () => {
        const toastId = toast.loading('Uploading file...')
        return { toastId }
      },
      onSuccess: (data, variables, context) => {
        toast.success('Upload file successfully!', {
          id: context?.toastId,
        })
        queryClient.invalidateQueries({ queryKey: ['files'] })
      },
      onError: (error, variables, context) => {
        toast.error('Failed to Upload file!', {
          id: context?.toastId,
        })
      },
    }
  )
}

export function useUploadLargeFiles(options?: any) {
  const queryClient = useQueryClient()
  return useCustomMutation<unknown, UploadLargeFilePayload[], unknown, MutationContext>(
    uploadLargeFilesToStorage,
    {
      ...options,
      onMutate: () => {
        const toastId = toast.loading('Uploading file...')
        return { toastId }
      },
      onSuccess: (data, variables, context) => {
        toast.success('Upload file successfully!', {
          id: context?.toastId,
        })
        queryClient.invalidateQueries({ queryKey: ['files'] })
      },
      onError: (error, variables, context) => {
        toast.error('Failed to Upload file!', {
          id: context?.toastId,
        })
      },
    }
  )
}

export function useDeleteFile(options?: any) {
  const queryClient = useQueryClient()
  return useCustomMutation<unknown, string>(requestDeleteFile, {
    ...options,
    onSuccess: (data, variables) => {
      toast.success('Delete file successfully!')
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })
}

export function useDeleteMultipleFile(options?: any) {
  const queryClient = useQueryClient()

  return useCustomMutation<unknown, string[], unknown, MutationContext>(requestDeleteMultipleFile, {
    ...options,
    onMutate: () => {
      const toastId = toast.loading('Deleting files...')
      return { toastId }
    },
    onSuccess: (data, variables, context) => {
      toast.success('Deleted files successfully!', {
        id: context?.toastId,
      })
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
    onError: (error, variables, context) => {
      toast.error('Failed to delete files!', {
        id: context?.toastId,
      })
    },
  })
}

export function useUpdateFile(options?: any) {
  return useCustomMutation<unknown, StoredFilePayload & { id: string }>(requestUpdateFile, options)
}

export function useLazyStorageFiles(
  initialParams?: { skip?: number; limit?: number; [key: string]: any },
  options?: Omit<
    UseInfiniteQueryOptions<
      PaginatedResponse<StoredFileResponse>,
      Error,
      PaginatedResponse<StoredFileResponse>,
      ['files', typeof initialParams],
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
): UseInfiniteQueryResult<PaginatedResponse<StoredFileResponse>, Error> {
  const initialSkip = initialParams?.skip ?? 0
  const defaultLimit = initialParams?.limit ?? 10

  return useCustomInfiniteQuery<
    PaginatedResponse<StoredFileResponse>,
    Error,
    PaginatedResponse<StoredFileResponse>,
    ['files', typeof initialParams],
    number
  >(
    ['files', initialParams],
    async ({ pageParam = initialSkip }) => {
      const params = {
        ...initialParams,
        limit: defaultLimit,
        skip: pageParam,
      }

      const { items, total } = await requestGetFiles(params)

      return { data: items, total }
    },
    {
      initialPageParam: initialSkip,
      getNextPageParam: (lastPage, allPages) => {
        const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0)
        const nextSkip = initialSkip + totalFetched

        return nextSkip < lastPage.total ? nextSkip : undefined
      },
      ...options,
    }
  )
}
