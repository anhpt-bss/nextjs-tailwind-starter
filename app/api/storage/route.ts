import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middlewares/withAuth'
import { createStorage, getStoragesByUser } from '@/services/storage.service'
import { storageSchema } from '@/validators/storage.schema'
import { successResponse, errorResponse } from '@/utils/response'

export const POST = withAuth(async (req: NextRequest) => {
  const userId = (req as any).userId
  const body = await req.json()
  const parse = storageSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json(
      errorResponse('Invalid data', 'INVALID_DATA', 400, parse.error.errors).body,
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
  try {
    const storages = await getStoragesByUser(userId)
    return NextResponse.json(successResponse(storages).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
