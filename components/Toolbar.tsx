import React from 'react'
import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpTrayIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import Link from 'next/link'
import debounce from 'lodash/debounce'
import clsx from 'clsx'

const sortOptions = [
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
  { value: 'newest', label: 'Newest' },
  { value: 'size', label: 'Size' },
]

import type { StorageResponse } from '@/types/storage'
import { ComboboxField, ComboboxOption } from './headlessui/Combobox'

export type ToolbarFiltersType = {
  search?: string
  storage?: string
  sort?: string
}

interface ToolbarProps {
  filters?: ToolbarFiltersType
  setFilters: (filters: ToolbarFiltersType) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  onUpload: () => void
  storages: StorageResponse[]
}

const Toolbar: React.FC<ToolbarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  onUpload,
  storages,
}) => {
  const [searchInput, setSearchInput] = React.useState(filters?.search || '')

  const handleSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        onSetFilters('search', value)
      }, 300),
    []
  )

  const onSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchInput(value)
      handleSearch(value)
    },
    [handleSearch]
  )

  const storageOptions: ComboboxOption<string>[] = React.useMemo(
    () =>
      storages.map((storage) => ({
        label: `${storage.name} (${storage.owner})`,
        value: storage._id,
      })),
    [storages]
  )

  const onSetFilters = React.useCallback(
    (name: string, value: string | null | undefined) => {
      setFilters({ ...filters, [name]: value })
    },
    [filters, setFilters]
  )

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-sm border border-gray-200 bg-gray-100 p-4 md:flex-nowrap dark:border-gray-700 dark:bg-gray-800">
      <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:gap-4">
        <input
          type="text"
          placeholder="Search files..."
          className={clsx(
            'relative w-full transition md:w-auto',
            'rounded-md border border-gray-300 px-2 py-1 shadow-sm dark:border-gray-700',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'focus:ring-1 focus:ring-blue-500 focus:outline-none'
          )}
          value={searchInput}
          onChange={onSearchChange}
        />
        <div className="flex w-full items-center gap-2 md:w-auto">
          <ComboboxField
            options={storageOptions}
            selected={filters?.storage || null}
            onChange={(val) => {
              onSetFilters('storage', val)
            }}
            placeholder="Select a storage"
            className="w-full md:w-auto"
          />
          <Link
            href="/storage"
            className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Manage storage"
          >
            <ServerStackIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          </Link>
        </div>
      </div>
      <div className="mt-2 flex flex-1 flex-wrap items-center justify-end gap-2 md:mt-0">
        <button
          className="flex cursor-pointer items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-white hover:bg-green-700"
          onClick={onUpload}
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          <span className="inline">Upload</span>
        </button>

        <Listbox value={filters?.sort || 'newest'} onChange={(val) => onSetFilters('sort', val)}>
          <div className="relative">
            <ListboxButton className="w-full cursor-pointer rounded-md border border-gray-300 px-2 py-1 md:w-auto dark:border-gray-700 dark:bg-gray-700 dark:text-white">
              Sort: {sortOptions.find((o) => o.value === (filters?.sort || 'newest'))?.label}
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 w-32 rounded border border-gray-300 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
              {sortOptions.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  {option.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <div className="flex gap-2">
          <button
            className={`cursor-pointer rounded-md px-2 py-1 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'} w-full md:w-auto`}
            onClick={() => setViewMode('grid')}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            className={`cursor-pointer rounded-md px-2 py-1 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'} w-full md:w-auto`}
            onClick={() => setViewMode('list')}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
