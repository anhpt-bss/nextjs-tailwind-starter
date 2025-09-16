import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from '@/middlewares/auth'
import { getDistinctFoldersByUser } from '@/services/storedFile.service'
import { successResponse, errorResponse } from '@/utils/response'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const userId = (req as any).userId
    if (!userId) {
      return NextResponse.json(errorResponse('Missing userId', 'MISSING_USER_ID', 400).body, {
        status: 400,
      })
    }
    const folders = await getDistinctFoldersByUser(userId)
    return NextResponse.json(successResponse(folders).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
