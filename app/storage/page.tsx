'use client'

import { Fragment, useState } from 'react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'
import AddStorageModal from '@/components/AddStorageModal'
import { useDialog } from 'app/dialog-provider'
import { useDeleteStorage, useStorages } from '@/requests/useStorage'
import type { StorageResponse } from '@/types/storage'
import Loading from '@/components/Loading'

const Storage: React.FC = () => {
  const { openDialog, closeDialog } = useDialog()

  const { data: storages = [], isLoading: loading } = useStorages()

  const deleteStorageMutation = useDeleteStorage()

  const handleDeleteStorage = (storage: StorageResponse) => {
    openDialog({
      title: 'Confirm storage deletion',
      description: `Are you sure you want to delete the storage "${storage.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        deleteStorageMutation.mutate(storage._id || '')
      },
    })
  }

  const handleAddStorage = () => {
    openDialog({
      title: 'Add new storage',
      showCancel: false,
      showConfirm: false,
      width: '50%',
      content: <AddStorageModal onClose={closeDialog} />,
    })
  }

  const handleEditStorage = (storage: StorageResponse) => {
    openDialog({
      title: 'Edit storage',
      showCancel: false,
      showConfirm: false,
      width: '50%',
      content: <AddStorageModal onClose={closeDialog} defaultValues={storage} />,
    })
  }

  return (
    <div className="h-screen w-full">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search storage..."
          className="flex-1 rounded-md border px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
        />
        <button
          className="ml-2 rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
          title="Add Storage"
          onClick={handleAddStorage}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Loading text="Loading..." />
        ) : (
          <ul className="space-y-2">
            {storages?.map((storage) => (
              <li
                key={storage._id}
                className={`flex cursor-pointer flex-col items-start justify-between gap-2 rounded-md border border-gray-100 px-3 py-2 transition-colors sm:flex-row sm:items-center dark:border-gray-800`}
              >
                <div className="flex items-center gap-2">
                  <ServerStackIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <div
                      className="max-w-[120px] truncate text-sm font-semibold text-gray-800 dark:text-white"
                      title={storage.name}
                    >
                      {storage.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {storage.platform}
                    </div>
                  </div>
                </div>
                <div className="flex-col items-center gap-2">
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Owner: {storage.owner}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Repo: {storage.repo}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
                    title="Edit"
                    onClick={() => handleEditStorage(storage)}
                  >
                    <PencilSquareIcon className="h-5 w-5 text-blue-500" />
                  </button>
                  <button
                    className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900"
                    title="Delete"
                    onClick={() => handleDeleteStorage(storage)}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Storage
