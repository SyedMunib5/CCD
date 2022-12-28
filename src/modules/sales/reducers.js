import { handleActions } from 'redux-actions'
import produce from 'immer'

import * as actions from './actions'

const initialState = {
  count: 0,
  fetchSalesData: '',
  fetchProjectsData: '',
  getProjects: '',
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
    [actions.apiSale] (state, { payload }) {
      return produce(state, state => {
        state.fetchSalesData = payload
      })
    },
    [actions.projectsApi] (state, { payload }) {
      return produce(state, state => {
        state.getProjects = payload
      })
    },
  },

  initialState,
)
