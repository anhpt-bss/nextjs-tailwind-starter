// hooks/useCustomQuery.ts
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query'
import { handleApiError } from '@/hooks/useApiErrorHandler'

export function useCustomQuery<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  const safeQueryFn = async () => {
    try {
      return await queryFn()
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  return useQuery<TData, TError, TData, QueryKey>({
    queryKey,
    queryFn: safeQueryFn,
    ...options,
  })
}
