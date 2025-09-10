/* eslint-disable @next/next/no-img-element */
'use client'

import { CalendarDaysIcon, GlobeAltIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useRef, useState, useEffect, useCallback } from 'react'

import Loading from '@/components/Loading'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import SearchInput from '@/components/SearchInput'
dayjs.extend(relativeTime)
import { RSS_SOURCES } from '@/lib/news'
import { useNews } from '@/requests/useNews'
import type { NewsItemResponse } from '@/types/news'
import { normalizeText } from '@/utils/helper'

export default function NewsPage() {
  const parentRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, refetch, isFetching } = useNews?.({}) ?? {}

  // Responsive: 1 col (mobile), 2 col (sm), 3 col (lg)
  const getColCount = () => {
    if (typeof window === 'undefined') return 1
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 640) return 2
    return 1
  }

  const [colCount, setColCount] = useState(getColCount())

  useEffect(() => {
    const handleResize = () => setColCount(getColCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filter state
  const [filtered, setFiltered] = useState<NewsItemResponse[] | undefined>(undefined)
  const [searchNorm, setSearchNorm] = useState('')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [showCategory, setShowCategory] = useState(false)

  useEffect(() => {
    if (!data) return setFiltered([])
    setFiltered(
      data.filter((item) => {
        if (selectedSource !== 'all' && item.source !== selectedSource) return false
        if (!searchNorm) return true
        const fields = [
          item.title,
          item.description,
          item.source,
          item.link,
          item.url,
          item.pubDate ? new Date(item.pubDate).toLocaleString('vi-VN') : '',
        ].join(' ')
        return normalizeText(fields).includes(searchNorm)
      })
    )
  }, [data, searchNorm, selectedSource])

  const handleSearch = useCallback((norm: string) => setSearchNorm(norm), [])

  // Calculate row count based on colCount
  // Each card has a fixed height, so we can calculate the number of rows
  // Responsive: 1 col (mobile), 2 col (sm), 3 col (lg)
  const CARD_HEIGHT = 500
  const rowCount = filtered ? Math.ceil(filtered.length / colCount) : 0
  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => CARD_HEIGHT,
    overscan: 6,
  })

  return (
    <div className="w-full">
      <div className="sticky top-0 z-20 mb-4 px-2 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <SearchInput onSearch={handleSearch} placeholder="Search news..." />
          <button
            type="button"
            onClick={() => refetch?.()}
            className="flex h-10 w-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white shadow transition hover:bg-blue-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-blue-900"
            title="Refetch news"
            disabled={isFetching}
          >
            <ArrowPathIcon
              className={`h-6 w-6 min-w-6 text-blue-500 dark:text-blue-400 ${isFetching && !isLoading ? 'animate-spin' : ''}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setShowCategory((v) => !v)}
            className="flex h-10 w-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white shadow transition hover:bg-blue-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-blue-900"
            title={showCategory ? 'Hide categories' : 'Show categories'}
          >
            {showCategory ? (
              <GlobeAltIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            ) : (
              <GlobeAltIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            )}
          </button>
        </div>
        {/* Source filter */}
        {showCategory && (
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-1">
            <button
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition ${selectedSource === 'all' ? 'border-blue-500 bg-blue-500 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-blue-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-blue-900'}`}
              onClick={() => setSelectedSource('all')}
            >
              <GlobeAltIcon className="h-4 w-4" /> All channels
            </button>
            {RSS_SOURCES.map((src) => (
              <button
                key={src.name}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition ${selectedSource === src.name ? 'border-blue-500 bg-blue-500 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-blue-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-blue-900'}`}
                onClick={() => setSelectedSource(src.name)}
              >
                <GlobeAltIcon className="h-4 w-4" /> {src.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Vietnam News</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{filtered?.length} posts</p>
      </div>

      {isLoading && <Loading />}

      <div
        ref={parentRef}
        style={{
          position: 'relative',
          minHeight: CARD_HEIGHT,
          height: rowCount === 0 ? undefined : virtualizer.getTotalSize(),
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: virtualizer.getTotalSize(),
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const rowCards: React.ReactNode[] = []
            for (let col = 0; col < colCount; col++) {
              const idx = virtualRow.index * colCount + col
              if (!filtered || idx >= filtered.length) break
              const item = filtered[idx]
              rowCards.push(
                <div
                  key={item.link + idx}
                  className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-gray-50 shadow transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  style={{ height: CARD_HEIGHT - 8 }}
                >
                  <div className="flex h-full flex-col px-3 py-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 line-clamp-3 h-[70px] text-base font-semibold text-blue-700 hover:underline dark:text-blue-400"
                      title={item.title}
                    >
                      {item.title}
                    </a>

                    {item.description && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.title}
                        className="no-scrollbar mb-2 flex-1 overflow-auto"
                      >
                        {(() => {
                          const imgMatch =
                            item?.description &&
                            item?.description.match(/<img[^>]+src=["']([^"']+)["']/)
                          if (!imgMatch) return null
                          const imgSrc = imgMatch[1]
                          return <SmartImage src={imgSrc} alt={item.title} className="mb-2" />
                        })()}

                        <div
                          className="text-sm text-neutral-700 dark:text-neutral-300"
                          dangerouslySetInnerHTML={{
                            __html: item.description
                              .replace(
                                /<a\b[^>]*>(.*?)<\/a>/gi,
                                '<div class="pointer-events-none select-none">$1</div>'
                              )
                              .replace(/<img[^>]+>/gi, ''),
                          }}
                        />
                      </a>
                    )}

                    <div className="mt-auto flex min-h-[20px] items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span
                        className="flex items-center gap-1"
                        title={dayjs(item.pubDate).format('DD/MM/YYYY HH:mm:ss')}
                      >
                        <CalendarDaysIcon className="h-4 w-4" />
                        {dayjs(item.pubDate).fromNow()}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 hover:bg-blue-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-blue-900"
                      >
                        <GlobeAltIcon className="h-4 w-4" />
                        {item.source}
                      </a>
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <div
                key={virtualRow.index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                  gap: 8,
                  position: 'absolute',
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  height: CARD_HEIGHT - 8,
                }}
              >
                {rowCards}
              </div>
            )
          })}
        </div>
      </div>

      <ScrollTopAndComment />
    </div>
  )
}

interface SmartImageProps {
  src: string
  alt?: string
  className?: string
}

function SmartImage({ src, alt = '', className }: SmartImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  const handleError = () => {
    if (!imgSrc.startsWith('/api/image-proxy')) {
      setImgSrc(`/api/image-proxy?url=${encodeURIComponent(src)}`)
    }
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        className="h-full w-full rounded object-cover"
        onError={handleError}
        loading="lazy"
      />
    </div>
  )
}
