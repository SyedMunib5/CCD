import Http from 'libs/utils/http'
import { API_ENDPOINTS } from 'libs/utils/apiEndPoints'

const API_CLIENTS = API_ENDPOINTS.clients
const clientsListing = async (pageNo, limit, query, type = 'list') => {
  try {
    const resp = await Http.get(API_CLIENTS.getCustomers(pageNo, limit, query, type))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const exportClientsListing = async (pageNo, limit, query, type = 'list') => {
  try {
    const resp = await Http.get(API_CLIENTS.exportCustomers(pageNo, limit, query, type), {
      responseType: 'blob',
    })
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}
const clientLogs = async (pageNo, limit, query) => {
  try {
    const resp = await Http.get(API_CLIENTS.getClientLogs(pageNo, limit, query))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const clientsDetail = async id => {
  try {
    const resp = await Http.get(API_CLIENTS.getCustomerById(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const updateClient = async (data, id) => {
  try {
    const resp = await Http.patch(API_CLIENTS.updateClient + '/' + id, data)
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const getSalesByCustomerId = async id => {
  try {
    const resp = await Http.get(API_CLIENTS.getSalesByCsutomerId(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const customerSummary = async id => {
  try {
    const resp = await Http.get(API_CLIENTS.getCustomerSummary(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const CustomerSalesListing = async id => {
  try {
    const resp = await Http.get(API_CLIENTS.getCustomerSalesListing(id))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const ClientsService = {
  clientsListing,
  clientsDetail,
  updateClient,
  getSalesByCustomerId,
  clientLogs,
  exportClientsListing,
  customerSummary,
  CustomerSalesListing,
}

export default ClientsService
