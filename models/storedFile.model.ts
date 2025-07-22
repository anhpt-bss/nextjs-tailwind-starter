import mongoose, { Schema, Document } from 'mongoose'

export interface IStoredFile extends Document {
  storage: mongoose.Types.ObjectId
  file_name: string
  file_path: string
  file_extension?: string
  content_type?: string
  size?: number
  sha: string
  download_url: string
  preview_url?: string

  uploaded_by?: mongoose.Types.ObjectId
  created_at?: Date
  updated_at?: Date

  platform?: 'github' | 'cloudinary' | 'supabase' | 'imgur' | 'other'
  metadata?: Record<string, any>
}

const StoredFileSchema = new Schema<IStoredFile>(
  {
    storage: { type: Schema.Types.ObjectId, ref: 'Storage', required: true },

    file_name: { type: String, required: true },
    file_path: { type: String, required: true },
    file_extension: { type: String, required: false },
    content_type: { type: String, required: false },
    size: { type: Number, required: false },

    sha: { type: String, required: true },
    download_url: { type: String, required: true },
    preview_url: { type: String, required: false },

    uploaded_by: { type: Schema.Types.ObjectId, ref: 'User', required: false },

    platform: {
      type: String,
      enum: ['github', 'cloudinary', 'supabase', 'imgur', 'other'],
      default: 'github',
    },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

export default mongoose.models?.StoredFile ||
  mongoose.model<IStoredFile>('StoredFile', StoredFileSchema)
