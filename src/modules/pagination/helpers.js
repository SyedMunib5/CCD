export const getPaginationApi = data => {
  return async dispatch => {
    dispatch({ type: 'PAGINATIONAPI', payload: data })
  }
}
export const removePaginationData = () => {
  return async dispatch => {
    dispatch({ type: 'REMOVE_PAGINATION_DATA' })
  }
}
