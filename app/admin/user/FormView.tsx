'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField control={form.control} name="name" label="Tên" placeholder="Nhập tên" required />
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="Nhập email"
          required
        />
        {!defaultValues && (
          <TextField
            control={form.control}
            name="password"
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            required
          />
        )}

        <Button type="submit" disabled={loading}>
          {defaultValues ? 'Lưu thay đổi' : 'Tạo mới'}
        </Button>
      </form>
    </Form>
  )
}
