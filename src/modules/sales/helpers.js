import SalesService from 'services/sales'

export const fetchSales = (pageNumber, pageSize, value, list) => {
  return async dispatch => {
    const salesResponse = await SalesService.salesListing(pageNumber, pageSize, value, list)
    dispatch({ type: 'FETCHSALES', payload: salesResponse })
  }
}
export const fetchProjects = () => {
  return async dispatch => {
    const salesResponse = await SalesService.getSalesDropdown('project')
    dispatch({ type: 'GETPROJECTSAPI', payload: salesResponse })
  }
}
