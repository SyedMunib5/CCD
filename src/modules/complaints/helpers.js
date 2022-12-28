import ComplaintService from 'services/complaints'

export const fetchComplaints = (pageNumber, pageSize, list) => {
  return async dispatch => {
    const clientsResponse = await ComplaintService.complaintListing(pageNumber, pageSize, list)
    dispatch({ type: 'FETCHCOMPLAINTS', payload: clientsResponse })
  }
}
