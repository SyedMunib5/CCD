import ClientLogsService from 'services/clients'

export const fetchClientLogs = (pageNumber, pageSize, list) => {
  return async dispatch => {
    const clientLogsResponse = await ClientLogsService.clientLogs(pageNumber, pageSize, list)
    dispatch({ type: 'FETCHUSERLOGS', payload: clientLogsResponse })
  }
}
