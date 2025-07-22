'use client'
import Loading from '@/components/Loading'
import { useUsers } from '@/requests/useUser'

export default function UsersPage() {
  const { data, isLoading, isError, error } = useUsers()

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Loading..." />
      </div>
    )
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in relative rounded border border-red-400 bg-red-100 px-4 py-2 text-center text-red-700">
          {typeof error === 'string' ? error : 'Failed to load users'}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:bg-gray-900/90">
        <h2 className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-300 dark:via-purple-300 dark:to-pink-300">
          Users
        </h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Username</th>
              <th className="border-b px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user: any) => (
              <tr key={user._id}>
                <td className="border-b px-4 py-2">{user.name}</td>
                <td className="border-b px-4 py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
