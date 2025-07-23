// lib/cookie.ts
import nookies, { parseCookies, setCookie, destroyCookie } from 'nookies'
import type { NextPageContext } from 'next'
import type { NextResponse } from 'next/server'

// Check if the context is a NextResponse (server-side)
function isServerRes(ctx: any): ctx is NextResponse {
  return ctx && typeof ctx.cookies?.set === 'function'
}

// Set cookie
export function setUniversalCookie(
  key: string,
  value: string,
  options: any = {},
  ctx?: NextPageContext | NextResponse | null
) {
  const defaultOptions = {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    // expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
  }

  const finalOptions = { ...defaultOptions, ...options }

  if (isServerRes(ctx)) {
    ctx.cookies.set(key, value, finalOptions)
  } else {
    setCookie(null, key, value, finalOptions)
  }
}

// Remove cookie
export function removeUniversalCookie(
  key: string,
  options: any = {},
  ctx?: NextPageContext | NextResponse | null
) {
  if (isServerRes(ctx)) {
    ctx.cookies.set(key, '', { maxAge: 0, path: '/', ...options })
  } else {
    destroyCookie(null, key, { path: '/', ...options })
  }
}

// Get cookie
export function getUniversalCookie(
  key: string,
  ctx?: NextPageContext | { cookies?: { get: (k: string) => { value: string } | undefined } }
): string | undefined {
  // Next.js API Route (NextRequest/NextResponse)
  if (ctx && typeof (ctx as any).cookies?.get === 'function') {
    return (ctx as any).cookies.get(key)?.value
  }
  // NextPageContext
  const cookies = parseCookies(ctx as NextPageContext)
  return cookies[key]
}

// Clear all cookies (client-side)
export function clearAllCookiesClient() {
  const allCookies = parseCookies()
  Object.keys(allCookies).forEach((cookieName) => {
    destroyCookie(null, cookieName, { path: '/' })
  })
}
