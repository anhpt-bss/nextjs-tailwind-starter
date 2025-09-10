// Script: feed.mjs
// Export blogs from MongoDB, save as blog.json and feed.xml inside Next.js folder

import 'dotenv/config'
import siteMetadata from '../data/siteMetadata.js'
import fs from 'fs'
import path from 'path'
import mongoose, { Schema } from 'mongoose'
import { fileURLToPath } from 'url'

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define simplified Blog schema for feed
const BlogSchema = new Schema(
  {
    title: String,
    summary: String,
    slug: String,
    banner: { type: Schema.Types.ObjectId, ref: 'Resource' },
    content: String,
    created_by: String,
    created_time: Date,
    tags: [String],
  },
  { collection: 'blogs' }
)

const ResourceSchema = new Schema(
  {
    path: String,
  },
  { collection: 'resources' }
)

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema)

// MongoDB URI
const MONGO_URI = process.env.MONGODB_URI

// Output folder
const DATA_OUTPUT_DIR = path.join(__dirname, '../.staticData')
const PUBLIC_OUTPUT_DIR = path.join(__dirname, '../public')
const BLOG_JSON_PATH = path.join(DATA_OUTPUT_DIR, 'blog.json')
const FEED_XML_PATH = path.join(PUBLIC_OUTPUT_DIR, 'feed.xml')

// Escape HTML
function escape(str) {
  return str.replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  })
}

function generateRssItem(config, post) {
  return `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.banner ? `<enclosure url="${config.siteUrl}${post.banner}" type="image/jpeg"/>` : ''}
    ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.created_time).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    <category>Blog</category>
  </item>`
}

function generateRss(config, posts) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(config.title)}</title>
    <link>${config.siteUrl}/blog</link>
    <description>${escape(config.description)}</description>
    <language>${config.language || 'en'}</language>
    <managingEditor>${config.email} (${config.author})</managingEditor>
    <webMaster>${config.email} (${config.author})</webMaster>
    <lastBuildDate>${
      posts.length ? new Date(posts[0].created_time).toUTCString() : new Date().toUTCString()
    }</lastBuildDate>
    <atom:link href="${config.siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map((post) => generateRssItem(config, post)).join('')}
  </channel>
</rss>`
}

async function feed() {
  await mongoose.connect(MONGO_URI)

  const blogs = await Blog.find({}).sort({ created_time: -1 }).populate('banner').lean()

  const blogsForExport = blogs.map((blog) => ({
    title: blog.title,
    summary: blog.summary,
    slug: blog.slug,
    banner: blog.banner && blog.banner.path ? blog.banner.path : '',
    // content: blog.content,
    created_by: blog.created_by,
    created_time: blog.created_time,
  }))

  // Ensure output directory exists
  fs.mkdirSync(DATA_OUTPUT_DIR, { recursive: true })
  fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true })

  // Save blog.json
  fs.writeFileSync(BLOG_JSON_PATH, JSON.stringify(blogsForExport, null, 2))
  console.log('✅ Saved blog.json in .staticData/')

  // Generate feed.xml
  const rss = generateRss(siteMetadata, blogsForExport)
  fs.writeFileSync(FEED_XML_PATH, rss)
  console.log('✅ Generated feed.xml in public/')

  await mongoose.disconnect()
}

feed().catch((err) => {
  console.error(err)
  process.exit(1)
})
