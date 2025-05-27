import { NextResponse } from 'next/server'

export async function POST(req) {
  const { username, password } = await req.json()
  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD
  if (username === adminUser && password === adminPass) {
    return NextResponse.json({ success: true })
  }
  return new NextResponse('Unauthorized', { status: 401 })
}
