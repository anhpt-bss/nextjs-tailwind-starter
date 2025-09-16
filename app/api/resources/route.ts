import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/withAuth'
import resourceModel from '@/models/resource.model'
import { successResponse, errorResponse } from '@/utils/response'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()

    const searchParams = req.nextUrl.searchParams
    const query: Record<string, any> = {}

    // 🔍 Search theo filename hoặc path
    if (searchParams.has('search')) {
      const keyword = searchParams.get('search') || ''
      query.$or = [
        { filename: { $regex: keyword, $options: 'i' } },
        { path: { $regex: keyword, $options: 'i' } },
      ]
    }

    // 🎯 Query chính xác theo field trong model
    const allowedFields = [
      'platform',
      'storage',
      'filename',
      'size',
      'mimetype',
      'path',
      'sha',
      'download_url',
      'preview_url',
      'category',
      'created_by',
      'updated_by',
    ]

    for (const field of allowedFields) {
      if (searchParams.has(field)) {
        const values = searchParams.getAll(field)
        query[field] = values.length > 1 ? { $in: values } : values[0]
      }
    }

    // 🆔 Query theo id (ưu tiên riêng)
    if (searchParams.has('id')) {
      const ids = searchParams.getAll('id')
      query._id = ids.length > 1 ? { $in: ids } : ids[0]
    }

    // ⏳ Pagination
    const skip = parseInt(searchParams.get('skip') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // ↕️ Sort (chỉ 1 field)
    let sort: Record<string, 1 | -1> = { created_at: -1 } // default
    if (searchParams.has('sort')) {
      const [field, order] = (searchParams.get('sort') || '').split(':')
      if (field) {
        sort = { [field]: order === 'asc' ? 1 : -1 }
      }
    }

    const [resources, total] = await Promise.all([
      resourceModel.find(query).sort(sort).skip(skip).limit(limit).lean(),
      resourceModel.countDocuments(query),
    ])

    return NextResponse.json(
      successResponse({
        items: resources,
        total,
      }).body,
      { status: 200 }
    )
  } catch (e: any) {
    return NextResponse.json(
      errorResponse(e.message || 'Failed to fetch resources', 'REQUEST_FAILED', 500).body,
      { status: 500 }
    )
  }
})
