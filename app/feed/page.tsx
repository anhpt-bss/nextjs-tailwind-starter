'use client'

import { InfiniteData } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { CardFooter, CardDescription, CardAction } from '@/components/ui/card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useLazyBlogs } from '@/requests/useBlog'
import { BlogResponse } from '@/types/blog'
import { PaginatedResponse } from '@/types/common'
import { CommonParam } from '@/types/common'
import { getResourceUrl } from '@/utils/helper'

export default function BlogPage() {
  const [filterParams, setFilterParams] = React.useState<CommonParam>({ skip: 0, limit: 5 })
  const {
    data: lazyBlogsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingFiles,
    isError,
    error,
  } = useLazyBlogs(filterParams, { enabled: true })

  // --- Infinite Scroll Logic ---
  const infiniteBlogs = lazyBlogsData as InfiniteData<PaginatedResponse<BlogResponse>> | undefined
  const allBlogs: BlogResponse[] = infiniteBlogs?.pages?.flatMap((page) => page.items) || []

  const totalItems = infiniteBlogs?.pages[infiniteBlogs.pages.length - 1]?.total ?? 0

  const observerElem = React.useRef<HTMLDivElement | null>(null)

  const handleObserver = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  React.useEffect(() => {
    const element = observerElem.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the element is visible
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [handleObserver, filterParams]) // Re-run effect if filters change to re-observe

  // Render
  if (loadingFiles) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loading text="Loading blog..." />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Empty title="An error occurred" description={error?.message || 'Unable to load blog'} />
      </div>
    )
  }
  if (!allBlogs.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Empty
          title="No posts yet"
          description="Please come back later or try refreshing the page."
        />
      </div>
    )
  }
  return (
    <section className="container mx-auto px-2 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allBlogs?.map((blog) => (
          <Card
            key={blog?._id}
            className="bg-background dark:bg-card group py-0 transition-shadow hover:shadow-lg"
          >
            <Link href={`/blog/${blog?.slug}`} className="block focus:outline-none" tabIndex={0}>
              {blog?.banner_resource && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={getResourceUrl(blog?.banner_resource?.path)}
                    alt={blog?.banner_resource?.filename}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={false}
                  />
                </div>
              )}
              <CardHeader className="p-2">
                <CardTitle className="line-clamp-2 text-lg font-bold">{blog?.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <CardDescription className="mb-2 line-clamp-3">{blog?.summary}</CardDescription>
              </CardContent>
              <CardFooter className="p-2">
                <CardAction>
                  <div className="my-2 text-right text-xs text-gray-400 dark:text-gray-500">
                    {dayjs(blog?.created_time).format('DD/MM/YYYY')}
                  </div>
                </CardAction>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={observerElem} className="h-1 bg-transparent"></div>
      {isFetchingNextPage && <Loading text="Loading more..." />}
      {!hasNextPage && allBlogs.length > 0 && (
        <div className="p-4 text-center text-gray-500">You have reached the end of the list.</div>
      )}
    </section>
  )
}
