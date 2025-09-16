import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/auth'
import resourceModel from '@/models/resource.model'
import { successResponse, errorResponse } from '@/utils/response'
import { ResourceCreateSchema } from '@/validators/resource.schema'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const userId = (req as any).userId
    const body = await req.json()

    await connectDB()

    // Validate input
    const parsed = ResourceCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.issues).body,
        { status: 400 }
      )
    }

    const payload = { ...parsed.data, created_by: userId, updated_by: userId }

    const result = await resourceModel.create(payload)

    return NextResponse.json(successResponse(result).body, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      errorResponse(e.message || 'Failed to save file', 'REQUEST_FAILED', 500).body,
      { status: 500 }
    )
  }
})
