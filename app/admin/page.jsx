'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()

  // useEffect(() => {
  //   if (!sessionStorage.getItem('admin_auth')) {
  //     router.push('/admin/login')
  //   }
  // }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-2xl rounded-xl border border-blue-100 bg-white/90 p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900/90">
        <h1 className="mb-6 text-center text-4xl font-extrabold text-blue-700 drop-shadow dark:text-blue-400">
          Admin Dashboard
        </h1>
        <div className="mb-8 flex flex-col justify-center gap-4 md:flex-row">
          <Link
            href="/admin/blog"
            className="flex-1 rounded bg-gradient-to-r from-blue-600 to-green-500 py-3 text-center font-semibold text-white shadow transition hover:from-blue-700 hover:to-green-600"
          >
            Manage Blog Posts
          </Link>
          <Link
            href="/admin/blog/create"
            className="flex-1 rounded bg-gradient-to-r from-green-500 to-blue-600 py-3 text-center font-semibold text-white shadow transition hover:from-green-600 hover:to-blue-700"
          >
            Create New Post
          </Link>
        </div>
        <div className="mb-2 text-center text-gray-500 dark:text-gray-400">
          Welcome to the admin dashboard. Use the buttons above to manage your blog.
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {
              router.push('/')
            }}
            className="mt-2 cursor-pointer rounded bg-red-100 px-3 py-1 text-xs text-red-700 transition hover:bg-red-700 dark:bg-red-900/60 dark:text-red-300"
          >
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  )
}
