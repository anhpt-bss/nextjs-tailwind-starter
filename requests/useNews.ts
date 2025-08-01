import { useCustomQuery } from '@/hooks/useCustomQuery'
import type { NewsItemResponse } from '@/types/news.d'
import { requestGetNews } from '@/services/news.service'
import { useQueryClient } from '@tanstack/react-query'

export function useNews(options?: any) {
  const queryClient = useQueryClient()

  const fetchAndMergeNews = async () => {
    const newData = await requestGetNews()
    const oldData = queryClient.getQueryData<NewsItemResponse[]>(['news']) || []

    const result: NewsItemResponse[] = []
    const seen = new Set<string>()

    let i = 0 // pointer for oldData
    let j = 0 // pointer for newData

    const getGuid = (item: NewsItemResponse): string => {
      if (typeof item.guid === 'string') return item.guid
      if (item.guid && typeof item.guid === 'object' && '#text' in item.guid)
        return item.guid['#text']
      return item.link
    }

    const getTime = (item: NewsItemResponse) => {
      return new Date(item?.pubDate || '').getTime() || 0
    }

    while (i < oldData.length || j < newData.length) {
      const a = oldData[i]
      const b = newData[j]

      let pick: NewsItemResponse | null = null

      if (i >= oldData.length) {
        pick = b
        j++
      } else if (j >= newData.length) {
        pick = a
        i++
      } else {
        const aTime = getTime(a)
        const bTime = getTime(b)

        if (aTime >= bTime) {
          pick = a
          i++
        } else {
          pick = b
          j++
        }
      }

      const guid = getGuid(pick!)
      if (!seen.has(guid)) {
        seen.add(guid)
        result.push(pick!)
      }
    }

    return result
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
