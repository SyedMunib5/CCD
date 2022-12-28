import { getAuthToken } from 'libs/utils/oauth-token'

export const isLoggedIn = () => {
  const token = getAuthToken()
  if (token) {
    return true
  } else {
    return false
  }
}
