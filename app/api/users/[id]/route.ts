import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/withAuth'
import { getUserById, updateUserById, deleteUserById } from '@/services/user.service'
import { successResponse, errorResponse } from '@/utils/response'
import { userCrudSchema } from '@/validators/user.schema'

export const GET = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const { id } = await params
    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json(errorResponse('Record not found', 'RECORD_NOT_FOUND', 404).body, {
        status: 404,
      })
    }
    return NextResponse.json(successResponse(user).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const parsed = userCrudSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.issues).body,
        { status: 400 }
      )
    }

    const updatedUser = await updateUserById(id, body)
    if (!updatedUser) {
      return NextResponse.json(errorResponse('Record not found', 'RECORD_NOT_FOUND', 404).body, {
        status: 404,
      })
    }
    return NextResponse.json(successResponse(updatedUser).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const { id } = await params
    const deletedUser = await deleteUserById(id)
    if (!deletedUser) {
      return NextResponse.json(errorResponse('Record not found', 'RECORD_NOT_FOUND', 404).body, {
        status: 404,
      })
    }
    return NextResponse.json(successResponse(deletedUser).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
