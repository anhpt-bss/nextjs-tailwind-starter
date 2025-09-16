'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import Loading from '@/components/Loading'
import { useCreateBlog, useUpdateBlog, useBlogsById } from '@/requests/useBlog'
import { uploadFileAndSaveResource } from '@/requests/useResource'
import { useDefautlStorages } from '@/requests/useStorage'
import { BlogResponse } from '@/types/blog'
import { BlogCrudFormValues } from '@/validators/blog.schema'

import FormView from '../FormView'

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const editedId = id
  const isEdit = !!(editedId && editedId !== 'new')

  const { data: blogDetail, isLoading } = useBlogsById(editedId, { enabled: isEdit })
  const { data: storages } = useDefautlStorages()
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const cloudStorage = React.useMemo(
    () => storages?.find((storage) => storage.is_default),
    [storages]
  )

  const handleCreateBlog = async (values: BlogCrudFormValues) => {
    const payload = new FormData()
    payload.append('title', values.title)
    payload.append('summary', values.summary)
    payload.append('content', values.content)

    if (values.banner instanceof File && cloudStorage) {
      const responseFile = await uploadFileAndSaveResource(values.banner, cloudStorage)

      if (responseFile) {
        payload.append('banner', responseFile?._id)
      } else {
        payload.append('banner', values.banner)
      }

      await createBlog.mutateAsync(payload, {
        onSuccess: () => router.push('/admin/blog'),
      })
    }
  }

  const handleEditBlog = async (blog: BlogResponse, values: BlogCrudFormValues) => {
    const payload = new FormData()
    payload.append('_id', blog._id)
    payload.append('title', values.title)
    payload.append('summary', values.summary)
    payload.append('content', values.content)

    if (values.banner instanceof File && cloudStorage) {
      const responseFile = await uploadFileAndSaveResource(values.banner, cloudStorage)

      if (responseFile) {
        payload.append('banner', responseFile?._id)
      } else {
        payload.append('banner', values.banner)
      }

      await updateBlog.mutateAsync(payload, {
        onSuccess: () => router.push('/admin/blog'),
      })
    } else {
      payload.append('banner', values.banner)

      await updateBlog.mutateAsync(payload, {
        onSuccess: () => router.push('/admin/blog'),
      })
    }
  }

  if (!isEdit) {
    return (
      <FormView
        onSubmit={handleCreateBlog}
        loading={createBlog.isPending}
        cloudStorage={cloudStorage}
      />
    )
  }
  if (isLoading) {
    return <Loading />
  }
  if (!blogDetail) {
    return <div>Post not found</div>
  }
  return (
    <FormView
      defaultValues={blogDetail}
      cloudStorage={cloudStorage}
      onSubmit={async (values) => handleEditBlog(blogDetail, values)}
      loading={updateBlog.isPending}
    />
  )
}
