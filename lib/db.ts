// lib/db.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => mongoose)
  }
  cached.conn = await cached.promise
  ;(global as any).mongoose = cached
  return cached.conn
}
