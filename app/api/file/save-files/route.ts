import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middlewares/withAuth'
import { storedFileSchema } from '@/validators/storage.schema'
import { StoredFileResponse } from '@/types/storage'
import { successResponse, errorResponse } from '@/utils/response'
import StoredFile from '@/models/storedFile.model'
import { connectDB } from '@/lib/db'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const userId = (req as any).userId
    const body = await req.json()
    const files = Array.isArray(body) ? body : [body]
    const errors: { index: number; error: any }[] = []
    await connectDB()

    // Validate all files first
    const validFiles = files
      .map((fileData, i) => {
        const parse = storedFileSchema.safeParse(fileData)
        if (!parse.success) {
          errors.push({ index: i, error: parse.error.errors })
          return null
        }
        return { ...fileData, uploaded_by: userId }
      })
      .filter(Boolean)

    let results: StoredFileResponse[] = []
    if (validFiles.length > 0) {
      try {
        results = await StoredFile.insertMany(validFiles, { ordered: false })
      } catch (e: any) {
        if (e && Array.isArray(e.writeErrors)) {
          e.writeErrors.forEach((err: any) => {
            errors.push({ index: err.index, error: err.errmsg || err.message })
          })

          results = e.result?.insertedDocs || []
        } else {
          throw e
        }
      }
    }
    if (results.length === 0) {
      return NextResponse.json(
        errorResponse('All files failed to save', 'SAVE_FAILED', 400, errors).body,
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
