import Storage from '@/models/storage.model'
import { connectDB } from '@/lib/db'
import api from '@/lib/axios'
import type { CreateStoragePayload, StorageResponse, UpdateStoragePayload } from '@/types/storage'

export const requestGetStorages = async () => {
  const res = await api.get('/api/storage')
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse[]
}

export const requestCreateStorage = async (payload: CreateStoragePayload) => {
  const res = await api.post('/api/storage', payload)
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse
}

export const requestUpdateStorage = async (payload: UpdateStoragePayload) => {
  const res = await api.put(`/api/storage/${payload._id}`, payload)
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse
}

export const requestDeleteStorage = async (id: string) => {
  const res = await api.delete(`/api/storage/${id}`)
  if (!res.data.success) throw res.data
  return res.data.data as StorageResponse
}

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
