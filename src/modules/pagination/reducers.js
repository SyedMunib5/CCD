import { handleActions } from 'redux-actions'
import produce from 'immer'

import * as actions from './actions'

const initialState = {
  getPagination: '',
}

export default handleActions(
  {
    [actions.paginationApi] (state, { payload }) {
      return produce(state, state => {
        state.getPagination = payload
      })
    },
    [actions.removePaginationApi] (state) {
      return produce(state, state => {
        state.getPagination = ''
      })
    },
  },
  initialState,
)
