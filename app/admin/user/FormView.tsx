'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/form/CheckboxField'
import { TextField } from '@/components/form/TextField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserCrudFormValues, userCrudSchema } from '@/validators/user.schema'

interface FormViewProps {
  onSubmit: (data: UserCrudFormValues) => void
  loading?: boolean
  defaultValues?: Partial<UserCrudFormValues> | null
}

export default function FormView({ onSubmit, loading, defaultValues }: FormViewProps) {
  const form = useForm<UserCrudFormValues>({
    resolver: zodResolver(userCrudSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      password: '',
      is_admin: defaultValues?.is_admin || false,
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter name"
          required
        />
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email"
          required
        />
        {!defaultValues && (
          <TextField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            required
          />
        )}

        <CheckboxField control={form.control} name="is_admin" label="Is Admin" />

        <Button type="submit" disabled={loading}>
          {defaultValues ? 'Save changes' : 'Create new'}
        </Button>
      </form>
    </Form>
  )
}
