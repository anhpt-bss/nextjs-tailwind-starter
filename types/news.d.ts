export interface NewsEnclosure {
  '@_type'?: string
  '@_length'?: string
  '@_url'?: string
}

export interface NewsItemResponse {
  source: string
  url: string
  title: string
  description?: string
  pubDate?: string
  link: string
  guid?: string
  enclosure?: NewsEnclosure
  [key: string]: unknown
}
