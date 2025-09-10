// middlewares/withAuth.ts
import { NextRequest, NextResponse } from 'next/server'

import { verifyJwt } from '@/lib/jwt'

export function withAuth(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    if (req.headers.get('secret-key') === process.env.SECRET_KEY) {
      // Skip authentication for internal API requests
      return handler(req, ...args)
    }

    const token = req.cookies.get('token')?.value
    const payload = token && verifyJwt(token)

    if (!token || !payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Assign userId to request for further use in the handler
    ;(req as any).userId = (payload as any).userId
    ;(req as any).isAdmin = (payload as any).isAdmin
    return handler(req, ...args)
  }
}
