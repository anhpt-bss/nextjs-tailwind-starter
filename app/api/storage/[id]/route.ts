import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from '@/middlewares/auth'
import { getStorageById, updateStorage, deleteStorage } from '@/services/storage.service'
import { successResponse, errorResponse } from '@/utils/response'
import { storageSchema } from '@/validators/storage.schema'

export const GET = withAuth(async (req: NextRequest, { params }: any) => {
  const userId = (req as any).userId
  const { id } = await params
  try {
    const storage = await getStorageById(id, userId)
    if (!storage)
      return NextResponse.json(errorResponse('Not found', 'NOT_FOUND', 404).body, { status: 404 })
    return NextResponse.json(successResponse(storage).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest, { params }: any) => {
  const userId = (req as any).userId
  const { id } = await params
  const body = await req.json()
  const parsed = storageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.issues).body,
      { status: 400 }
    )
  }
  try {
    const storage = await updateStorage(id, userId, body)
    if (!storage)
      return NextResponse.json(errorResponse('Not found', 'NOT_FOUND', 404).body, { status: 404 })
    return NextResponse.json(successResponse(storage).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, { params }: any) => {
  const userId = (req as any).userId
  const { id } = await params
  try {
    const result = await deleteStorage(id, userId)
    if (!result)
      return NextResponse.json(errorResponse('Not found', 'NOT_FOUND', 404).body, { status: 404 })
    return NextResponse.json(successResponse(true).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
