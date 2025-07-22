import { DocumentIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import * as React from 'react'
import type { StoredFileResponse } from '../types/storage'
import MoreAction from './MoreAction'
import Loading from './Loading'
import { formatSize } from '@/utils/helper'

type GalleryListProps = {
  files: StoredFileResponse[]
  loading: boolean
  onPreview: (file: StoredFileResponse) => void
  onDeleteFile: (file: StoredFileResponse) => void
  selectedFiles?: StoredFileResponse[]
  onSelectFile?: (file: StoredFileResponse, event: React.MouseEvent) => void
}

const GalleryList: React.FC<GalleryListProps> = ({
  files,
  loading,
  onDeleteFile,
  onPreview,
  selectedFiles = [],
  onSelectFile,
}) => {
  return (
    <div className="flex w-full flex-col divide-y divide-gray-200 dark:divide-gray-800">
      {loading ? (
        <Loading text="Loading files..." />
      ) : files.length === 0 ? (
        <div className="py-4 text-center text-gray-400">No files found.</div>
      ) : (
        files.map((file) => {
          const id = (file._id as any)?.toString?.() || file.sha || file.file_name
          const isImage = file.content_type?.startsWith('image')
          const url = isImage ? file.preview_url || file.download_url : file.download_url
          const isSelected = selectedFiles.some((f) => f._id === file._id)
          return (
            <div
              key={id}
              className={
                `flex items-center gap-4 border-l-4 bg-white px-2 py-3 transition hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 ` +
                (isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-transparent')
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
                        onSelectFile(
                          file,
                          undefined as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
                        )
                      }
                    }
                  : undefined
              }
              style={{ cursor: onSelectFile ? 'pointer' : 'default' }}
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview(file)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onPreview(file)
                  }
                }}
              >
                {isImage && url ? (
                  <Image
                    src={url}
                    alt={file.file_name}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                ) : (
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-gray-800 dark:text-white">
                  {file.file_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">{file.content_type}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  {formatSize(file.size ?? 0)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  {file.updated_at ? new Date(file.updated_at).toLocaleString() : ''}
                </div>
              </div>
              <div className="flex-shrink-0">
                <MoreAction file={file} handleDelete={() => onDeleteFile(file)} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default GalleryList
