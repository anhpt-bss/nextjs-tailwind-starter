// services/user.service.ts
import UserModel from '@/models/user.model'
import { IUser } from '@/models/user.model'
import api from '@/lib/axios'
import { UserResponse } from '@/types/user'

export async function getUserById(id: string): Promise<IUser | null> {
  return UserModel.findById(id).lean<IUser>().exec()
}

export async function getAllUsers(): Promise<IUser[]> {
  return UserModel.find().lean<IUser[]>().exec()
}

export const requestGetProfile = async () => {
  const res = await api.get('/api/users/me')
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

export const requestUpdateProfile = async (payload) => {
  const res = await api.put('/api/users/me', payload)
  if (!res.data.success) throw res.data
  return res.data.data as UserResponse
}

export const requestGetUsers = async (): Promise<UserResponse[]> => {
  const res = await api.get('/api/users')
  if (!res.data.success) throw res.data
  return res.data.data
}
