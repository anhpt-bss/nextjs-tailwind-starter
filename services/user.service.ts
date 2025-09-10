// services/user.service.ts

import UserModel from '@/models/user.model'
import { IUser } from '@/models/user.model'

export async function getAllUsers(): Promise<IUser[]> {
  return UserModel.find().lean<IUser[]>().exec()
}

export async function getUserById(id: string): Promise<IUser | null> {
  return UserModel.findById(id).lean<IUser>().exec()
}

export async function createUser(data: Partial<IUser>): Promise<IUser> {
  const { email, ...rest } = data

  const exists = await UserModel.findOne({ email })
  if (exists) throw new Error('Email is already in use')

  const user = await UserModel.create({ ...rest, email })
  return user
}

export async function updateUserById(id: string, data: Partial<IUser>): Promise<IUser | null> {
  return UserModel.findByIdAndUpdate(id, data, { new: true }).lean<IUser>().exec()
}

export async function deleteUserById(id: string): Promise<IUser | null> {
  return UserModel.findByIdAndDelete(id).lean<IUser>().exec()
}
