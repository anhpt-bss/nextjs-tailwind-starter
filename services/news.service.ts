import type { NewsItemResponse } from '@/types/news.d'
import api from '@/lib/axios'

export const requestGetNews = async (): Promise<NewsItemResponse[]> => {
  const res = await api.get('/api/rss')
  if (!res.data.success) throw res.data
  return res.data.data
}
