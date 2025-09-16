import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/withAuth'
import { getAllBlogs, createBlog } from '@/services/blog.service'
import { uploadResourceFile, validateFiles } from '@/services/resource.service'
import { successResponse, errorResponse } from '@/utils/response'
import { blogCrudSchema } from '@/validators/blog.schema'

export const GET = async (req: NextRequest) => {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const sort = searchParams.get('sort') || undefined
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : undefined
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined
    const search = searchParams.get('search') || undefined

    const blogs = await getAllBlogs({ sort, skip, limit, search })
    return NextResponse.json(successResponse(blogs).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const userId = (await (req as any).userId) as string

    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await req.formData()
      const title = formData.get('title') as string
      const summary = formData.get('summary') as string
      const content = formData.get('content') as string
      const banner = formData.get('banner') as File | string

      const parsed = blogCrudSchema.safeParse({ title, summary, content, banner })
      if (!parsed.success) {
        return NextResponse.json(
          errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.issues).body,
          { status: 400 }
        )
      }

      let bannerId = ''
      if (banner && banner instanceof File) {
        const { valid, error } = validateFiles([banner])
        if (!valid && error) {
          return NextResponse.json(error.body, { status: error.status })
        }

        const resource = await uploadResourceFile(banner)
        bannerId = resource._id.toString()
      } else if (banner && typeof banner === 'string') {
        bannerId = banner
      }

      const blog = await createBlog({
        title,
        summary,
        content,
        banner: bannerId ? new mongoose.Types.ObjectId(bannerId) : undefined,
        created_by: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      })
      return NextResponse.json(successResponse(blog).body, { status: 200 })
    } else {
      const body = await req.json()

      const parsed = blogCrudSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          errorResponse('Invalid data', 'INVALID_DATA', 400, parsed.error.issues).body,
          { status: 400 }
        )
      }

      const bodyReq = {
        ...body,
        created_by: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      }
      const blog = await createBlog(bodyReq)
      return NextResponse.json(successResponse(blog).body, { status: 200 })
    }
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
})
