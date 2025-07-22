// services/auth.service.ts
import api from '@/lib/axios'
import UserModel from '@/models/user.model'
import { signJwt } from '@/lib/jwt'
import { compareCharacter } from '@/lib/hash'
import { LoginPayload, RegisterPayload, UserResponse } from '@/types/user.ts'
import { clearAllCookiesClient, setUniversalCookie } from '@/lib/cookie'
import { getQueryClient } from '@/lib/react-query'

export async function login(data: LoginPayload) {
  const user = await UserModel.findOne({ email: data.email })
  if (!user || !user.password) throw new Error('Invalid credentials')

  const isMatch = await compareCharacter(data.password, user.password)

  if (!isMatch) throw new Error('Invalid credentials')

  const token = signJwt({ userId: user._id, isAdmin: user.is_admin })
  return { user, token }
}

export async function register(data: RegisterPayload) {
  const { email, ...rest } = data

  const exists = await UserModel.findOne({ email })
  if (exists) throw new Error('Email already exists')

  const user = await UserModel.create({ ...rest, email })
  return { user }
}

export function logoutAndClearSession() {
  clearAllCookiesClient()

  const queryClient = getQueryClient()
  queryClient.clear()

  return true
}

export function saveAuthCookies(token?: string, user?: UserResponse) {
  if (token) {
    setUniversalCookie('token', token)
  }
  if (user) {
    const profileSaved = {
      userId: user._id,
      avatar: user.avatar,
      name: user.name,
      isAdmin: user.is_admin,
    }
    setUniversalCookie('profile', JSON.stringify(profileSaved))
  }
}

export const requestLogin = async (payload) => {
  const res = await api.post('/api/auth/login', payload)
  if (!res.data.success) throw res.data
  return res.data.data
}

export const requestRegister = async (payload) => {
  const res = await api.post('/api/auth/register', payload)
  if (!res.data.success) throw res.data
  return res.data.data
}

export const requestLogout = async () => {
  const res = await api.post('/api/auth/logout')
  if (!res.data.success) throw res.data
  return res.data.data
}
