import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  try {
    const res = await fetch(url)
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 })

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()
    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
