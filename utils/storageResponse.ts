import { NextResponse } from 'next/server'

export function success(data: any) {
  return NextResponse.json({ success: true, data })
}

export function error(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}
