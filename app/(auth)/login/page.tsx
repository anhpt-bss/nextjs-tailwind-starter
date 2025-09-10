'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { TextField } from '@/components/form/TextField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useLogin } from '@/requests/useAuth'
import { loginSchema } from '@/validators/auth.schema'

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate: login, isPending } = useLogin({
    redirectUrl: '/',
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:bg-gray-900/90">
        <h2 className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300">
          Login
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TextField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              required
            />

            <TextField
              control={form.control}
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              required
              minLength={6}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:to-pink-700"
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-300">Don't have an account?</span>
          <Link
            href="/register"
            className="ml-2 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Register now
          </Link>
        </div>
      </div>
    </div>
  )
}
