import clsx from 'clsx'
import * as React from 'react'
import type { StoredFileResponse } from '../types/storage'
import MoreAction from './MoreAction'
import Loading from './Loading'
import Empty from './Empty'
import { formatSize, getFilePreviewIconOrImage } from '@/utils/helper'
import dayjs from 'dayjs'

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
    <div className="flex w-full flex-col gap-2 divide-y divide-gray-200 dark:divide-gray-800">
      {loading ? (
        <Loading text="Loading files..." />
      ) : files.length === 0 ? (
        <Empty title="No Files Found" description="There are no files in this list." />
      ) : (
        files.map((file, index) => {
          const isSelected = selectedFiles.some((f) => f._id === file._id)

          return (
            <div
              key={`${file._id}-${index}`}
              className={clsx(
                `flex items-center gap-2 rounded-sm border bg-gray-200 px-2 py-2 transition hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800`,
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-400 select-none dark:ring-blue-500'
                  : 'border-transparent'
              )}
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
                {getFilePreviewIconOrImage(file, 48)}
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
                  {dayjs(file.updated_at).format('DD/MM/YYYY HH:mm:ss')}
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
