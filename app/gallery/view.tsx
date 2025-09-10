'use client'

import {
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { InfiniteData } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'

import Dropzone from '@/components/Dropzone'
import FilePreviewer from '@/components/FilePreviewer'
import FilePreviewModal from '@/components/FilePreviewModal'
import Folders from '@/components/Folders'
import GalleryGrid from '@/components/GalleryGrid'
import GalleryList from '@/components/GalleryList'
import Loading from '@/components/Loading'
import Toolbar, { ToolbarFiltersType } from '@/components/Toolbar'
import UploadModal from '@/components/UploadModal'
import { useStorages } from '@/requests/useStorage'
import {
  useLazyStorageFiles,
  useDeleteFile,
  useDeleteMultipleFile,
  useFolders,
} from '@/requests/useStoredFile'
import { PaginatedResponse } from '@/types/common'
import { StoredFileResponse } from '@/types/storage'
import { handleDownload } from '@/utils/helper'
import { useDialog } from 'app/dialog-provider'

type GalleryFilters = ToolbarFiltersType & {
  folder?: string
  skip?: number
  limit?: number
}

const defaultFilters: GalleryFilters = {
  search: undefined,
  storage: undefined,
  folder: undefined,
  sort: 'newest',
  skip: 0,
  limit: 50,
}

const View: React.FC = () => {
  const { openDialog, closeDialog } = useDialog()

  const router = useRouter()
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<GalleryFilters | undefined>(undefined)
  const [currentFileSelected, setCurrentFileSelected] = useState<StoredFileResponse | null>(null)
  const [openFilePreviewer, setOpenFilePreviewer] = useState(false)

  // Multi-select state
  const [selectedFiles, setSelectedFiles] = useState<StoredFileResponse[]>([])

  const { data: storages = [] } = useStorages()
  const { data: folders = [] } = useFolders()
  const {
    data: lazyFilesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingFiles,
    isError,
    error,
  } = useLazyStorageFiles(filters, {
    enabled: !!filters,
  })
  const deleteFileMutation = useDeleteFile()
  const deleteMultiFileMutation = useDeleteMultipleFile()

  useEffect(() => {
    // Sync state from query params on mount and when query changes
    const viewModeParam = (searchParams.get('view') as 'grid' | 'list') || 'grid'
    const search = searchParams.get('search')
    const storage = searchParams.get('storage')
    const sort = searchParams.get('sort') || 'newest'
    const skip = searchParams.get('skip')
    const limit = searchParams.get('limit')
    const folder = searchParams.get('folder')

    if (!skip && !limit) {
      updateQuery(defaultFilters, viewModeParam)
    } else {
      setViewMode(viewModeParam)
      setFilters({
        search: search || undefined,
        storage: storage || undefined,
        folder: folder || undefined,
        sort: sort,
        skip: Number(skip),
        limit: Number(limit),
      })
    }
  }, [searchParams])

  // Helper to update query string
  const updateQuery = (newFilters: GalleryFilters | undefined, newViewMode: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString())

    if (newFilters?.search) params.set('search', newFilters?.search)
    else params.delete('search')
    if (newFilters?.storage) params.set('storage', newFilters?.storage)
    else params.delete('storage')
    if (newFilters?.folder) params.set('folder', newFilters?.folder)
    else params.delete('folder')
    if (newFilters?.sort) params.set('sort', newFilters?.sort)
    else params.delete('sort')
    if (newFilters?.skip !== undefined) params.set('skip', String(newFilters?.skip))
    else params.delete('skip')
    if (newFilters?.limit !== undefined) params.set('limit', String(newFilters?.limit))
    else params.delete('limit')

    params.set('view', newViewMode)

    router.replace(`?${params.toString()}`)
  }

  const handleSetFilters = (newFilter = filters, newViewMode = viewMode) => {
    const updated = { ...newFilter, offset: 0 }
    updateQuery(updated, newViewMode)
  }

  // --- Infinite Scroll Logic ---
  const infiniteFiles = lazyFilesData as
    | InfiniteData<PaginatedResponse<StoredFileResponse>>
    | undefined
  const allFiles: StoredFileResponse[] = infiniteFiles?.pages?.flatMap((page) => page.items) || []

  const totalItems = infiniteFiles?.pages[infiniteFiles.pages.length - 1]?.total ?? 0

  const observerElem = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = observerElem.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the element is visible
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [handleObserver, filters]) // Re-run effect if filters change to re-observe

  // --- Handlers ---
  const handleDeleteFile = (file: StoredFileResponse) => {
    openDialog({
      title: 'Confirm file deletion',
      description: `Are you sure you want to delete the file "${file.file_name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        deleteFileMutation.mutate(file._id)
      },
    })
  }

  const handlePreviewFile = (file: StoredFileResponse, type = 'previewer') => {
    if (type === 'dialog') {
      openDialog({
        title: file.file_name,
        showCancel: false,
        showConfirm: false,
        width: '80%',
        content: <FilePreviewModal file={file} />,
      })
    } else {
      setCurrentFileSelected(file)
      setOpenFilePreviewer(true)
    }
  }

  const handleUploadFile = (files?: FileList) => {
    openDialog({
      title: 'Upload file',
      confirmText: 'Upload',
      cancelText: 'Cancel',
      showCancel: false,
      showConfirm: false,
      width: '50%',
      content: (
        <UploadModal
          storages={storages}
          folders={folders}
          selectedStorage={filters?.storage}
          defaultFiles={files}
          onClose={() => closeDialog()}
        />
      ),
    })
  }

  // Multi-select handlers
  const lastSelectedIndexRef = useRef<number | null>(null)
  const handleSelectFile = (file: StoredFileResponse, event: React.MouseEvent) => {
    const allIds = allFiles.map((f) => f._id)
    const clickedIndex = allIds.indexOf(file._id)

    if (event.shiftKey && selectedFiles.length > 0 && lastSelectedIndexRef.current !== null) {
      const start = Math.min(lastSelectedIndexRef.current, clickedIndex)
      const end = Math.max(lastSelectedIndexRef.current, clickedIndex)
      const rangeFiles = allFiles.slice(start, end + 1)
      setSelectedFiles(rangeFiles)
    } else if (event.ctrlKey || event.metaKey) {
      setSelectedFiles((prev) => {
        const exists = prev.find((f) => f._id === file._id)
        if (exists) {
          return prev.filter((f) => f._id !== file._id)
        } else {
          return [...prev, file]
        }
      })
      lastSelectedIndexRef.current = clickedIndex
    } else {
      setSelectedFiles([file])
      lastSelectedIndexRef.current = clickedIndex
    }
  }

  const handleDeselectAll = () => setSelectedFiles([])

  const handleSelectAll = () => setSelectedFiles(allFiles)

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return
    openDialog({
      title: 'Delete selected files',
      description: `Are you sure you want to delete ${selectedFiles.length} selected files?`,
      confirmText: 'Delete all',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        deleteMultiFileMutation.mutate(selectedFiles.map((file) => file._id))
        setSelectedFiles([])
      },
    })
  }

  const handleDownloadSelected = () => {
    selectedFiles.forEach((file) => {
      handleDownload(file.file_name, file.download_url)
    })
  }

  if (!filters)
    return (
      <div className="h-[50vh]">
        <Loading text="Loading..." />
      </div>
    )

  return (
    <div className="w-full">
      <Toolbar
        filters={filters}
        setFilters={(newFilter) => {
          handleSetFilters(newFilter)
        }}
        viewMode={viewMode}
        setViewMode={(mode) => {
          handleSetFilters(filters, mode)
        }}
        onUpload={handleUploadFile}
        storages={storages}
      />
      <Dropzone onUpload={(files) => handleUploadFile(files)}>
        <div className="relative w-full">
          {isError ? (
            <div>Error loading files: {error?.message}</div>
          ) : (
            <>
              <div className="my-3 flex flex-wrap items-center gap-2">
                <div className="rounded bg-gray-300 px-2 py-1 text-sm dark:bg-gray-700">
                  {`Total: ${allFiles?.length}/${totalItems}`}
                </div>

                <Folders
                  folders={folders}
                  selected={filters?.folder}
                  onSelect={(folder) => handleSetFilters({ ...filters, folder })}
                />
              </div>

              {viewMode === 'grid' ? (
                <GalleryGrid
                  files={allFiles}
                  loading={loadingFiles && allFiles.length === 0}
                  onPreview={handlePreviewFile}
                  onDeleteFile={handleDeleteFile}
                  selectedFiles={selectedFiles}
                  onSelectFile={handleSelectFile}
                />
              ) : (
                <GalleryList
                  files={allFiles}
                  loading={loadingFiles && allFiles.length === 0}
                  onPreview={handlePreviewFile}
                  onDeleteFile={handleDeleteFile}
                  selectedFiles={selectedFiles}
                  onSelectFile={handleSelectFile}
                />
              )}

              {/* Infinite scroll sentinel */}
              <div ref={observerElem} className="h-1 bg-transparent"></div>
              {isFetchingNextPage && <Loading text="Loading more..." />}
              {!hasNextPage && allFiles.length > 0 && (
                <div className="p-4 text-center text-gray-500">
                  You've reached the end of the list.
                </div>
              )}
            </>
          )}

          {/* Bottom bar for selected files */}
          {selectedFiles.length > 0 && (
            <div className="animate-fade-in fixed bottom-0 left-0 z-50 flex w-full items-center justify-center gap-4 border-t border-gray-300 bg-white px-4 py-2 shadow dark:border-gray-700 dark:bg-gray-900">
              <button
                className="flex gap-2 rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Deselect all"
                onClick={handleDeselectAll}
              >
                <XCircleIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  {selectedFiles.length} file(s) selected
                </span>
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Select all"
                onClick={handleSelectAll}
              >
                <CheckCircleIcon className="h-5 w-5" />
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Delete selected"
                onClick={handleDeleteSelected}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Download all"
                onClick={handleDownloadSelected}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </Dropzone>

      <FilePreviewer
        open={openFilePreviewer}
        setOpen={setOpenFilePreviewer}
        files={allFiles}
        currentFile={currentFileSelected || allFiles[0]}
      />
    </div>
  )
}

export default View
