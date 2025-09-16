import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from '@/middlewares/withAuth'
import { deleteFile } from '@/services/storedFile.service'
import { successResponse, errorResponse } from '@/utils/response'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const POST = withAuth(async (req: NextRequest) => {
  const userId = (req as any).userId
  try {
    const { ids } = await req.json()
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(errorResponse('No file ids provided', 'INVALID_DATA', 400).body, {
        status: 400,
      })
    }

    const deleted: any[] = []
    const failed: any[] = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      try {
        const result = await deleteFile(id, userId)
        if (result) {
          deleted.push({ id, result })
        } else {
          failed.push({ id, result })
        }
      } catch (e: any) {
        failed.push({ id, error: e.message })
      }

      if (i < ids.length - 1) await delay(200)
    }

    if (deleted.length === 0) {
      return NextResponse.json(
        errorResponse('All files failed to delete', 'DELETE_FAILED', 400, failed).body,
        { status: 400 }
      )
    }
    return NextResponse.json(successResponse({ success: deleted, failed }).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
