import Http from 'libs/utils/http'
import { API_ENDPOINTS } from 'libs/utils/apiEndPoints'

const login = async credentials => {
  try {
    const resp = await Http.post(API_ENDPOINTS.login, credentials)
    return (resp && resp.data) || {}
  } catch (error) {
    throw new Error(error)
  }
}

const updatePassword = async credentials => {
  try {
    const resp = await Http.patch(API_ENDPOINTS.updatePassword, credentials)
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const LoginService = {
  login,
  updatePassword,
}

export default LoginService
