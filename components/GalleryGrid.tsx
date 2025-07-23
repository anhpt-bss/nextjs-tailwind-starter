import { StoredFileResponse } from '@/types/storage'
import { DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import MoreAction from './MoreAction'
import Loading from './Loading'
import { formatSize, getFilePreviewIconOrImage } from '@/utils/helper'

interface GalleryGridProps {
  files: StoredFileResponse[]
  loading: boolean
  onPreview: (file: StoredFileResponse) => void
  onDeleteFile: (file: StoredFileResponse) => void
  selectedFiles?: StoredFileResponse[]
  onSelectFile?: (file: StoredFileResponse, event: React.MouseEvent) => void
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  files,
  loading,
  onPreview,
  onDeleteFile,
  selectedFiles = [],
  onSelectFile,
}) => {
  return (
    <>
      {loading ? (
        <Loading text="Loading files..." />
      ) : files.length === 0 ? (
        <div className="col-span-full text-center text-gray-400">No files found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {files?.map((file, index) => {
            const isSelected = selectedFiles.some((f) => f._id === file._id)

            return (
              <div
                key={`${file._id}-${index}`}
                className={
                  `flex flex-col overflow-hidden rounded-xl border bg-white shadow-md transition hover:shadow-lg dark:bg-gray-900 ` +
                  (isSelected
                    ? 'border-blue-500 ring-2 ring-blue-400 dark:ring-blue-500'
                    : 'border-gray-100 dark:border-gray-800')
                }
                role={onSelectFile ? 'button' : undefined}
                tabIndex={onSelectFile ? 0 : undefined}
                onClick={
                  onSelectFile
                    ? (e) => {
                        e.stopPropagation()
                        onSelectFile(file, e)
                      }
                    : undefined
                }
                onKeyDown={
                  onSelectFile
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelectFile(file, e as any)
                        }
                      }
                    : undefined
                }
                style={{ cursor: onSelectFile ? 'pointer' : 'default' }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-2 py-2 dark:border-gray-800">
                  <div className="flex w-[calc(100%-30px)] items-center gap-2">
                    {getFilePreviewIconOrImage(file, 20, false)}

                    <span
                      className="max-w-[90%] truncate text-sm font-medium text-gray-800 dark:text-white"
                      title={file.file_name}
                    >
                      {file.file_name}
                    </span>
                  </div>

                  <MoreAction file={file} handleDelete={() => onDeleteFile(file)} />
                </div>

                {/* Card Body */}
                <div
                  className="flex min-h-[140px] flex-1 cursor-pointer items-center justify-center bg-gray-50 dark:bg-gray-800"
                  role="button"
                  tabIndex={0}
                  onClick={() => onPreview(file)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onPreview(file)
                    }
                  }}
                >
                  {file.content_type?.startsWith('image') ? (
                    <div className="relative h-full min-h-[120px] w-full">
                      <Image
                        src={file.preview_url || file.download_url}
                        alt={file.file_name}
                        fill
                        className="rounded object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={false}
                      />
                    </div>
                  ) : (
                    getFilePreviewIconOrImage(file, 100)
                  )}
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-2 py-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                  <span>{formatSize(file.size || 0)}</span>
                  <span>{dayjs(file?.updated_at)?.format('DD/MM/YYYY HH:mm:ss')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default GalleryGrid
