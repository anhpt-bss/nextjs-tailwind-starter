import { unstable_cache } from 'next/cache'

type CacheFnOptions = {
  revalidate?: number
  tags?: string[]
}

/**
 * Immediately call a server function with caching using `unstable_cache`.
 *
 * @param fn - Async function to wrap
 * @param keyPrefix - Static key prefix
 * @param keyDynamic - Dynamic key parts (e.g. userId)
 * @param options - Optional cache config
 * @returns Promise<Return> - Cached result
 */
export function cacheServerFn<Args extends any[], Return>(
  fn: (...args: Args) => Promise<Return>,
  keyPrefix: string[],
  keyDynamic: string[],
  options: CacheFnOptions = {}
): Promise<Return> {
  const key = [...keyPrefix, ...keyDynamic]
  const tags = options.tags ?? keyPrefix

  const fnWithLog = async (...args: Args): Promise<Return> => {
    console.log(`[Cache Executing]:`, key)
    return fn(...args)
  }

  const cached = unstable_cache(fnWithLog, key, {
    revalidate: options.revalidate ?? 300, // Default to 5 minutes
    tags,
  })

  return cached(...(keyDynamic as unknown as Args))
}
