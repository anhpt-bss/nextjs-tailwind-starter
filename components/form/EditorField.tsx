'use client'

import dynamic from 'next/dynamic'
import React, { useRef } from 'react'
import { useController, Control } from 'react-hook-form'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import siteMetadata from '@/data/siteMetadata'
import { defaultJoditConfig } from '@/lib/jodit'
import { uploadFileAndSaveResource } from '@/requests/useResource'
import { StorageResponse } from '@/types/storage'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

interface EditorFieldProps {
  name: string
  control: Control<any>
  label?: string
  placeholder?: string
  config?: object
  height?: number | string
  uploadType?: 'base64' | 'api'
  uploadUrl?: string
  cloudStorage?: StorageResponse
}

export const EditorField: React.FC<EditorFieldProps> = ({
  name,
  control,
  label,
  placeholder = 'Enter content...',
  config,
  height = '50vh',
  uploadType = 'api',
  uploadUrl = '/api/upload',
  cloudStorage,
}) => {
  const editor = useRef<any>(null)

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control })

  const joditConfig = React.useMemo(() => {
    const baseConfig = {
      ...defaultJoditConfig,
      ...config,
      placeholder,
      height,
    }

    if (siteMetadata.upload.provider === 'local') {
      return {
        ...baseConfig,
        uploader: {
          ...defaultJoditConfig.uploader,
          insertImageAsBase64URI: uploadType === 'base64',
          url: uploadUrl,
        },
      }
    }

    return {
      ...baseConfig,
      uploader: {
        ...defaultJoditConfig.uploader,
        insertImageAsBase64URI: false,
        url: '/api/resources',
        method: 'GET',

        buildData: async (formData: FormData) => {
          const files: File[] = []
          formData.forEach((v) => {
            if (v instanceof File) files.push(v)
          })

          const results: string[] = []
          for (const file of files) {
            const resource = await uploadFileAndSaveResource(file, cloudStorage!)
            if (resource) results.push(resource?._id)
          }

          if (results?.length >= 0) {
            return { id: results?.join() }
          } else {
            return { id: 'error' }
          }
        },

        queryBuild: function (data) {
          return new URLSearchParams(data).toString()
        },

        isSuccess: (resp) => {
          return !!resp && resp.success !== false
        },

        process: (resp) => {
          return {
            ...resp,
            data: resp?.data?.items || [],
          }
        },
      },
    }
  }, [placeholder, height, config, uploadType, uploadUrl, cloudStorage])

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <JoditEditor
              ref={editor}
              value={value || ''}
              config={joditConfig}
              onBlur={(newContent: string) => onChange(newContent)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default EditorField
