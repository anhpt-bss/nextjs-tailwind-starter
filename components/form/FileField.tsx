import Image from 'next/image'
import React, { useRef } from 'react'
import { useController, Control } from 'react-hook-form'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ResourceResponse } from '@/types/resource'

interface FileFieldProps {
  name: string
  control: Control<any>
  label?: string
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  note?: string
  defaultFile?: ResourceResponse[]
}

export const FileField: React.FC<FileFieldProps> = ({
  name,
  control,
  label,
  accept = 'image/*',
  maxSizeMB = process.env.UPLOAD_MAX_SIZE_MB ? Number(process.env.UPLOAD_MAX_SIZE_MB) : 20,
  multiple = false,
  note,
  defaultFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control })

  // Preview files
  const previews: string[] = []
  if (value) {
    if (Array.isArray(value)) {
      value.forEach((f) => {
        if (f instanceof File) previews.push(URL.createObjectURL(f))
      })
    } else if (value instanceof File) {
      previews.push(URL.createObjectURL(value))
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const arr = Array.from(files)
    // Validate size
    const valid = arr.filter((f) => f.size <= maxSizeMB * 1024 * 1024)
    onChange(multiple ? valid : valid[0] || null)
  }

  const handleRemove = (idx: number) => {
    if (Array.isArray(value)) {
      const newArr = value.filter((_: any, i: number) => i !== idx)
      onChange(newArr.length ? newArr : null)
    } else {
      onChange(null)
    }
  }

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed bg-gray-50 p-4 text-center hover:bg-gray-100"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = ''
                inputRef.current?.click()
              }}
              aria-hidden="true"
            >
              <div className="mb-2 text-gray-500">
                {note || `Only accept files of type ${accept}, max size ${maxSizeMB}MB.`}
              </div>
              <Input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={handleFiles}
              />
              <span className="font-medium text-blue-600">Choose file here</span>
            </div>
          </FormControl>
          <FormMessage />
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative h-24 w-24 overflow-hidden rounded border">
                <Image src={src} alt="preview" fill className="object-cover" />
                <button
                  type="button"
                  className="absolute top-1 right-1 rounded-full bg-white p-1 text-xs shadow"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(idx)
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {defaultFile && (
            <div className="mt-3 flex flex-wrap gap-2">
              {defaultFile.map((item, idx) => (
                <div key={idx} className="relative h-24 w-24 overflow-hidden rounded border">
                  <Image src={item.path} alt="preview" sizes="fill" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </FormItem>
      )}
    />
  )
}

export default React.memo(FileField)
