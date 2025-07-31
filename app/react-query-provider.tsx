'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { useState, useEffect, ReactNode } from 'react'
import { getQueryClient } from '@/lib/react-query'

interface ReactQueryProviderProps {
  children: ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [isRestored, setIsRestored] = useState(false)
  const [queryClient] = useState(() => getQueryClient())

  useEffect(() => {
    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
    })

    const [, restorePromise] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      buster: 'v1', // Versioning to bust cache when needed
    })

    restorePromise
      .then(() => setIsRestored(true))
      .catch((err) => {
        console.error('Failed to restore cache:', err)
        setIsRestored(true)
      })
  }, [queryClient])

  if (!isRestored) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
