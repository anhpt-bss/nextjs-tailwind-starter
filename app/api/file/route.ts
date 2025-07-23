import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middlewares/withAuth'
import { getFilesByUser } from '@/services/storedFile.service'
import { successResponse, errorResponse } from '@/utils/response'

export const GET = withAuth(async (req: NextRequest) => {
  const userId = (req as any).userId
  const { searchParams } = new URL(req.url)

  const SEARCH_FIELDS = [
    'file_name',
    'file_path',
    'file_extension',
    'content_type',
    'sha',
    'download_url',
    'preview_url',
  ]

  function buildFilters(params: URLSearchParams) {
    const filters: Record<string, any> = {}
    const searchValue = params.get('search')
    if (searchValue) {
      filters.$or = SEARCH_FIELDS.map((field) => ({
        [field]: { $regex: searchValue, $options: 'i' },
      }))
    }

    if (params.get('storage')) filters.storage = params.get('storage')

    if (params.get('folder'))
      filters.file_path = { $regex: `^${params.get('folder')}`, $options: 'i' }

    return filters
  }

  function getSortOption(sortParam: string | null) {
    if (!sortParam) return undefined
    switch (sortParam) {
      case 'az':
        return { file_name: 1 }
      case 'za':
        return { file_name: -1 }
      case 'newest':
        return { created_at: -1 }
      case 'size':
        return { size: -1 }
      default:
        return undefined
    }
  }

  // Extract params
  let filters: Record<string, any> = {}
  let sort: any = undefined
  const searchValue = searchParams.get('search')
  const storageValue = searchParams.get('storage')
  const folderValue = searchParams.get('folder')
  const sortParam = searchParams.get('sort')

  if (searchValue || storageValue || folderValue) {
    filters = buildFilters(searchParams)
  }
  if (sortParam) {
    sort = getSortOption(sortParam)
  }

  // Pagination
  const skip = searchParams.get('skip')
  const limit = searchParams.get('limit')

  // Build options for getFilesByUser
  const options: any = {
    skip,
    limit,
    ...(sort ? { sort } : {}),
  }

  try {
    const files = await getFilesByUser(userId, filters, options)
    return NextResponse.json(successResponse(files).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
