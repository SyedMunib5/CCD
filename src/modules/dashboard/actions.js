import { createAction } from 'redux-actions'

export const increment = createAction('INCREMENT', (num = 1) => num)
export const decrement = createAction('DECREMENT', (num = 1) => num)
export const fetchTabData = createAction('FETCH_TAB_DATA', (num = 1) => num)
export const RemovefetchTabData = createAction('REMOVE_FETCH_TAB_DATA', (num = 1) => num)
