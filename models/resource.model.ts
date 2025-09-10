import mongoose, { Schema, Document } from 'mongoose'

export interface IResource extends Document {
  filename: string
  size: number
  mimetype: string
  path: string
  category?: string
  created_by?: string
  created_time?: Date
}

const ResourceSchema = new Schema<IResource>(
  {
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
    category: {
      type: String,
      required: false,
      default: 'Hệ Thống',
    },
    created_by: {
      type: String,
      default: 'Admin',
    },
    created_time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.models?.Resource || mongoose.model<IResource>('Resource', ResourceSchema)
