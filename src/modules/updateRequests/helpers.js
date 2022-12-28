import UpdateRequestService from 'services/updateRequests'

export const fetchUpdateDetails = (pageNumber, pageSize, value, list) => {
  return async dispatch => {
    const response = await UpdateRequestService.updateRequestsListing(
      pageNumber,
      pageSize,
      value,
      list,
    )
    dispatch({ type: 'FETCH_UPDATE_REQUEST', payload: response })
  }
}
