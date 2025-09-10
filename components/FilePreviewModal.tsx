import { DocumentIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { StoredFileResponse } from '@/types/storage'

interface FilePreviewModalProps {
  file: StoredFileResponse
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file }) => {
  if (!file) return null
  const type = file.content_type || ''
  const url = file.preview_url || file.download_url

  return (
    <div className="relative flex h-full min-h-[70vh] w-full items-center justify-center">
      {/* Image */}
      {type.startsWith('image') && (
        <Image src={url} alt={file.file_name} fill className="rounded object-contain" />
      )}
      {/* PDF */}
      {type === 'application/pdf' && (
        <iframe
          src={url}
          title={file.file_name}
          className="h-full min-h-[70vh] w-full rounded border"
        />
      )}
      {/* Text */}
      {type.startsWith('text') && (
        <iframe
          src={url}
          title={file.file_name}
          className="h-full min-h-[70vh] w-full rounded border bg-white dark:bg-gray-900"
        />
      )}
      {/* Audio */}
      {type.startsWith('audio') && (
        <audio controls src={url} className="w-full">
          <track kind="captions" />
          Your browser does not support the audio element.
        </audio>
      )}
      {/* Video */}
      {type.startsWith('video') && (
        <video controls src={url} className="max-h-[60vh] w-full rounded">
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Unknown type */}
      {!type.startsWith('image') &&
        !type.startsWith('audio') &&
        !type.startsWith('video') &&
        type !== 'application/pdf' &&
        !type.startsWith('text') && (
          <div
            className="flex h-full w-full flex-col items-center justify-center"
            role="button"
            tabIndex={0}
            onClick={() => window.open(url, '_blank')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.open(url, '_blank')
              }
            }}
          >
            <DocumentIcon className="mb-4 h-16 w-16 text-gray-400" />
            <div className="text-lg font-medium text-gray-800 dark:text-white">
              {file.file_name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-300">{type}</div>
          </div>
        )}
    </div>
  )
}

export default FilePreviewModal
