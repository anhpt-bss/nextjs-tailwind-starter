import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/validators/auth.schema'
import { login } from '@/services/auth.service'
import { connectDB } from '@/lib/db'
import { successResponse, errorResponse } from '@/utils/response'

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.errors).body,
      { status: 400 }
    )
  }
  try {
    const { user, token } = await login(parsed.data)
    const res = NextResponse.json(successResponse({ user, token }).body, { status: 200 })

    return res
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
}
