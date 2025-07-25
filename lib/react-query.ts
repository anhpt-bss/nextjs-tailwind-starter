// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

let client: QueryClient | null = null

// Recommended default query options for performance & UX balance
const defaultQueryOptions = {
  // Time in ms before cached data is considered "stale"
  staleTime: 1000 * 60 * 5, // 5 minute

  // Time in ms to keep inactive cache data before garbage collection
  cacheTime: 1000 * 60 * 30, // 30 minutes

  // Retry failed queries up to 1 time (can be false to disable)
  retry: 1,

  // Avoid refetching data automatically when window/tab gains focus
  refetchOnWindowFocus: false,

  // Refetch automatically when network reconnects
  refetchOnReconnect: true,

  // Don't refetch when the component remounts
  refetchOnMount: false,

  // Keep previous data when query key changes (for pagination, tab switching, etc.)
  keepPreviousData: true,

  // Optional: Throw errors in suspense boundaries (useful if you're using <Suspense>)
  // suspense: true,

  // Optional: Return the last known result immediately while refetching in background
  // placeholderData: keepPreviousData: true already helps with this, but you can also customize this
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server-side (per-request client)
    return new QueryClient({
      defaultOptions: {
        queries: {
          ...defaultQueryOptions,
        },
      },
    })
  }

  // Client-side (singleton client)
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          ...defaultQueryOptions,
        },
      },
    })
  }

  return client
}
