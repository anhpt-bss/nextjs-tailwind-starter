import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middlewares/withAuth'
import { getFileById, updateFileMetadata, deleteFile } from '@/services/storedFile.service'
import { storedFileSchema } from '@/validators/storage.schema'
import { successResponse, errorResponse } from '@/utils/response'

export const GET = withAuth(async (req: NextRequest, context: any) => {
  const userId = (req as any).userId
  const params = await context.params
  const { id } = await params
  try {
    const file = await getFileById(id, userId)
    if (!file)
      return NextResponse.json(errorResponse('Not found', 'NOT_FOUND', 404).body, { status: 404 })
    return NextResponse.json(successResponse(file).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest, context: any) => {
  const userId = (req as any).userId
  const params = await context.params
  const { id } = await params
  const body = await req.json()
  const parse = storedFileSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json(
      errorResponse('Invalid data', 'INVALID_DATA', 400, parse.error.errors).body,
      { status: 400 }
    )
  }
  try {
    const file = await updateFileMetadata(id, userId, body.metadata)
    if (!file)
      return NextResponse.json(errorResponse('Not found or no permission', 'NOT_FOUND', 404).body, {
        status: 404,
      })
    return NextResponse.json(successResponse(file).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, context: any) => {
  const userId = (req as any).userId
  const params = await context.params
  const { id } = await params
  try {
    const result = await deleteFile(id, userId)
    if (!result)
      return NextResponse.json(errorResponse('Not found or no permission', 'NOT_FOUND', 404).body, {
        status: 404,
      })
    return NextResponse.json(successResponse(true).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
