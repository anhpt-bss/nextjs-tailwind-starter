import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middlewares/withAuth'
import { uploadFileToStorage } from '@/services/storedFile.service'
import { uploadFileSchema } from '@/validators/storage.schema'
import { successResponse, errorResponse } from '@/utils/response'
import type { StoredFileResponse } from '@/types/storage'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const userId = (req as any).userId
    const body = await req.json()
    const files = Array.isArray(body) ? body : [body]
    const results: StoredFileResponse[] = []
    const errors: { index: number; error: any }[] = []
    for (let i = 0; i < files.length; i++) {
      const fileData = files[i]
      const parse = uploadFileSchema.safeParse(fileData)
      if (!parse.success) {
        errors.push({ index: i, error: parse.error.errors })
        continue
      }
      try {
        const file = await uploadFileToStorage({ ...fileData, uploaded_by: userId })
        results.push(file)
      } catch (e: any) {
        errors.push({ index: i, error: e.message })
      }
    }
    if (results.length === 0) {
      return NextResponse.json(
        errorResponse('All files failed to upload', 'UPLOAD_FAILED', 400, errors).body,
        { status: 400 }
      )
    }
    return NextResponse.json(successResponse({ success: results, failed: errors }).body, {
      status: 200,
    })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
