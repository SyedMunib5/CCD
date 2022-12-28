import { handleActions } from 'redux-actions'
import produce from 'immer'

import * as actions from './actions'

const initialState = {
  getNavigation: '',
}

export default handleActions(
  {
    [actions.searchNavigarionApi] (state, { payload }) {
      return produce(state, state => {
        state.getNavigation = payload
      })
    },
    [actions.RemoveSearchData] (state) {
      return produce(state, state => {
        state.getNavigation = ''
      })
    },
  },

  initialState,
)
