export const searchPageNavigation = data => {
  return async dispatch => {
    dispatch({ type: 'NAVIGATIONAPI', payload: data })
  }
}
export const removeSearchData = () => {
  return async dispatch => {
    dispatch({ type: 'REMOVE_Search_DATA' })
  }
}
