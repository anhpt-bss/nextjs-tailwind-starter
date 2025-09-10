'use client'

import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { useBlogsBySlug } from '@/requests/useBlog'
import { getResourceUrl } from '@/utils/helper'

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const { data: blog, isLoading, isError, error } = useBlogsBySlug(slug, { enabled: true })

  const errorMessage =
    typeof error === 'object' && error && 'message' in error
      ? String((error as Record<string, unknown>).message)
      : error?.toString?.() || 'Unable to load blog details'

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loading text="Loading post details..." />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Empty title="An error occurred" description={errorMessage} />
      </div>
    )
  }
  if (!blog) return notFound()

  return (
    <article className="container mx-auto px-2 py-8">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            ← Back
          </Link>
        </div>
        {blog?.banner_resource && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={getResourceUrl(blog?.banner_resource?.path)}
              alt={blog?.banner_resource?.filename}
              fill
              className="object-cover"
              sizes="100vw"
              priority={true}
            />
          </div>
        )}
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          {blog?.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>{`${blog?.created_by} • ${dayjs(blog?.created_time).format('DD/MM/YYYY')}`}</span>
        </div>
        <div className="text-muted-foreground text-base">{blog?.summary}</div>
        <hr className="my-2 border-gray-200 dark:border-gray-700" />
      </header>
      <section className="prose prose-neutral dark:prose-invert mb-8 max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog?.content || '' }} />
      </section>
    </article>
  )
}
