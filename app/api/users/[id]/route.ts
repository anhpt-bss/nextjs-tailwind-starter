import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/withAuth'
import { getUserById } from '@/services/user.service'
import { successResponse, errorResponse } from '@/utils/response'

export const GET = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()

    const user = await getUserById(params.id)
    if (!user) {
      return NextResponse.json(errorResponse('User not found', 'USER_NOT_FOUND', 404).body, {
        status: 404,
      })
    }
    return NextResponse.json(successResponse(user).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
