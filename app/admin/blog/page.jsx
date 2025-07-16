'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/blog', {
      headers: { Authorization: 'Basic ' + sessionStorage.getItem('admin_auth') },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
  }, [router])

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const res = await fetch(`/api/admin/blog?slug=${slug}`, {
      method: 'DELETE',
      headers: { Authorization: 'Basic ' + sessionStorage.getItem('admin_auth') },
    })
    if (res.ok) {
      setPosts(posts.filter((p) => p.slug !== slug))
      setMessage('Post deleted successfully.')
    } else alert('Delete failed')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto w-full rounded-xl border border-blue-100 bg-white/90 p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-blue-700 drop-shadow dark:text-blue-400">
            Blog Posts
          </h2>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded bg-gradient-to-r from-gray-200 to-blue-100 px-4 py-2 text-gray-700 shadow transition hover:from-gray-300 hover:to-blue-200 dark:from-gray-800 dark:to-blue-900 dark:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/blog/create"
              className="rounded bg-gradient-to-r from-blue-600 to-green-500 px-4 py-2 text-white shadow transition hover:from-blue-700 hover:to-green-600"
            >
              Create New
            </Link>
          </div>
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-50 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Tags</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.slug}
                className="border-b hover:bg-blue-50/50 dark:hover:bg-gray-900/50"
              >
                <td className="px-4 py-2">{post.title}</td>
                <td className="px-4 py-2">{post.date}</td>
                <td className="px-4 py-2">{post.tags?.join(', ')}</td>
                <td className="flex gap-2 px-4 py-2">
                  <Link
                    href={`/admin/blog/edit/${post.slug}`}
                    className="rounded bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 text-white shadow transition hover:from-yellow-500 hover:to-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="rounded bg-gradient-to-r from-red-600 to-red-500 px-3 py-1 text-white shadow transition hover:from-red-700 hover:to-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && <div className="mt-4 text-center text-green-600">{message}</div>}
      </div>
    </div>
  )
}
