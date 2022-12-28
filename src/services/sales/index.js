import Http from 'libs/utils/http'
import { API_ENDPOINTS } from 'libs/utils/apiEndPoints'

const API_SALES = API_ENDPOINTS.sales
const salesListing = async (pageNo, limit, query) => {
  try {
    const resp = await Http.get(API_SALES.getSales(pageNo, limit, query))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}
const exportSalesListing = async (pageNo, limit, query, type = 'list') => {
  try {
    const resp = await Http.get(API_SALES.exportSalesListing(pageNo, limit, query, type), {
      responseType: 'blob',
    })
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}
const getSalesDropdown = async type => {
  try {
    const resp = await Http.get(API_SALES.getSalesDropdown(type))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const saleDetail = async id => {
  try {
    const resp = await Http.get(API_SALES.getSalesById(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const generateContract = async id => {
  try {
    const resp = await Http.get(API_SALES.generateContract(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const downloadContract = async id => {
  try {
    const resp = await Http.get(API_SALES.downloadContract(id), {
      responseType: 'blob',
    })
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}
const sendEmail = async id => {
  try {
    const resp = await Http.get(API_SALES.sendEmail(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const changeDocStatus = async (id, status) => {
  try {
    const resp = await Http.get(API_SALES.changeDocStatus(id, status))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const deleteDocument = async id => {
  try {
    const resp = await Http.delete(API_SALES.deleteDocument(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const downloadDocument = async id => {
  try {
    const resp = await Http.get(API_SALES.downloadDocument(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const uploadDoc = async (data, requestOptions) => {
  // console.log('service'+ data)
  try {
    const resp = await Http.post(API_SALES.uploadDoc, data, requestOptions)
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const SalesService = {
  salesListing,
  getSalesDropdown,
  saleDetail,
  generateContract,
  downloadContract,
  sendEmail,
  changeDocStatus,
  deleteDocument,
  downloadDocument,
  uploadDoc,
  exportSalesListing,
}

export default SalesService
