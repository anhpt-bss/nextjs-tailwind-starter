// lib/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'secret'

export function signJwt(payload: object, expiresIn = '30d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
