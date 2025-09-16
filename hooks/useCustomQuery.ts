// hooks/useCustomQuery.ts
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query'

import { handleApiError } from '@/hooks/useApiErrorHandler'

export function useCustomQuery<TData = unknown, TParams = unknown, TError = unknown>(
  queryKey: QueryKey,
  queryFn: (params: TParams) => Promise<TData>,
  params?: TParams,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, [...QueryKey, TParams]>,
    'queryKey' | 'queryFn'
  >
) {
  const safeQueryFn = async () => {
    try {
      return await queryFn(params as TParams)
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  return useQuery<TData, TError, TData, [...QueryKey, TParams]>({
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), params] as [
      ...QueryKey,
      TParams,
    ],
    queryFn: safeQueryFn,
    ...options,
  })
}
