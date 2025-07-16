import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/services/user.service'
import { withAuth } from '@/middlewares/withAuth'
import { connectDB } from '@/lib/db'
import { successResponse, errorResponse } from '@/utils/response'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const users = await getAllUsers()
    return NextResponse.json(successResponse(users).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
