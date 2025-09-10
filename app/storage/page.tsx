'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { ServerStackIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'

import AddStorageModal from '@/components/AddStorageModal'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { useDeleteStorage, useStorages } from '@/requests/useStorage'
import type { StorageResponse } from '@/types/storage'
import { useDialog } from 'app/dialog-provider'

const Storage: React.FC = () => {
  const { openDialog, closeDialog } = useDialog()

  const { data: storages = [], isLoading: loading } = useStorages()

  const [search, setSearch] = useState('')
  const [filteredStorages, setFilteredStorages] = useState<StorageResponse[]>(storages)

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

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const lower = value.toLowerCase()
        setFilteredStorages(
          storages.filter(
            (s) =>
              s.name.toLowerCase().includes(lower) ||
              s.platform?.toLowerCase().includes(lower) ||
              s.owner?.toLowerCase().includes(lower) ||
              s.repo?.toLowerCase().includes(lower)
          )
        )
      }, 300),
    [storages]
  )

  // Update filteredStorages when storages change
  useEffect(() => {
    setFilteredStorages(storages)
  }, [storages])

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <div className="mt-4 h-screen w-full">
      <Link
        href="/gallery"
        className="mb-4 flex w-fit rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Back to Gallery"
      >
        <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-200" />
        <span className="ml-2 text-sm font-semibold text-gray-800 dark:text-white">
          Back to Gallery
        </span>
      </Link>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search storage..."
          className="flex-1 rounded-md border px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
        />
        <button
          className="ml-2 cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
          title="Add Storage"
          onClick={handleAddStorage}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Loading text="Loading..." />
        ) : filteredStorages.length === 0 ? (
          <Empty
            title="No Storage Found"
            description={
              search
                ? 'No storage matched your search.'
                : 'You have no storage yet. Click the button below to add your first storage.'
            }
            buttonText="Add Storage"
            onButtonClick={handleAddStorage}
          />
        ) : (
          <ul className="space-y-2">
            {filteredStorages.map((storage) => (
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
