'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_auth', btoa(`${credentials.username}:${credentials.password}`))
      router.push('/admin')
    } else {
      setMessage('Wrong username or password')
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white/90 p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900/90">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-blue-700 drop-shadow dark:text-blue-400">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          <input
            className="w-full rounded border bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-gradient-to-r from-blue-600 to-green-500 py-2 font-semibold text-white shadow transition hover:from-blue-700 hover:to-green-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <Link href="/admin" className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Dashboard
          </Link>
        </div>
        {message && <div className="mt-4 text-center text-red-500">{message}</div>}
      </div>
    </div>
  )
}
