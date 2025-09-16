import { PhotoIcon } from '@heroicons/react/24/outline'
import { useRef, useState, useEffect } from 'react'

interface DropzoneProps {
  onUpload: (files: FileList) => void
  children: React.ReactNode
}

export default function Dropzone({ onUpload, children }: DropzoneProps) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files)
      e.dataTransfer.clearData()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Optional: only hide when leaving the root wrapper
    if (e.target === dropRef.current) {
      setIsDragging(false)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsDragging(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDragging])

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className="relative min-h-[50vh]"
    >
      {children}

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-100/70 dark:bg-blue-800/70">
          <PhotoIcon className="mb-2 h-10 w-10 text-blue-500" />
          <div className="font-medium text-gray-700 dark:text-gray-200">Click to select files</div>
          <div className="text-sm text-gray-400">Supported: images, documents, ...</div>
        </div>
      )}
    </div>
  )
}
