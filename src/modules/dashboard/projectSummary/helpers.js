import DashboardService from 'services/dashboard'

export const fetchProjectSummary = (pageNumber, pageSize, value, list) => {
  return async dispatch => {
    const projectSummaryResponse = await DashboardService.getProjectSummary()

    dispatch({ type: 'FETCH_PROJECT_SUMMARY', payload: projectSummaryResponse })
  }
}
