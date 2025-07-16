// lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_URL || '' : '',
  withCredentials: true, // Enable cookies for cross-site requests
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') {
      config.headers = config.headers || {}
      config.headers['secret-key'] = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    }
    return config
  },
  (error) => {
    console.error('[Axios Request Error] Failed to send request:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error(
        `[Axios Response Error] Server responded with error status: ${error.response.status} from URL: ${error.config.url}`,
        error.response.data
      )
    } else if (error.request) {
      console.error(
        `[Axios Response Error] No response received for request to: ${error.config.url}. Request details:`,
        error.request
      )
    } else {
      console.error('[Axios Error] Something went wrong setting up the request:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
