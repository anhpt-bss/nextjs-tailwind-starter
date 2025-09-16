// models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose'

import { hashCharacter } from '@/lib/hash'

export interface IUser extends Document {
  avatar?: mongoose.Types.ObjectId
  name: string
  email: string
  password?: string
  is_admin?: boolean
  phone_number?: string
  address?: string
  gender?: string
  birthday?: string
  created_by?: string
  created_time?: Date
}

const genderEnum = ['male', 'female', 'other']

const UserSchema = new Schema<IUser>({
  avatar: { type: Schema.Types.ObjectId, ref: 'Resource', required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  is_admin: { type: Boolean, default: false },
  phone_number: { type: String, required: false },
  address: { type: String, required: false },
  gender: { type: String, enum: genderEnum, required: false },
  birthday: { type: String, required: false },
  created_by: { type: String, default: 'Admin' },
  created_time: { type: Date, default: Date.now },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await hashCharacter(this.password)
  next()
})

export default mongoose.models?.User || mongoose.model<IUser>('User', UserSchema)
