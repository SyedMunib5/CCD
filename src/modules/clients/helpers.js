import ClientsService from 'services/clients'

export const fetchClients = (pageNumber, pageSize, value, list) => {
  return async dispatch => {
    const clientsResponse = await ClientsService.clientsListing(pageNumber, pageSize, value, list)
    dispatch({ type: 'FETCHCLIENTS', payload: clientsResponse })
  }
}
export const exportClientsData = (pageNumber, pageSize, value, list) => {
  return async dispatch => {
    const clientsResponse = await ClientsService.exportClientsListing('', '', value, list)
    dispatch({ type: 'EXPORTFETCHCLIENTS', payload: clientsResponse })
  }
}
export const fetchCustomerSummary = id => {
  return async dispatch => {
    const clientsResponse = await ClientsService.customerSummary(id)
    dispatch({ type: 'GETCUSTOMERSUMMARY', payload: clientsResponse })
  }
}
export const fetchCustomerSalesListing = id => {
  return async dispatch => {
    const clientsResponse = await ClientsService.CustomerSalesListing(id)
    dispatch({ type: 'GETCUSTOMERSALES', payload: clientsResponse })
  }
}
