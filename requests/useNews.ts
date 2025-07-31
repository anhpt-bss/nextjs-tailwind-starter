import { useCustomQuery } from '@/hooks/useCustomQuery'
import type { NewsItemResponse } from '@/types/news.d'
import { requestGetNews } from '@/services/news.service'
import { useQueryClient } from '@tanstack/react-query'

export function useNews(options?: any) {
  const queryClient = useQueryClient()

  const getGuid = (item: NewsItemResponse): string => {
    if (typeof item.guid === 'string') return item.guid
    if (item.guid && typeof item.guid === 'object' && '#text' in item.guid)
      return item.guid['#text']
    return item.link
  }

  const deduplicate = (items: NewsItemResponse[]): NewsItemResponse[] => {
    const seen = new Set<string>()
    return items.filter((item) => {
      const guid = item.link || getGuid(item)
      if (!guid) return true // fallback: keep
      if (seen.has(guid)) return false
      seen.add(guid)
      return true
    })
  }

  const fetchAndMergeNews = async () => {
    const newData = await requestGetNews()
    const oldData = queryClient.getQueryData<NewsItemResponse[]>(['news'])

    let mergedData: NewsItemResponse[]
    if (oldData) {
      const tempMerged = [...oldData, ...newData]
      mergedData = deduplicate(tempMerged)
    } else {
      mergedData = deduplicate(newData)
    }

    return mergedData
  }

  return useCustomQuery<NewsItemResponse[]>(['news'], fetchAndMergeNews, {
    ...options,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    refetchOnMount: false,
  })
}
