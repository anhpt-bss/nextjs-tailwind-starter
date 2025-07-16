'use client'
import { useProfile, useUpdateProfile } from '@/requests/useUser'
import { useState, useEffect } from 'react'
import IconEdit from '@/components/IconEdit'
import { useLogout } from '@/requests/useAuth'
import Link from 'next/link'

const initialProfile = {
  name: '',
  email: '',
  phone_number: '',
  address: '',
  gender: '',
  birthday: '',
}

export default function ProfilePage() {
  const { data, isLoading, isError, error } = useProfile()
  const { mutate: updateProfile } = useUpdateProfile({
    successMessage: 'Profile updated!',
  })
  const { mutate: logout, isPending: isLogoutPending } = useLogout({
    redirectUrl: '/login',
  })
  const [form, setForm] = useState(initialProfile)
  const [editField, setEditField] = useState<string | null>(null)
  const [tempForm, setTempForm] = useState(initialProfile)

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        address: data.address || '',
        gender: data.gender || '',
        birthday: data.birthday || '',
      })
      setTempForm({
        name: data.name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        address: data.address || '',
        gender: data.gender || '',
        birthday: data.birthday || '',
      })
    }
  }, [data])

  const handleEdit = (field: string) => setEditField(field)
  const handleCancel = () => {
    setEditField(null)
    setTempForm(form)
  }
  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempForm({ ...tempForm, [e.target.name]: e.target.value })
  }
  const handleSave = (field: string) => {
    if (form[field] !== tempForm[field]) {
      const updated = { ...form, [field]: tempForm[field] }
      setForm(updated)
      updateProfile(updated)
    }
    setEditField(null)
  }

  const handleLogout = () => {
    logout(undefined)
  }

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex animate-pulse items-center gap-2 text-blue-600 dark:text-blue-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading profile...
        </div>
      </div>
    )
  if (isError)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl bg-white/80 px-6 py-4 text-red-600 shadow-lg dark:bg-gray-900/80">
          {typeof error === 'string' ? error : 'Failed to load profile'}
        </div>
      </div>
    )

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:bg-gray-900/90">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={data?.avatar || '/static/images/default-avatar.jpg'}
              alt="Avatar"
              className="h-24 w-24 rounded-full border-4 border-blue-400 bg-white object-cover shadow-lg"
            />
            {/* Avatar edit icon (optional) */}
          </div>
          <h2 className="mt-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300">
            {form.name}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {data?.is_admin ? 'Admin' : 'User'}
          </span>
        </div>
        <div className="space-y-4">
          {/* Name */}
          <ProfileField
            label="Name"
            value={form.name}
            field="name"
            editField={editField}
            tempValue={tempForm.name}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChange={handleTempChange}
            onSave={handleSave}
          />
          {/* Email */}
          <ProfileField
            label="Email"
            value={form.email}
            field="email"
            editField={editField}
            tempValue={tempForm.email}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChange={handleTempChange}
            onSave={handleSave}
          />
          {/* Phone */}
          <ProfileField
            label="Phone number"
            value={form.phone_number}
            field="phone_number"
            editField={editField}
            tempValue={tempForm.phone_number}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChange={handleTempChange}
            onSave={handleSave}
          />
          {/* Address */}
          <ProfileField
            label="Address"
            value={form.address}
            field="address"
            editField={editField}
            tempValue={tempForm.address}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChange={handleTempChange}
            onSave={handleSave}
          />
          {/* Gender */}
          <ProfileField
            label="Gender"
            value={form.gender}
            field="gender"
            editField={editField}
            tempValue={tempForm.gender}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChange={handleTempChange}
            onSave={handleSave}
          />
          {/* Birthday */}
          <ProfileField
            label="Birthday"
            value={form.birthday}
            field="birthday"
            editField={editField}
            tempValue={tempForm.birthday}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChange={handleTempChange}
            onSave={handleSave}
          />
        </div>
        <button
          onClick={handleLogout}
          disabled={isLogoutPending}
          className="mt-8 block w-full rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-center font-semibold text-white transition-colors hover:from-red-600 hover:to-pink-600"
        >
          {isLogoutPending ? 'Signing out...' : 'Sign Out'}
        </button>

        {data?.is_admin && (
          <Link href="/admin" className="mt-4 block text-center text-blue-600 hover:underline">
            Admin Dashboard
          </Link>
        )}
      </div>
    </div>
  )
}

// ProfileField component
function ProfileField({
  label,
  value,
  field,
  editField,
  tempValue,
  onEdit,
  onCancel,
  onChange,
  onSave,
}: any) {
  return (
    <div className="group flex items-center">
      <span className="w-32 font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      {editField === field ? (
        <>
          <input
            name={field}
            value={tempValue}
            onChange={onChange}
            className="flex-1 border-b border-blue-400 bg-transparent px-2 py-1 text-gray-900 outline-none dark:text-white"
            autoFocus
          />
          <button
            type="button"
            onClick={() => onSave(field)}
            className="ml-2 font-semibold text-green-600 hover:text-green-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-gray-900 dark:text-white">
            {value || <span className="text-gray-400 italic">Not set</span>}
          </span>
          <button
            type="button"
            onClick={() => onEdit(field)}
            className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
            title={`Edit ${label}`}
          >
            <IconEdit className="h-5 w-5 text-blue-500 hover:text-blue-700" />
          </button>
        </>
      )}
    </div>
  )
}
