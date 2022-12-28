import Http from 'libs/utils/http'
import { API_ENDPOINTS } from 'libs/utils/apiEndPoints'

const API_DASHBOARD = API_ENDPOINTS.dashboard

const getProjectSummary = async () => {
  try {
    const resp = await Http.get(API_DASHBOARD.getProjectSummary)
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const getTabData = async (tabValue, page, pageSize, searchStr) => {
  try {
    const resp = await Http.get(API_DASHBOARD.getTabData(tabValue, page, pageSize, searchStr))
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const getDemoGraphics = async () => {
  try {
    const resp = await Http.get(API_DASHBOARD.getDemoGraphics)
    return (resp || {}).data || ((resp || {}).response || {}).data || {}
  } catch (error) {
    throw new Error(error)
  }
}

const DashboardService = {
  getTabData,
  getProjectSummary,
  getDemoGraphics,
}

export default DashboardService
