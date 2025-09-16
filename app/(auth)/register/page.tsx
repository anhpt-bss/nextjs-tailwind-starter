'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DatePickerField } from '@/components/form/DatePickerField'
import { SelectField } from '@/components/form/SelectField'
import { TextField } from '@/components/form/TextField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useRegister } from '@/requests/useAuth'
import { registerSchema } from '@/validators/auth.schema'

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone_number: '',
      address: '',
      gender: '',
      birthday: undefined,
    },
  })

  const { mutate: registerUser, isPending } = useRegister({
    redirectUrl: '/login',
  })

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:bg-gray-900/90">
        <h2 className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300">
          Register
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TextField
              control={form.control}
              name="name"
              label="Full name"
              placeholder="Enter your full name"
              required
            />

            <TextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <TextField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Choose a secure password"
              minLength={6}
              required
            />

            <TextField
              control={form.control}
              name="phone_number"
              label="Phone number"
              type="tel"
              placeholder="e.g. 0123456789"
            />

            <TextField
              control={form.control}
              name="address"
              label="Address"
              placeholder="Enter your address"
            />

            <SelectField
              control={form.control}
              name="gender"
              label="Gender"
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
            />

            <DatePickerField control={form.control} name="birthday" label="Birthday" />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:to-pink-700"
              disabled={isPending}
            >
              {isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-300">Already have an account?</span>
          <Link
            href="/login"
            className="ml-2 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
