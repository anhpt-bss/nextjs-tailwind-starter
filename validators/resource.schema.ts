import { z } from 'zod'

/**
 * Helper: ObjectId validator (24 hex chars)
 */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')

/**
 * Platform enum
 */
export const platformEnum = z.enum(['local', 'github', 'cloudinary', 'supabase', 'imgur', 'other'])

/**
 * Date preprocess: accept Date | string | number and convert to Date
 */
const datePreprocess = z.preprocess((val) => {
  if (val === null || val === undefined) return undefined
  // already a Date
  if (val instanceof Date) return val
  // numeric timestamp
  if (typeof val === 'number') return new Date(val)
  // string
  if (typeof val === 'string') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}, z.date())

/**
 * Base/schema core
 */
export const ResourceBaseSchema = z.object({
  platform: platformEnum.default('local'),
  storage: objectIdSchema.optional(), // reference to Storage._id
  filename: z.string().min(1),
  size: z.number().int().nonnegative(),
  mimetype: z.string().min(1),
  path: z.string().min(1),
  sha: z.string().optional(),
  download_url: z.string().url().optional(),
  preview_url: z.string().url().optional(),
  metadata: z.union([z.record(z.string(), z.any()), z.string()]).optional(),
  category: z.string().optional(),
  // created_by / updated_by: allow either an ObjectId string or a plain username string
  created_by: z.union([objectIdSchema, z.string()]).optional(),
  updated_by: z.union([objectIdSchema, z.string()]).optional(),
})

/**
 * Schema when creating a new resource (no _id, no timestamps)
 */
export const ResourceCreateSchema = ResourceBaseSchema.extend({
  // allow client to optionally pass created_by; other fields from ResourceBase are required
})

/**
 * Schema for DB response / full resource (includes _id and timestamps)
 */
export const ResourceResponseSchema = ResourceBaseSchema.extend({
  _id: objectIdSchema,
  created_at: datePreprocess.optional(),
  updated_at: datePreprocess.optional(),
})
