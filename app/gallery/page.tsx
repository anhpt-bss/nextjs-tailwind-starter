// app/gallery/page.tsx

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

import Loading from '@/components/Loading'
import { cacheServerFn } from '@/lib/cache'
import { getUserIdFromCookie } from '@/lib/cookie'
import { getQueryClient } from '@/lib/react-query'
import { getStoragesByUser } from '@/services/storage.service'
import { getDistinctFoldersByUser } from '@/services/storedFile.service'

import View from './view'

export default async function GalleryPage() {
  const cookieStore = await cookies()
  const queryClient = getQueryClient()
  const userId = await getUserIdFromCookie(cookieStore)

  if (userId) {
    const storages = await cacheServerFn(() => getStoragesByUser(userId), ['storages'], [userId])
    const folders = await cacheServerFn(
      () => getDistinctFoldersByUser(userId),
      ['folders'],
      [userId]
    )

    queryClient.setQueryData(['storages'], JSON.parse(JSON.stringify(storages)))
    queryClient.setQueryData(['folders'], JSON.parse(JSON.stringify(folders)))
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loading text="Loading..." />}>
        <View />
      </Suspense>
    </HydrationBoundary>
  )
}
