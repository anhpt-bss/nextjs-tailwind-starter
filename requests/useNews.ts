import { useCustomQuery } from '@/hooks/useCustomQuery'
import type { NewsItemResponse } from '@/types/news.d'
import { requestGetNews } from '@/services/news.service'
import { useQueryClient } from '@tanstack/react-query'

export function useNews(options?: any) {
  const queryClient = useQueryClient()

  const fetchAndMergeNews = async () => {
    const rawNewData = await requestGetNews()
    const oldData = queryClient.getQueryData<NewsItemResponse[]>(['news']) || []

    // --- Helper ---
    const normalizeGuid = (guid: string) => guid.trim().toLowerCase()

    const getGuid = (item: NewsItemResponse): string => {
      if (item?.link) return item?.link
      else if (typeof item.guid === 'string') return normalizeGuid(item.guid)
      else if (item.guid && typeof item.guid === 'object' && '#text' in item.guid)
        return normalizeGuid(item.guid['#text'])
      return ''
    }

    const getTime = (item: NewsItemResponse) => new Date(item?.pubDate || '').getTime() || 0

    // --- Step 1: Deduplicate newData using Map ---
    const newMap = new Map<string, NewsItemResponse>()

    for (const item of rawNewData) {
      const guid = getGuid(item)
      if (!guid || newMap.has(guid)) continue
      newMap.set(guid, item)
    }

    // Convert to array once deduplicated
    const newData = Array.from(newMap.values())

    // --- Step 2: Preprocess both lists with guid + time ---
    type PreparedItem = {
      item: NewsItemResponse
      guid: string
      time: number
    }

    const prepare = (data: NewsItemResponse[]): PreparedItem[] =>
      data.map((item) => ({
        item,
        guid: getGuid(item),
        time: getTime(item),
      }))

    const preparedOld = prepare(oldData)
    const preparedNew = prepare(newData)

    // --- Step 3: Merge like merge-sort with dedup ---
    const result: NewsItemResponse[] = []
    const seen = new Set<string>()
    let i = 0
    let j = 0

    while (i < preparedOld.length || j < preparedNew.length) {
      let pick: PreparedItem | null = null

      if (i >= preparedOld.length) {
        pick = preparedNew[j++]
      } else if (j >= preparedNew.length) {
        pick = preparedOld[i++]
      } else {
        if (preparedOld[i].time >= preparedNew[j].time) {
          pick = preparedOld[i++]
        } else {
          pick = preparedNew[j++]
        }
      }

      if (!seen.has(pick.guid)) {
        seen.add(pick.guid)
        result.push(pick.item)
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
