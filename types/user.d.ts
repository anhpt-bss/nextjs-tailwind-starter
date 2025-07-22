// types/user.ts
export interface UserResponse {
  _id: string
  avatar?: string
  name: string
  email: string
  is_admin?: boolean
  phone_number?: string
  address?: string
  gender?: string
  birthday?: string
  created_by?: string
  created_time?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone_number?: string
  address?: string
  gender?: string
  birthday?: string
}
