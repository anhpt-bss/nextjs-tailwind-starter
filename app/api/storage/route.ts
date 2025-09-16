import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from '@/middlewares/withAuth'
import { createStorage, getStoragesByUser } from '@/services/storage.service'
import { successResponse, errorResponse } from '@/utils/response'
import { storageSchema } from '@/validators/storage.schema'

export const POST = withAuth(async (req: NextRequest) => {
  const userId = (req as any).userId
  const body = await req.json()
  const parsed = storageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.issues).body,
      { status: 400 }
    )
  }
  try {
    const storage = await createStorage({ ...body, user: userId })
    return NextResponse.json(successResponse(storage).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const GET = withAuth(async (req: NextRequest) => {
  const userId = (req as any).userId
  if (!userId) {
    return NextResponse.json(errorResponse('Missing userId', 'MISSING_USER_ID', 400).body, {
      status: 400,
    })
  }
  try {
    const storages = await getStoragesByUser(userId)
    return NextResponse.json(successResponse(storages).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
