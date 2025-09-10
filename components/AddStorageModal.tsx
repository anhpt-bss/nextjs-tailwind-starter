import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import InputField from '@/components/headlessui/Input'
import SelectField from '@/components/headlessui/Select'
import { decrypt } from '@/lib/encrypt'
import { useCreateStorage, useUpdateStorage } from '@/requests/useStorage'
import { StorageResponse } from '@/types/storage'
import { storageSchema } from '@/validators/storage.schema'

const schema = storageSchema
type StorageFormValues = z.infer<typeof schema>

type AddStorageModalProps = {
  onClose: () => void
  defaultValues?: StorageResponse
}

const AddStorageModal: React.FC<AddStorageModalProps> = ({ onClose, defaultValues }) => {
  const isEdit = !!defaultValues
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StorageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          platform: defaultValues.platform,
          owner: defaultValues.owner,
          repo: defaultValues.repo,
          token: defaultValues.token,
        }
      : undefined,
  })
  const { mutate: createStorage, isPending: isCreating } = useCreateStorage()
  const { mutate: updateStorage, isPending: isUpdating } = useUpdateStorage()

  React.useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        platform: defaultValues.platform,
        owner: defaultValues.owner,
        repo: defaultValues.repo,
        token: decrypt(defaultValues.token),
      })
    } else {
      reset({
        name: '',
        platform: undefined,
        owner: '',
        repo: '',
        token: '',
      })
    }
  }, [defaultValues, reset])

  const onSubmit = (data: StorageFormValues) => {
    if (isEdit && defaultValues?._id) {
      updateStorage(
        { _id: defaultValues._id, ...data },
        {
          onSuccess: () => {
            reset()
            onClose()
          },
        }
      )
    } else {
      createStorage(data, {
        onSuccess: () => {
          reset()
          onClose()
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField control={control} name="name" label="Name" placeholder="Storage name" required />
      <SelectField
        control={control}
        name="platform"
        label="Platform"
        required
        options={[
          { label: 'Choose platform...', value: '' },
          { label: 'GitHub', value: 'github' },
          { label: 'Cloudinary', value: 'cloudinary' },
          { label: 'Supabase', value: 'supabase' },
          { label: 'Imgur', value: 'imgur' },
          { label: 'Other', value: 'other' },
        ]}
      />
      <InputField
        control={control}
        name="owner"
        label="Owner"
        placeholder="Owner username or org"
        required
      />
      <InputField
        control={control}
        name="repo"
        label="Repository"
        placeholder="Repository name"
        required
      />
      <InputField
        control={control}
        name="token"
        label="Token"
        type="password"
        placeholder="Access token"
        required
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="cursor-pointer rounded bg-gray-300 px-3 py-1 font-semibold dark:bg-gray-700"
          onClick={onClose}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer rounded bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isCreating || isUpdating}
        >
          {isEdit ? (isUpdating ? 'Saving...' : 'Save') : isCreating ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default AddStorageModal
