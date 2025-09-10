// services/user.service.ts

import UserModel from '@/models/user.model'
import { IUser } from '@/models/user.model'

export async function getUserById(id: string): Promise<IUser | null> {
  return UserModel.findById(id).lean<IUser>().exec()
}

export async function getAllUsers(): Promise<IUser[]> {
  return UserModel.find().lean<IUser[]>().exec()
}
