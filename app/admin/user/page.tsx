'use client'

import { Edit, Trash } from 'lucide-react'

import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/requests/useUser'
import { UserResponse } from '@/types/user'
import { useDialog } from 'app/dialog-provider'

import FormView from './FormView'

export default function UserPage() {
  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const dialog = useDialog()

  const handleOpenCreate = () => {
    dialog.openDialog({
      title: 'Create new user',
      content: (
        <FormView
          onSubmit={(values) => {
            handleCreateUser(values)
          }}
          loading={createUser.isPending}
        />
      ),
      showCancel: false,
      showConfirm: false,
      width: '30%',
    })
  }

  const handleOpenEdit = (user: UserResponse) => {
    dialog.openDialog({
      title: 'Edit user',
      content: (
        <FormView
          defaultValues={user}
          onSubmit={(values) => handleEditUser({ ...user, ...values })}
          loading={updateUser.isPending}
        />
      ),
      showCancel: false,
      showConfirm: false,
      width: '30%',
    })
  }

  const handleCreateUser = async (data: Partial<UserResponse>) => {
    const param = {
      name: data.name,
      email: data.email,
      password: data.password,
      is_admin: data.is_admin,
    }

    createUser.mutate(param, {
      onSuccess: () => {
        dialog.closeDialog()
      },
    })
  }

  const handleEditUser = async (data: Partial<UserResponse>) => {
    const param = {
      _id: data._id,
      name: data.name,
      email: data.email,
    }

    updateUser.mutate(param, {
      onSuccess: () => {
        dialog.closeDialog()
      },
    })
  }

  const handleDeleteUser = (user: UserResponse) => {
    dialog.openDialog({
      title: 'Delete confirmation',
      content: (
        <div className="py-4 text-center text-sm">
          Are you sure you want to delete user <span className="font-bold">{user.name}</span>?
        </div>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      showConfirm: true,
      width: '22%',
      onConfirm: () => deleteUser.mutate(user._id),
    })
  }

  return (
    <div className="mx-auto max-w-3xl py-4 sm:max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl font-bold text-gray-800 sm:text-2xl dark:text-gray-100">
          User management
        </h1>
        <Button className="mb-4 px-3 py-1 text-sm" onClick={handleOpenCreate}>
          Create new
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {isLoading && <Loading />}
        {users?.map((user) => (
          <Card
            key={user._id}
            className="flex flex-row items-center gap-3 bg-white p-2 shadow-sm sm:p-3 dark:bg-gray-900"
          >
            <CardHeader className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-base font-bold text-gray-700 sm:h-12 sm:w-12 sm:text-lg dark:bg-gray-800 dark:text-gray-200">
              {user.name?.[0] || '?'}
            </CardHeader>
            <CardContent className="flex-1 px-0 py-1">
              <div className="text-base font-semibold text-gray-800 sm:text-lg dark:text-gray-100">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                {user.email}
              </div>
            </CardContent>
            <div className="flex w-20 items-center justify-center">
              {user.is_admin ? (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  Admin
                </span>
              ) : (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  User
                </span>
              )}
            </div>
            <div className="flex flex-row gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => handleOpenEdit(user)}
                aria-label="Sửa"
              >
                <Edit className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5 dark:text-gray-300" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => handleDeleteUser(user)}
                aria-label="Xoá"
              >
                <Trash className="h-4 w-4 text-red-500 sm:h-5 sm:w-5 dark:text-red-400" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
