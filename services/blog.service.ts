// services/blog.service.ts

import mongoose, { PipelineStage } from 'mongoose'

import BlogModel from '@/models/blog.model'
import { IBlog } from '@/models/blog.model'
import userModel, { IUser } from '@/models/user.model'
import { CommonParam } from '@/types/common'

export async function getAllBlogs(
  options: CommonParam = {},
  userId?: string
): Promise<{ items: IBlog[]; total: number }> {
  const { search, sort = 'newest', skip, limit } = options

  // Build query
  const query: Record<string, unknown> = {}
  if (search) {
    query.$text = { $search: search }
  }

  if (userId) {
    const user = await userModel.findById(userId).lean<IUser>().exec()

    if (user && !user.is_admin) {
      query.is_published = true
    }
  } else {
    query.is_published = true
  }

  // Count total
  const total = await BlogModel.countDocuments(query)

  // Build sort object
  const sortObj: Record<string, 1 | -1> = (() => {
    switch (sort) {
      case 'newest':
        return { createdAt: -1 }
      case 'oldest':
        return { createdAt: 1 }
      default:
        return { [sort]: -1 }
    }
  })()

  // Aggregation pipeline
  const pipeline: PipelineStage[] = [
    { $match: query },
    {
      $lookup: {
        from: 'resources',
        localField: 'banner',
        foreignField: '_id',
        as: 'banner_resource',
      },
    },
    {
      $addFields: {
        banner_resource: { $arrayElemAt: ['$banner_resource', 0] },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'created_by',
        foreignField: '_id',
        as: 'created_by_user',
      },
    },
    {
      $addFields: {
        created_by_user: { $arrayElemAt: ['$created_by_user', 0] },
      },
    },
    { $sort: sortObj },
  ]

  if (skip !== undefined && limit !== undefined) {
    pipeline.push({ $skip: skip }, { $limit: limit })
  }

  const blogs = await BlogModel.aggregate(pipeline)

  return { items: blogs, total }
}

export async function getBlogById(id: string): Promise<IBlog | null> {
  const result = await BlogModel.aggregate([
    { $match: { _id: typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id } },
    {
      $lookup: {
        from: 'resources',
        localField: 'banner',
        foreignField: '_id',
        as: 'banner_resource',
      },
    },
    {
      $addFields: {
        banner: '$banner',
        banner_resource: { $arrayElemAt: ['$banner_resource', 0] },
      },
    },
  ])
  return result[0] || null
}

export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  const result = await BlogModel.aggregate([
    { $match: { slug: slug } },
    {
      $lookup: {
        from: 'resources',
        localField: 'banner',
        foreignField: '_id',
        as: 'banner_resource',
      },
    },
    {
      $addFields: {
        banner: '$banner',
        banner_resource: { $arrayElemAt: ['$banner_resource', 0] },
      },
    },
  ])
  return result[0] || null
}

export async function createBlog(data: Partial<IBlog>): Promise<IBlog> {
  return BlogModel.create(data)
}

export async function updateBlogById(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
  const blog = await BlogModel.findById(id)
  if (!blog) return null

  Object.assign(blog, data)
  await blog.save()
  return blog.toObject()
}

export async function deleteBlogById(id: string): Promise<IBlog | null> {
  return BlogModel.findByIdAndDelete(id).lean<IBlog>().exec()
}
