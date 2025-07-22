import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/services/user.service'
import { withAuth } from '@/middlewares/withAuth'
import { connectDB } from '@/lib/db'
import UserModel from '@/models/user.model'
import { successResponse, errorResponse } from '@/utils/response'
import { RegisterPayload } from '@/types/user.ts'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const userId = (req as any).userId
    if (!userId) {
      return NextResponse.json(errorResponse('Unauthorized', 'UNAUTHORIZED', 401).body, {
        status: 401,
      })
    }
    const user = await getUserById(userId)
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

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const userId = (req as any).userId
    if (!userId) {
      return NextResponse.json(errorResponse('Unauthorized', 'UNAUTHORIZED', 401).body, {
        status: 401,
      })
    }
    const body = await req.json()
    const updateFields: RegisterPayload = {
      name: body.name,
      email: body.email,
      phone_number: body.phone_number,
      address: body.address,
      gender: body.gender,
      birthday: body.birthday,
    }
    const user = await UserModel.findByIdAndUpdate(userId, updateFields, { new: true }).lean()
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
