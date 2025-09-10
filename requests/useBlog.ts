// requests/useBlog.ts

'use client'

import { useQueryClient } from '@tanstack/react-query'
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useCustomInfiniteQuery } from '@/hooks/useCustomInfiniteQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import {
  requestGetBlogs,
  requestCreateBlog,
  requestUpdateBlog,
  requestDeleteBlog,
  requestGetBlogById,
  requestGetBlogBySlug,
} from '@/services/blog.service'
import { BlogResponse } from '@/types/blog'
import { CommonParam, PaginatedResponse } from '@/types/common'

// Admin CRUD
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
