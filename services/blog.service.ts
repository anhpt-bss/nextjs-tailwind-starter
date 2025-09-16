// services/blog.service.ts

import mongoose, { PipelineStage } from 'mongoose'

import BlogModel from '@/models/blog.model'
import { IBlog } from '@/models/blog.model'
import { CommonParam } from '@/types/common'

export async function getAllBlogs(
  options: CommonParam = {}
): Promise<{ items: IBlog[]; total: number }> {
  const { search, sort = 'newest', skip, limit } = options

  /** Build query */
  const query: Record<string, unknown> = {}
  if (search) {
    query.$text = { $search: search }
  }

  /** Count total first */
  const total = await BlogModel.countDocuments(query)

  /** Build sort object */
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

  /** Aggregation pipeline */
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
        from: 'storedfiles',
        localField: 'banner',
        foreignField: '_id',
        as: 'banner_storedfiles',
      },
    },
    {
      $addFields: {
        banner_storedfiles: { $arrayElemAt: ['$banner_storedfiles', 0] },
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
