import { createAction } from 'redux-actions'

export const increment = createAction('INCREMENT', (num = 1) => num)
export const decrement = createAction('DECREMENT', (num = 1) => num)
export const apiUpdateRequest = createAction('FETCH_UPDATE_REQUEST', (num = 1) => num)
