import React from 'react'
import { useState } from 'react'
import { DocumentIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useUploadFile } from '@/requests/useStoredFile'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadFileSchema } from '@/validators/storage.schema'
import InputField from '@/components/headlessui/Input'
import SelectField from '@/components/headlessui/Select'
import { StorageResponse, UploadFilePayload } from '@/types/storage'
import { fileToBase64 } from '@/utils/helper'

interface UploadModalProps {
  storages: StorageResponse[]
  selectedStorage?: StorageResponse['_id'] | null
  defaultFiles?: FileList | File[]
  onClose?: () => void
}

const UploadModal: React.FC<UploadModalProps> = ({
  storages,
  selectedStorage,
  defaultFiles,
  onClose,
}) => {
  const { mutate: uploadFile, isPending } = useUploadFile()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      storage: '',
      file_path: '',
    },
  })

  React.useEffect(() => {
    reset({
      storage: selectedStorage || '',
      file_path: '',
    })
    if (defaultFiles) {
      setSelectedFiles(Array.from(defaultFiles))
    } else {
      setSelectedFiles([])
    }
  }, [selectedStorage, reset])

  const onSubmit = async (values: any) => {
    if (selectedFiles.length === 0) {
      setError('base64_content', { message: 'File is required' })
      return
    }
    const payloads: UploadFilePayload[] = []
    for (const file of selectedFiles) {
      const base64_content = await fileToBase64(file)
      payloads.push({
        storage: values.storage,
        file_path: values.file_path,
        base64_content,
        file_name: file.name,
        file_extension: file.name.split('.').pop() || '',
        content_type: file.type,
        size: file.size,
      })
    }
    uploadFile(payloads, {
      onSuccess: () => {
        reset()
        setSelectedFiles([])
        onClose?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectField
        control={control}
        name="storage"
        label="Select Storage"
        required
        options={[
          { label: 'Choose storage...', value: '' },
          ...storages.map((s: any) => ({ label: s.name, value: s._id })),
        ]}
      />
      <InputField
        control={control}
        name="file_path"
        label="File Path"
        placeholder="e.g. folder/filename.txt"
        required
      />
      <div className="mb-4">
        <label htmlFor="file-input" className="mb-1 block font-medium">
          Files <span className="text-red-500">*</span>
        </label>
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById('file-input')?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              document.getElementById('file-input')?.click()
            }
          }}
        >
          <PhotoIcon className="mb-2 h-10 w-10 text-blue-500" />
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Click to select files
          </span>
          <span className="text-sm text-gray-400">Supported: images, documents, ...</span>
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onClick={(e) => {
            // Reset file input to allow re-uploading the same file
            ;(e.target as HTMLInputElement).value = ''
          }}
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            setSelectedFiles(files)
          }}
        />
        {errors.base64_content && (
          <div className="mt-1 text-sm text-red-500">{errors.base64_content.message as string}</div>
        )}
        {/* Preview list */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={file.name + idx}
                className="flex items-center gap-3 overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-md transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Icon or image */}
                {file.type.startsWith('image') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <DocumentIcon className="h-6 w-6 text-gray-400" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-500"
                  onClick={() => setSelectedFiles((files) => files.filter((_, i) => i !== idx))}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  )
}

export default UploadModal
