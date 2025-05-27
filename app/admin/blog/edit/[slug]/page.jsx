'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function BlogEdit() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug
  const [form, setForm] = useState({
    title: '',
    date: '',
    tags: '',
    summary: '',
    content: '',
    draft: false,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) router.push('/admin/login')

    fetch(`/api/admin/blog?slug=${slug}`, {
      headers: { Authorization: 'Basic ' + sessionStorage.getItem('admin_auth') },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.post) {
          setForm({
            title: data.post.title,
            date: data.post.date,
            tags: data.post.tags.join(', '),
            summary: data.post.summary,
            content: data.post.content,
            draft: !!data.post.draft,
          })
        }
      })
  }, [router, slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const res = await fetch(`/api/admin/blog?slug=${slug}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + sessionStorage.getItem('admin_auth'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...form, tags }),
    })
    if (res.ok) {
      setMessage('Blog post updated!')
      setTimeout(() => router.push('/admin/blog'), 1000)
    } else setMessage('Error updating post')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full rounded-xl border border-blue-100 bg-white/90 p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900/90">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-blue-700 drop-shadow dark:text-blue-400">
          Edit Blog Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <input
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <textarea
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Content (markdown/mdx)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={10}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.draft}
              onChange={(e) => setForm({ ...form, draft: e.target.checked })}
            />{' '}
            Draft
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-gradient-to-r from-blue-600 to-green-500 px-4 py-2 font-semibold text-white shadow transition hover:from-blue-700 hover:to-green-600"
            >
              Update Post
            </button>
            <Link
              href="/admin/blog"
              className="rounded bg-gradient-to-r from-gray-200 to-blue-100 px-4 py-2 text-gray-700 shadow transition hover:from-gray-300 hover:to-blue-200 dark:from-gray-800 dark:to-blue-900 dark:text-white"
            >
              Back to List
            </Link>
          </div>
        </form>
        {message && <div className="mt-4 text-center text-green-600">{message}</div>}
      </div>
    </div>
  )
}
