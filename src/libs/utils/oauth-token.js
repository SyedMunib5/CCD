// import { get } from 'js-cookie'
import { getToken } from 'libs/utils/storage'

let authToken = null

function getAuthTokenWithoutCache () {
  if (process.env.NODE_ENV !== 'production') {
    authToken = getToken()
  } else {
    authToken = getToken()
    // authToken = get('__Secure-id_token') || get('__Secure-access_token') || null
  }
}

export function clearAuthTokenCache () {
  authToken = null
}

export function getAuthToken () {
  if (authToken == null) {
    getAuthTokenWithoutCache()
  }

  return authToken
}
