import axios from 'axios'

// import { BASE_URL } from 'libs/utils/constants'
import { getAuthToken } from 'libs/utils/oauth-token'
import { signOut } from './storage'

const instance = axios.create({
  // baseURL: `${BASE_URL}/api`, // uncomment for live envirnoment
  baseURL: '/api', // uncomment for local development envirnoment
  timeout: 30000,
  // withCredentials: true,
  headers: {
    common: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  },
})

// export function initAxiosInterceptors () {
instance.interceptors.request.use(config => {
  let shouldAddToken = false
  for (const keyword of API_KEYWORDS) {
    if (config.url.includes(keyword)) {
      shouldAddToken = true
      break
    }
  }

  if (shouldAddToken) {
    config.headers.Authorization = `Bearer ${getAuthToken()}`
  }

  return config
})

// jump to login page when backends response with status code 401
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      setTimeout(() => {
        signOut()
        window.location.href = '/'
      }, 1000)
    }

    return error
  },
)
// }

export default instance
