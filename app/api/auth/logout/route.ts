import { NextRequest, NextResponse } from 'next/server'
import { successResponse } from '@/utils/response'

// route.ts for logout endpoint
export async function POST(req: NextRequest) {
  const res = NextResponse.json(successResponse(null, 'Logged out').body, { status: 200 })
  return res
}
