'use client'

import { Edit, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import PaginationBar from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useBlogs, useDeleteBlog } from '@/requests/useBlog'
import { BlogResponse } from '@/types/blog'
import { CommonParam } from '@/types/common'
import { getResourceUrl } from '@/utils/helper'
import { useDialog } from 'app/dialog-provider'

export default function BlogPage() {
  const router = useRouter()
  const dialog = useDialog()

  const [filterParams, setFilterParams] = useState<CommonParam>({ skip: 0, limit: 5 })

  const { data: blogs, isLoading } = useBlogs(filterParams)
  const deleteBlog = useDeleteBlog()

  const handleOpenCreate = () => {
    router.push(`/admin/blog/new`)
  }

  const handleOpenEdit = (blog: BlogResponse) => {
    router.push(`/admin/blog/${blog?._id}`)
  }

  const handleOpenDelete = (blog: BlogResponse) => {
    dialog.openDialog({
      title: 'Delete confirmation',
      content: (
        <div className="py-4 text-center text-sm">
          Are you sure you want to delete post <span className="font-bold">{blog?.title}</span>?
        </div>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      showConfirm: true,
      width: '22%',
      onConfirm: () => handleDeleteBlog(blog?._id),
    })
  }

  const handleDeleteBlog = async (id: string) => {
    await deleteBlog.mutateAsync(id, {
      onSuccess: () => {
        dialog.closeDialog()
      },
    })
  }

  return (
    <div className="mx-auto max-w-full py-4 sm:max-w-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-gray-100">
          Post management
        </h1>
        <div className="flex items-center gap-2">
          <SearchInput
            onSearch={(value) => setFilterParams((prev) => ({ ...prev, search: value }))}
            isCollapsed={true}
          />
          <Button className="px-3 py-1 text-sm" onClick={handleOpenCreate}>
            Create new
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && <Loading />}
        {!isLoading &&
          (!blogs || !blogs.items || blogs.items.length === 0) &&
          (filterParams?.search ? (
            <Empty
              title="No matching results found"
              description="Please try again with a different keyword."
            />
          ) : (
            <Empty title="No posts yet" description="Create your first blog post." />
          ))}

        {blogs?.items?.map((blog) => (
          <Card
            key={blog?._id}
            className="flex flex-row items-center gap-3 bg-white p-2 shadow-sm sm:p-3 dark:bg-gray-900"
          >
            <CardHeader className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24 dark:bg-gray-800">
              <div className="relative h-full w-full">
                {blog?.banner_resource && (
                  <Image
                    src={getResourceUrl(blog?.banner_resource?.path)}
                    alt={blog?.banner_resource?.filename}
                    sizes="fill"
                    fill
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-0 py-1">
              <div className="text-base font-semibold text-gray-800 sm:text-lg dark:text-gray-100">
                {blog?.title}
              </div>
              <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                {blog?.summary}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => handleOpenEdit(blog)}
                aria-label="Edit"
              >
                <Edit className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5 dark:text-gray-300" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => handleOpenDelete(blog)}
                aria-label="Delete"
              >
                <Trash className="h-4 w-4 text-red-500 sm:h-5 sm:w-5 dark:text-red-400" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Pagination */}
      {blogs && (
        <PaginationBar
          total={blogs.total}
          skip={filterParams?.skip || 0}
          limit={filterParams?.limit || 5}
          onChange={(skip) => setFilterParams((prev) => ({ ...prev, skip }))}
        />
      )}
    </div>
  )
}
