import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/lib/db'
import { withAuth } from '@/middlewares/withAuth'
import { getBlogById, updateBlogById, deleteBlogById, getBlogBySlug } from '@/services/blog.service'
import { uploadResourceFile } from '@/services/resource.service'
import { successResponse, errorResponse } from '@/utils/response'
import { blogCrudSchema } from '@/validators/blog.schema'

export const GET = async (req: NextRequest) => {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    let blog

    if (id) {
      blog = await getBlogById(id)
    } else if (slug) {
      blog = await getBlogBySlug(slug)
    }

    if (!blog) {
      return NextResponse.json(
        errorResponse('Không tìm thấy bản ghi', 'RECORD_NOT_FOUND', 404).body,
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(blog).body, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, { status: 500 })
  }
}

export const PUT = withAuth(
  async (req: NextRequest, { params }: { params: { detail: string } }) => {
    try {
      await connectDB()
      const { detail } = await params
      const id = detail

      if (req.headers.get('content-type')?.includes('multipart/form-data')) {
        const formData = await req.formData()
        const title = formData.get('title') as string
        const summary = formData.get('summary') as string
        const content = formData.get('content') as string
        const banner = formData.get('banner') as File | string

        const parsed = blogCrudSchema.safeParse({ title, summary, content, banner })
        if (!parsed.success) {
          return NextResponse.json(
            errorResponse('Dữ liệu không hợp lệ', 'INVALID_DATA', 400, parsed.error.format()).body,
            { status: 400 }
          )
        }

        let bannerId = ''
        if (banner && banner instanceof File) {
          const resource = await uploadResourceFile(banner)
          bannerId = resource._id?.toString() || ''
        } else if (banner && typeof banner === 'string') {
          bannerId = banner
        }

        const updatedBlog = await updateBlogById(id, {
          title,
          summary,
          content,
          banner: bannerId ? new mongoose.Types.ObjectId(bannerId) : undefined,
        })
        if (!updatedBlog) {
          return NextResponse.json(
            errorResponse('Không tìm thấy bản ghi', 'RECORD_NOT_FOUND', 404).body,
            {
              status: 404,
            }
          )
        }
        return NextResponse.json(successResponse(updatedBlog).body, { status: 200 })
      } else {
        const body = await req.json()
        const updatedBlog = await updateBlogById(id, body)
        if (!updatedBlog) {
          return NextResponse.json(
            errorResponse('Không tìm thấy bản ghi', 'RECORD_NOT_FOUND', 404).body,
            {
              status: 404,
            }
          )
        }
        return NextResponse.json(successResponse(updatedBlog).body, { status: 200 })
      }
    } catch (e: any) {
      return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, {
        status: 500,
      })
    }
  }
)

export const DELETE = withAuth(
  async (req: NextRequest, { params }: { params: { detail: string } }) => {
    try {
      await connectDB()
      const { detail } = await params
      const id = detail
      const deletedBlog = await deleteBlogById(id)
      if (!deletedBlog) {
        return NextResponse.json(
          errorResponse('Không tìm thấy bản ghi', 'RECORD_NOT_FOUND', 404).body,
          {
            status: 404,
          }
        )
      }
      return NextResponse.json(successResponse(deletedBlog).body, { status: 200 })
    } catch (e: any) {
      return NextResponse.json(errorResponse(e.message, 'REQUEST_FAILED', 500).body, {
        status: 500,
      })
    }
  }
)
