import { combineReducers } from 'redux'

import app from 'modules/app/reducers'
import clients from 'modules/clients/reducers'
import updateRequests from 'modules/updateRequests/reducers'
import sales from 'modules/sales/reducers'
import complaints from 'modules/complaints/reducers'
import clientLogs from 'modules/clientLogs/reducers'
import projectSummary from 'modules/dashboard/projectSummary/reducers'
import dashboard from 'modules/dashboard/reducers'
import search from 'modules/search/reducers'
import pagination from 'modules/pagination/reducers'

const reducer = combineReducers({
  app,
  clients,
  updateRequests,
  sales,
  complaints,
  clientLogs,
  projectSummary,
  dashboard,
  search,
  pagination,
})

export default reducer
