// hooks/useCustomInfiniteQuery.ts
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type QueryKey,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { handleApiError } from '@/hooks/useApiErrorHandler'

/**
 * Custom infinite query hook for paginated/infinite data fetching
 *
 * @template TQueryFnData - Raw page data returned from queryFn (1 page)
 * @template TError - Error type
 * @template TData - The type of the aggregated data in the cache (defaults to TQueryFnData)
 * @template TQueryKey - Query key
 * @template TPageParam - Type of the pageParam
 */
export function useCustomInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  queryKey: TQueryKey,
  queryFn: (context: { pageParam?: TPageParam }) => Promise<TQueryFnData>,
  options: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    'queryKey' | 'queryFn'
  > & {
    getNextPageParam: UseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >['getNextPageParam']
  }
): UseInfiniteQueryResult<TData, TError> {
  return useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      try {
        return await queryFn({ pageParam: pageParam as TPageParam })
      } catch (err) {
        handleApiError(err)
        throw err
      }
    },
    ...options,
  })
}
