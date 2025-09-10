import { connectDB } from '@/lib/db'
import Storage from '@/models/storage.model'
import type { StorageResponse } from '@/types/storage'

export async function createStorage(data: Partial<StorageResponse>) {
  await connectDB()
  return Storage.create(data)
}

export async function getStoragesByUser(userId: string) {
  await connectDB()
  return Storage.find({ user: userId })
}

export async function getStorageById(id: string, userId: string) {
  await connectDB()
  return Storage.findOne({ _id: id, user: userId })
}

export async function updateStorage(id: string, userId: string, data: Partial<StorageResponse>) {
  await connectDB()
  const doc = await Storage.findOne({ _id: id, user: userId })
  if (!doc) return null
  Object.assign(doc, data)
  await doc.save()
  return doc
}

export async function deleteStorage(id: string, userId: string) {
  await connectDB()
  return Storage.findOneAndDelete({ _id: id, user: userId })
}
