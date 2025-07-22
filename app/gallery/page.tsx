'use client'

import Toolbar, { ToolbarFiltersType } from '@/components/Toolbar'
import GalleryGrid from '@/components/GalleryGrid'
import GalleryList from '@/components/GalleryList'
import UploadModal from '@/components/UploadModal'
import FilePreviewModal from '@/components/FilePreviewModal'
import { useStorages } from '@/requests/useStorage'
import { useLazyStorageFiles, useDeleteFile, useDeleteMultipleFile } from '@/requests/useStoredFile'
import { useEffect, useState, useRef, useCallback } from 'react'
import { StoredFileResponse } from '@/types/storage'
import { useDialog } from 'app/dialog-provider'
import { InfiniteData } from '@tanstack/react-query'
import { PaginatedResponse } from '@/types/common'
import Dropzone from '@/components/Dropzone'
import Loading from '@/components/Loading'

import {
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { handleDownload } from '@/utils/helper'

type GalleryFilters = ToolbarFiltersType & {
  skip?: number
  limit?: number
}

const GalleryPage: React.FC = () => {
  const { openDialog, closeDialog } = useDialog()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<GalleryFilters>({
    search: undefined,
    storage: undefined,
    sort: undefined,
    skip: 0,
    limit: 50,
  })

  // Multi-select state
  const [selectedFiles, setSelectedFiles] = useState<StoredFileResponse[]>([])

  const { data: storages = [] } = useStorages()
  const {
    data: lazyFilesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingFiles,
    isError,
    error,
  } = useLazyStorageFiles(filters)
  const deleteFileMutation = useDeleteFile()
  const deleteMultiFileMutation = useDeleteMultipleFile()

  // --- Infinite Scroll Logic ---
  const infiniteFiles = lazyFilesData as
    | InfiniteData<PaginatedResponse<StoredFileResponse>>
    | undefined
  const allFiles: StoredFileResponse[] = infiniteFiles?.pages?.flatMap((page) => page.data) || []

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

  const handlePreviewFile = (file: StoredFileResponse) => {
    openDialog({
      title: file.file_name,
      showCancel: false,
      showConfirm: false,
      width: '80%',
      content: <FilePreviewModal file={file} />,
    })
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
          selectedStorage={filters.storage}
          defaultFiles={files}
          onClose={() => closeDialog()}
        />
      ),
    })
  }

  // Multi-select handlers
  const handleSelectFile = (file: StoredFileResponse, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedFiles((prev) => {
        const exists = prev.find((f) => f._id === file._id)
        if (exists) {
          return prev.filter((f) => f._id !== file._id)
        } else {
          return [...prev, file]
        }
      })
    } else {
      setSelectedFiles((prev) => {
        const exists = prev.find((f) => f._id === file._id)
        if (exists) {
          return prev.filter((f) => f._id !== file._id)
        } else {
          return [file]
        }
      })
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

  return (
    <div className="w-full">
      <Toolbar
        filters={filters}
        setFilters={(name, value) => {
          setFilters((prev) => ({
            ...prev,
            [name]: value,
            offset: 0, // Reset offset when any filter changes
          }))
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onUpload={handleUploadFile}
        storages={storages}
      />
      <Dropzone onUpload={(files) => handleUploadFile(files)}>
        <div className="relative w-full">
          {isError ? (
            <div>Error loading files: {error?.message}</div>
          ) : (
            <>
              <div className="my-2 flex flex-wrap items-center gap-2">
                <div className="rounded bg-gray-300 px-2 py-1 text-sm dark:bg-gray-700">
                  {`Total: ${allFiles?.length}/${totalItems}`}
                </div>
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
    </div>
  )
}

export default GalleryPage
