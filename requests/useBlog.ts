// requests/useBlog.ts

'use client'

import { useQueryClient } from '@tanstack/react-query'
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useCustomInfiniteQuery } from '@/hooks/useCustomInfiniteQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import api from '@/lib/axios'
import { BlogResponse } from '@/types/blog'
import { CommonParam, PaginatedResponse } from '@/types/common'
import { toQueryParams } from '@/utils/helper'

// Requests
export const requestGetBlogs = async (
  param: CommonParam
): Promise<PaginatedResponse<BlogResponse>> => {
  const res = await api.get(`/api/blogs?${toQueryParams(param)}`)
  if (!res.data.success) throw res.data
  return res.data.data
}

export const requestGetBlogById = async (id: string): Promise<BlogResponse> => {
  const res = await api.get(`/api/blogs/detail?id=${id}`)
  if (!res.data.success) throw res.data
  return res.data.data as BlogResponse
}

export const requestCreateBlog = async (payload: FormData) => {
  const res = await api.post('/api/blogs', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!res.data.success) throw res.data
  return res.data.data as BlogResponse
}

export const requestUpdateBlog = async (payload: FormData) => {
  const res = await api.put(`/api/blogs/${payload.get('_id') as string}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!res.data.success) throw res.data
  return res.data.data as BlogResponse
}

export const requestDeleteBlog = async (id: string) => {
  const res = await api.delete(`/api/blogs/${id}`)
  if (!res.data.success) throw res.data
  return res.data.data as BlogResponse
}

export const requestGetBlogBySlug = async (slug: string): Promise<BlogResponse> => {
  const res = await api.get(`/api/blogs/detail?slug=${slug}`)
  if (!res.data.success) throw res.data
  return res.data.data as BlogResponse
}

// Hooks
export function useBlogs(param: CommonParam = {}, options?: { enabled?: boolean }) {
  return useCustomQuery<PaginatedResponse<BlogResponse>, CommonParam>(
    ['blogs', { ...param }],
    requestGetBlogs,
    param,
    {
      ...options,
      refetchOnMount: true,
    }
  )
}

export function useBlogsById(id: string, options?: { enabled?: boolean }) {
  return useCustomQuery<BlogResponse, string>(['blogs-detail', id], requestGetBlogById, id, options)
}

export function useCreateBlog(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<BlogResponse, FormData>(requestCreateBlog, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success(options?.successMessage || 'Created successfully!')
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useUpdateBlog(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<BlogResponse, FormData>(requestUpdateBlog, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success(options?.successMessage || 'Updated successfully!')
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

export function useDeleteBlog(options?: { successMessage?: string; redirectUrl?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useCustomMutation<BlogResponse, string>(requestDeleteBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success(options?.successMessage || 'Deleted successfully!')
      if (options?.redirectUrl) router.push(options.redirectUrl)
    },
  })
}

// Client
export function useLazyBlogs(
  initialParams?: CommonParam,
  options?: Omit<
    UseInfiniteQueryOptions<
      PaginatedResponse<BlogResponse>,
      Error,
      PaginatedResponse<BlogResponse>,
      ['blogs', typeof initialParams],
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
): UseInfiniteQueryResult<PaginatedResponse<BlogResponse>, Error> {
  const initialSkip = initialParams?.skip ?? 0
  const defaultLimit = initialParams?.limit ?? 10

  return useCustomInfiniteQuery<
    PaginatedResponse<BlogResponse>,
    Error,
    PaginatedResponse<BlogResponse>,
    ['blogs', typeof initialParams],
    number
  >(
    ['blogs', initialParams],
    async ({ pageParam = initialSkip }) => {
      const params = {
        ...initialParams,
        limit: defaultLimit,
        skip: pageParam,
      }

      const { items, total } = await requestGetBlogs(params)

      return { items, total }
    },
    {
      initialPageParam: initialSkip,
      getNextPageParam: (lastPage, allPages) => {
        const totalFetched = allPages.reduce((acc, page) => acc + page.items.length, 0)
        const nextSkip = initialSkip + totalFetched

        return nextSkip < lastPage.total ? nextSkip : undefined
      },
      ...options,
    }
  )
}

export function useBlogsBySlug(slug: string, options?: { enabled?: boolean }) {
  return useCustomQuery<BlogResponse, string>(
    ['blogs-detail', slug],
    requestGetBlogBySlug,
    slug,
    options
  )
}
