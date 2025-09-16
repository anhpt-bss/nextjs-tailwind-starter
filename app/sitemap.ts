import { MetadataRoute } from 'next'

import siteMetadata from '@/data/siteMetadata'
import { allBlogs } from 'contentlayer/generated'
import blogs from 'staticData/blog.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const mongoBlogRoutes = blogs.map((post) => ({
    url: `${siteUrl}/feed/${post.slug}`,
    lastModified: post.created_time || new Date().toISOString(),
  }))

  const routes = ['', 'blog', 'feed', 'gallery'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...mongoBlogRoutes]
}
