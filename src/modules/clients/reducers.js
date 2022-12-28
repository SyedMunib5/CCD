import { handleActions } from 'redux-actions'
import produce from 'immer'

import * as actions from './actions'

const initialState = {
  count: 0,
  fetchClientData: '',
  exportClientData: null,
  fetchClientDetails: '',
  fetchCustomerSales: '',
}

export default handleActions(
  {
    [actions.increment] (state, { payload }) {
      return produce(state, state => {
        state.count += payload
      })
    },

    [actions.decrement] (state, { payload }) {
      return produce(state, state => {
        state.count -= payload
      })
    },
    [actions.api] (state, { payload }) {
      return produce(state, state => {
        state.fetchClientData = payload
      })
    },
    [actions.apiForExport] (state, { payload }) {
      return produce(state, state => {
        state.exportClientData = payload
      })
    },
    [actions.customerSummaryApi] (state, { payload }) {
      return produce(state, state => {
        state.fetchClientDetails = payload
      })
    },
    [actions.CustomerSalesListingApi] (state, { payload }) {
      return produce(state, state => {
        state.fetchCustomerSales = payload
      })
    },
  },

  initialState,
)
