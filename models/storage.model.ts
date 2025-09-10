import mongoose, { Schema, Document } from 'mongoose'

import { encrypt } from '@/lib/encrypt'

export interface IStorage extends Document {
  user: mongoose.Types.ObjectId
  platform?: 'github' | 'cloudinary' | 'supabase' | 'imgur' | 'other'
  name: string
  owner: string
  repo: string
  token: string
  created_at?: Date
  updated_at?: Date
}

const platformEnum = ['github', 'cloudinary', 'supabase', 'imgur', 'other']

const StorageSchema = new Schema<IStorage>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: platformEnum, required: false },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

StorageSchema.pre('save', async function (next) {
  if (!this.isModified('token') || !this.token) return next()
  this.token = await encrypt(this.token)
  next()
})

export default mongoose.models?.Storage || mongoose.model<IStorage>('Storage', StorageSchema)
