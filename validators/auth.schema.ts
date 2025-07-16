// validators/auth.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email(),
  password: z.string().nonempty('Password is required'),
})

export const registerSchema = z.object({
  email: z.string().nonempty('Email is required').email(),
  password: z.string().nonempty('Password is required'),
  name: z.string().nonempty('Name is required'),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
  birthday: z.string().optional(),
})
