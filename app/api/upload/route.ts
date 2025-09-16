import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/withAuth'
import { uploadResourceFile, validateFiles } from '@/services/resource.service'
import type { ResourceResponse } from '@/types/resource'
import { successResponse, errorResponse } from '@/utils/response'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const formData = await req.formData()

    const files: File[] = []
    for (const [, value] of formData.entries()) {
      if (value instanceof File) files.push(value)
    }

    const { valid, error } = validateFiles(files)
    if (!valid && error) {
      return NextResponse.json(error.body, { status: error.status })
    }

    const results: ResourceResponse[] = await Promise.all(
      files.map((file) => uploadResourceFile(file))
    )

    return NextResponse.json(successResponse(results).body, { status: 201 })
  } catch (e: any) {
    console.error('Upload API error:', e)
    const status = e.status || 500
    return NextResponse.json(
      errorResponse(e.message || 'Upload failed', 'REQUEST_FAILED', status).body,
      { status }
    )
  }
})
