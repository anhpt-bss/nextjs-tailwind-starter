'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/form/CheckboxField'
import { EditorField } from '@/components/form/EditorField'
import { FileField } from '@/components/form/FileField'
import { TextField } from '@/components/form/TextField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { BlogResponse } from '@/types/blog'
import { BlogCrudFormValues, blogCrudSchema } from '@/validators/blog.schema'

interface FormViewProps {
  onSubmit: (data: BlogCrudFormValues) => void
  loading?: boolean
  defaultValues?: BlogResponse | null
}

export default function FormView({ onSubmit, loading, defaultValues }: FormViewProps) {
  const router = useRouter()

  const form = useForm<BlogCrudFormValues>({
    resolver: zodResolver(blogCrudSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      summary: defaultValues?.summary || '',
      banner: defaultValues?.banner,
      content: defaultValues?.content || '',
      is_published: defaultValues?.is_published || false,
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField control={form.control} name="title" label="Title" placeholder="Enter title" />
        <TextField
          control={form.control}
          name="summary"
          label="Summary"
          placeholder="Enter summary"
        />
        <FileField
          control={form.control}
          name="banner"
          label="Banner"
          multiple={false}
          defaultFile={
            defaultValues?.banner_resource ? [defaultValues?.banner_resource] : undefined
          }
        />

        <EditorField
          control={form.control}
          name="content"
          label="Content"
          uploadType="api"
          height={'auto'}
        />

        <CheckboxField control={form.control} name="is_published" label="Published" />

        <div className="mt-4 flex gap-4">
          <Button
            className="flex-1"
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </Button>
          <Button className="flex-1" type="submit" disabled={loading}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
