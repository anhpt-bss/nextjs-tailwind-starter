import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { register } from '@/services/auth.service'
import { successResponse, errorResponse } from '@/utils/response'
import { registerSchema } from '@/validators/auth.schema'

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.issues).body,
      { status: 400 }
    )
  }
  try {
    const { user } = await register(parsed.data)
    const res = NextResponse.json(successResponse({ user }).body, { status: 200 })

    return res
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
}
