'use client'

import { useLogin } from '@/requests/useAuth'
import { loginSchema } from '@/validators/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import InputField from '@/components/headlessui/Input'
import Link from 'next/link'

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate: login, isPending } = useLogin({
    redirectUrl: '/',
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:bg-gray-900/90"
      >
        <h2 className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300">
          Sign in to your account
        </h2>

        <InputField
          control={control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          required
          inputProps={{ autoComplete: 'email' }}
        />

        <InputField
          control={control}
          name="password"
          label="Password"
          placeholder="Choose a secure password"
          type="password"
          required
          inputProps={{ minLength: 6 }}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2 font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-pink-700"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-300">Don't have an account?</span>
          <Link
            href="/register"
            className="ml-2 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Register now
          </Link>
        </div>
      </form>
    </div>
  )
}
