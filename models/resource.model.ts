import mongoose, { Schema, Document } from 'mongoose'

export interface IResource extends Document {
  platform: 'local' | 'github' | 'cloudinary' | 'supabase' | 'imgur' | 'other'
  storage?: mongoose.Types.ObjectId
  filename: string
  size: number
  mimetype: string
  path: string
  sha?: string
  download_url?: string
  preview_url?: string
  metadata?: Record<string, any>
  category?: string
  created_by?: string
  updated_by?: string
  created_at?: Date
  updated_at?: Date
}

const ResourceSchema = new Schema<IResource>(
  {
    platform: {
      type: String,
      enum: ['local', 'github', 'cloudinary', 'supabase', 'imgur', 'other'],
      required: true,
      default: 'local',
    },
    storage: {
      type: Schema.Types.ObjectId,
      ref: 'Storage',
      required: false,
    },
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    sha: {
      type: String,
      required: false,
    },
    download_url: {
      type: String,
      required: false,
    },
    preview_url: {
      type: String,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
    category: {
      type: String,
      required: false,
      default: 'System',
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

export default mongoose.models?.Resource || mongoose.model<IResource>('Resource', ResourceSchema)
