import DashboardService from 'services/dashboard'

export const fetchTabData = (tabValue, page, pageSize, str) => {
  if (str !== '') {
    return async dispatch => {
      const dashboardTabResponse = await DashboardService.getTabData(tabValue, page, pageSize, str)

      dispatch({ type: 'FETCH_TAB_DATA', payload: dashboardTabResponse })
    }
  } else {
    return async dispatch => {
      const dashboardTabResponse = await DashboardService.getTabData(tabValue, page, pageSize)

      dispatch({ type: 'FETCH_TAB_DATA', payload: dashboardTabResponse })
    }
  }
}

export const removefetchTabData = () => {
  return async dispatch => {
    dispatch({ type: 'REMOVE_FETCH_TAB_DATA' })
  }
}
