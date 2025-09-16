import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/auth'
import { getAllUsers, createUser } from '@/services/user.service'
import { successResponse, errorResponse } from '@/utils/response'
import { userCrudSchema } from '@/validators/user.schema'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const users = await getAllUsers()
    return NextResponse.json(successResponse(users).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const POST = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const body = await req.json()

    const parsed = userCrudSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.format()).body,
        { status: 400 }
      )
    }

    const user = await createUser(body)
    return NextResponse.json(successResponse(user).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
