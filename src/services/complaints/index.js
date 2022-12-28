import Http from 'libs/utils/http'
import { API_ENDPOINTS } from 'libs/utils/apiEndPoints'

const API_COMPLAINT = API_ENDPOINTS.complaints
const complaintListing = async (pageNo, limit, query) => {
  try {
    const resp = await Http.get(API_COMPLAINT.getComplaints(pageNo, limit, query))
    return resp.data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const complaintDetail = async complaintId => {
  try {
    const resp = await Http.get(API_COMPLAINT.getComplaintById(complaintId))
    return resp.data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const addComment = async data => {
  try {
    const resp = await Http.post(API_COMPLAINT.addComment, data)
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const attachmentDownload = async id => {
  try {
    const resp = await Http.get(API_COMPLAINT.downloadDocument(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const getFullDate = date => {
  const dateAndTime = date.split('T')

  return dateAndTime[0]
    .split('-')
    .reverse()
    .join('-')
}

const ComplaintService = {
  complaintListing,
  complaintDetail,
  addComment,
  attachmentDownload,
  getFullDate,
}

export default ComplaintService
