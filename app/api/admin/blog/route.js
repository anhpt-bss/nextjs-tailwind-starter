import fs from 'fs'
import path from 'path'

import { withAuth } from '@/middlewares/withAuth'

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')

function auth(req) {
  return req.userId && req.isAdmin
}

export const POST = withAuth(async (req) => {
  if (!auth(req)) return new Response('Unauthorized', { status: 401 })
  const { title, date, tags, summary, content, draft } = await req.json()
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: "${date}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    `summary: "${summary}"`,
    `draft: ${!!draft}`,
    '---',
    '',
  ].join('\n')
  fs.writeFileSync(filePath, frontmatter + content, 'utf8')
  return new Response(JSON.stringify({ success: true, slug }), { status: 201 })
})

export const GET = withAuth(async (req) => {
  if (!auth(req)) return new Response('Unauthorized', { status: 401 })
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')

  if (slug) {
    // Get a specific post
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return new Response('Not found', { status: 404 })
    const raw = fs.readFileSync(filePath, 'utf8')
    const match = raw.match(/---([\s\S]*?)---/)
    let front = {}
    if (match) {
      match[1].split('\n').forEach((line) => {
        const [k, ...v] = line.split(':')
        if (k && v) front[k.trim()] = v.join(':').trim().replace(/^"|"$/g, '')
      })
    }
    const content = raw.replace(/---([\s\S]*?)---/, '').trim()
    return new Response(
      JSON.stringify({
        post: {
          ...front,
          content,
          tags: front.tags ? JSON.parse(front.tags.replace(/'/g, '"')) : [],
        },
      }),
      { status: 200 }
    )
  }

  // Get all posts
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
    const match = raw.match(/---([\s\S]*?)---/)
    let front = {}
    if (match) {
      match[1].split('\n').forEach((line) => {
        const [k, ...v] = line.split(':')
        if (k && v) front[k.trim()] = v.join(':').trim().replace(/^"|"$/g, '')
      })
    }
    return {
      slug: f.replace('.mdx', ''),
      ...front,
      tags: front.tags ? JSON.parse(front.tags.replace(/'/g, '"')) : [],
    }
  })

  return new Response(JSON.stringify({ posts }), { status: 200 })
})

export const PUT = withAuth(async (req) => {
  if (!auth(req)) return new Response('Unauthorized', { status: 401 })
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return new Response('Missing slug', { status: 400 })
  const { title, date, tags, summary, content, draft } = await req.json()
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return new Response('Not found', { status: 404 })
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: "${date}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    `summary: "${summary}"`,
    `draft: ${!!draft}`,
    '---',
    '',
  ].join('\n')
  fs.writeFileSync(filePath, frontmatter + content, 'utf8')
  return new Response(JSON.stringify({ success: true, slug }), { status: 200 })
})

export const DELETE = withAuth(async (req) => {
  if (!auth(req)) return new Response('Unauthorized', { status: 401 })
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return new Response('Missing slug', { status: 400 })
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return new Response('Not found', { status: 404 })
  fs.unlinkSync(filePath)
  return new Response(JSON.stringify({ success: true, slug }), { status: 200 })
})
