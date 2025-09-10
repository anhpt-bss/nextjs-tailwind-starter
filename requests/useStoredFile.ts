// requests/useStoredFile.ts

import { useQueryClient } from '@tanstack/react-query'
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useCustomInfiniteQuery } from '@/hooks/useCustomInfiniteQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import api from '@/lib/axios'
import { decrypt } from '@/lib/encrypt'
import { uploadFileToGithub } from '@/lib/github'
import { PaginatedResponse } from '@/types/common'
import {
  StoredFilePayload,
  StoredFileResponse,
  UploadFilePayload,
  UploadLargeFilePayload,
} from '@/types/storage'

type MutationContext = { toastId: string }

// Requests
export const requestGetFiles = async (params: any) => {
  const res = await api.get('/api/file', { params })
  return res.data.data
}

export const requestUploadFile = async (payload: UploadFilePayload[]) => {
  const res = await api.post('/api/file/upload', payload)
  return res.data.data
}

export const requestDeleteFile = async (id: string) => {
  const res = await api.delete(`/api/file/${id}`)
  return res.data.data
}

export const requestDeleteMultipleFile = async (ids: string[]) => {
  const res = await api.post('/api/file/delete-multiple', { ids })
  return res.data.data
}

export const requestUpdateFile = async (payload: StoredFilePayload & { id: string }) => {
  const res = await api.put(`/api/file/${payload.id}`, payload)
  return res.data.data
}

export const requestGetFolders = async () => {
  const res = await api.get('/api/file/folders')
  if (!res.data.success) throw res.data
  return res.data.data as string[]
}

export async function requestUploadLargeFilesToStorage(files: UploadLargeFilePayload[]) {
  const storedFilePayload: StoredFilePayload[] = []
  const errors: { file: UploadLargeFilePayload; error: any }[] = []

  const toastId = toast.loading('Uploading files...')

  for (let i = 0; i < files.length; i++) {
    const fileData = files[i]
    const storage = fileData.storage

    try {
      const githubRes = await uploadFileToGithub({
        owner: storage.owner,
        repo: storage.repo,
        token: decrypt(storage.token),
        path: `${fileData.file_path}/${fileData.file_name}`,
        fileContent: fileData.base64_content,
        fileName: fileData.file_name,
      })

      storedFilePayload.push({
        storage: storage._id,
        file_name: fileData.file_name,
        file_extension: fileData.file_extension,
        content_type: fileData.content_type,
        size: fileData.size,
        file_path: `${fileData.file_path}/${fileData.file_name}`,
        sha: githubRes.sha,
        download_url: githubRes.download_url,
        preview_url: githubRes.preview_url,
        platform: storage.platform,
        metadata: githubRes?.metadata?.content?.url,
        uploaded_by: storage.user,
      })

      toast.loading(`🎉(${i + 1}/${files.length}) Uploaded files successfully`, {
        id: toastId,
        description: null,
      })
    } catch (e: any) {
      toast.loading(`🚫(${i + 1}/${files.length}) Failed to upload ${fileData.file_name}`, {
        id: toastId,
        description: e.message,
      })
      errors.push({ file: fileData, error: e.message })
    }
  }

  if (storedFilePayload.length === 0) {
    toast.error('All files failed to upload', {
      id: toastId,
      description: `${errors.map((err) => `${err.error}\n`)}`,
      duration: 6000,
    })

    throw {
      message: 'All files failed to upload',
      code: 'UPLOAD_FAILED',
      status: 400,
      errors,
    }
  }

  const res = await api.post('/api/file/save-files', storedFilePayload)

  toast.success(`Uploaded (${storedFilePayload.length} / ${files.length}) files successfully`, {
    id: toastId,
    description:
      errors.length > 0
        ? `🚫 ${errors.length} file(s) failed to upload (${errors.map((err) => `${err.error}\n`)})`
        : null,
    duration: 6000,
  })

  return { success: res.data.data, failed: errors }
}

// Hooks
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
    requestUploadLargeFilesToStorage,
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['files'] })
      },
      onError: (error, variables, context) => {
        console.error(error)
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

export function useFolders(options = {}) {
  return useCustomQuery<string[]>(['folders'], requestGetFolders, options)
}
