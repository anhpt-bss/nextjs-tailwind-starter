'use client'

import { useRegister } from '@/requests/useAuth'
import { registerSchema } from '@/validators/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import InputField from '@/components/headlessui/Input'
import SelectField from '@/components/headlessui/Select'
import DatePickerField from '@/components/headlessui/DatePicker'

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate: registerUser, isPending } = useRegister({
    redirectUrl: '/login',
  })

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:bg-gray-900/90"
      >
        <h2 className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300">
          Create your account
        </h2>

        <InputField
          control={control}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          required
        />

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

        <InputField
          control={control}
          name="phone_number"
          label="Phone Number"
          placeholder="e.g. 0123456789"
          type="tel"
        />

        <InputField
          control={control}
          name="address"
          label="Address"
          placeholder="123 Example Street"
        />

        <SelectField
          control={control}
          name="gender"
          label="Gender"
          options={[
            { label: 'Select gender', value: '', disabled: true },
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />

        <DatePickerField control={control} name="birthday" label="Birthday" />

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2 font-semibold text-white shadow-md transition"
          disabled={isPending}
        >
          {isPending ? 'Registering...' : 'Register'}
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-300">Already have an account?</span>
          <Link
            href="/login"
            className="ml-2 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
