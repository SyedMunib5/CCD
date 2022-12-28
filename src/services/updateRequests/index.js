import Http from 'libs/utils/http'
import { API_ENDPOINTS } from 'libs/utils/apiEndPoints'

const API_UDATEREQUEST = API_ENDPOINTS.updateRequests
const updateRequestsListing = async (pageNo, limit, query) => {
  try {
    const resp = await Http.get(API_UDATEREQUEST.getUpdateRequests(pageNo, limit, query))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}
const updateRequestsDetail = async id => {
  try {
    const resp = await Http.get(API_UDATEREQUEST.getUpdateRequestByCustId(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}
const updateRequestPatchDetails = async (id, bodyData) => {
  try {
    const resp = await Http.patch(API_UDATEREQUEST.patchRequestToUpdateCustomerRecord(id), {
      bodyData,
    })
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const cancelRequest = async bodyData => {
  try {
    const resp = await Http.patch(API_UDATEREQUEST.cancelRequest(), { ...bodyData })
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const updateRequestService = {
  updateRequestsListing,
  updateRequestPatchDetails,
  cancelRequest,
  updateRequestsDetail,
}

export default updateRequestService
