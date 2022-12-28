/**
 * Store session data based on key
 * @param key
 * @param value value to be stored
 */
const storeSessionData = (key, value) => {
  sessionStorage.setItem(key, value)
}

/**
 * Get session data based on key
 * @param key
 */
const getSessionData = key => sessionStorage.getItem(key)

/**
 * Clear all session data
 */
const clearAllSessionData = () => {
  sessionStorage.clear()
}

/**
 * Clear session data based on key
 * @param key
 */
const clearSessionData = key => {
  sessionStorage.removeItem(key)
}

export {
  storeSessionData,
  getSessionData,
  clearAllSessionData,
  clearSessionData,
}
