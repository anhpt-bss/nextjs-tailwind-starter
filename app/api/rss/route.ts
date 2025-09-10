// import { NextResponse } from 'next/server' (removed duplicate)
import { NextResponse } from 'next/server'

import { fetchAllNews } from '@/lib/news'
import type { NewsItemResponse } from '@/types/news'
import { successResponse, errorResponse } from '@/utils/response'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sort = searchParams.get('sort') || 'newest'
    let results: NewsItemResponse[] = await fetchAllNews()

    const parseDate = (d: string | undefined) => (d ? new Date(d).getTime() : 0)

    if (sort === 'a-z') {
      results = results.slice().sort((a, b) => (a.title || '').localeCompare(b.title || '', 'vi'))
    } else if (sort === 'z-a') {
      results = results.slice().sort((a, b) => (b.title || '').localeCompare(a.title || '', 'vi'))
    } else if (sort === 'oldest') {
      results = results.slice().sort((a, b) => parseDate(a.pubDate) - parseDate(b.pubDate))
    } else {
      results = results.slice().sort((a, b) => parseDate(b.pubDate) - parseDate(a.pubDate))
    }

    return NextResponse.json(successResponse(results).body, {
      status: 200,
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json(errorResponse(message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
}
