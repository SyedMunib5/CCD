/**
 * Store local data based on key
 * @param key
 * @param value value to be stored
 */
const storeLocalData = (key, value) => {
  localStorage.setItem(key, value)
}

/**
 * Get local data based on key
 * @param key
 */
const getLocalData = key => localStorage.getItem(key)

/**
 * Clear all local data
 */
const clearAllLocalData = () => {
  localStorage.clear()
}

/**
 * Clear local data based on key
 * @param key
 */
const clearLocalData = key => {
  localStorage.removeItem(key)
}

export { storeLocalData, getLocalData, clearAllLocalData, clearLocalData }
