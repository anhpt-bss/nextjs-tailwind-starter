// middlewares/withAuth.ts
import { NextRequest, NextResponse } from 'next/server'

import { verifyJwt } from '@/lib/jwt'

export function withAuth(handler: any, checkAuth = true) {
  return async (req: NextRequest, ...args: unknown[]) => {
    if (req.headers.get('secret-key') === process.env.SECRET_KEY) {
      return handler(req, ...args)
    }

    const token = req.cookies.get('token')?.value
    let payload: Record<string, unknown> | null = null
    if (token) {
      payload = verifyJwt(token)
    }

    if (checkAuth) {
      if (!token || !payload) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
      ;(req as NextRequest & { userId?: string; isAdmin?: boolean }).userId =
        payload.userId as string
      ;(req as NextRequest & { userId?: string; isAdmin?: boolean }).isAdmin =
        payload.isAdmin as boolean
    } else {
      if (payload) {
        ;(req as NextRequest & { userId?: string; isAdmin?: boolean }).userId =
          payload.userId as string
        ;(req as NextRequest & { userId?: string; isAdmin?: boolean }).isAdmin =
          payload.isAdmin as boolean
      }
    }
    return handler(req, ...args)
  }
}

export const withUnAuth = (handler: unknown) => withAuth(handler, false)
