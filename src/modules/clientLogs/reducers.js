import { handleActions } from 'redux-actions'
import produce from 'immer'

import * as actions from './actions'

const initialState = {
  count: 0,
  fetchClientLogsData: '',
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
    [actions.apiClientLogs] (state, { payload }) {
      return produce(state, state => {
        state.fetchClientLogsData = payload
      })
    },
  },

  initialState,
)
