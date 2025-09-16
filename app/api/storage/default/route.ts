import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from '@/middlewares/auth'
import { createStorage, getDefaultStorages } from '@/services/storage.service'
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

export const GET = withAuth(async () => {
  try {
    const storages = await getDefaultStorages()
    return NextResponse.json(successResponse(storages).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
