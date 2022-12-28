import { getLocalData, storeLocalData, clearAllLocalData } from './localStorage'

// const SESSION_STORAGE_KEYS = {}
const LOCAL_STORAGE_KEYS = {
  token: 'token',
  userId: 'user_id',
  userType: 'user_type',
  userFullName: 'name',
}

// set token
export const setToken = value => {
  storeLocalData(LOCAL_STORAGE_KEYS.token, JSON.stringify(value))
}

// get token
export const getToken = () => {
  const token = getLocalData(LOCAL_STORAGE_KEYS.token)
  return JSON.parse(token)
}

// set user id
export const setUserId = value => {
  storeLocalData(LOCAL_STORAGE_KEYS.userId, JSON.stringify(value))
}

// get user id
export const getUserId = () => {
  const userId = getLocalData(LOCAL_STORAGE_KEYS.userId)
  return JSON.parse(userId)
}

// set user type
export const setUserType = value => {
  storeLocalData(LOCAL_STORAGE_KEYS.userType, JSON.stringify(value))
}

// get user type
export const getUserType = () => {
  const userType = getLocalData(LOCAL_STORAGE_KEYS.userType)
  return JSON.parse(userType)
}

// set user full name
export const setUserFullName = value => {
  storeLocalData(LOCAL_STORAGE_KEYS.userFullName, JSON.stringify(value))
}

// get user full name
export const getUserFullName = () => {
  const userFullName = getLocalData(LOCAL_STORAGE_KEYS.userFullName)
  return JSON.parse(userFullName)
}

// signout
export const signOut = () => {
  clearAllLocalData()
}
