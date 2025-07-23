'use client'

import { Suspense } from 'react'
import View from './view'
import Loading from '@/components/Loading'

export default function GalleryPage() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
      <View />
    </Suspense>
  )
}
