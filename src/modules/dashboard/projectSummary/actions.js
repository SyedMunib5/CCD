import { createAction } from 'redux-actions'

export const increment = createAction('INCREMENT', (num = 1) => num)
export const decrement = createAction('DECREMENT', (num = 1) => num)
export const apiProjectSummary = createAction('FETCH_PROJECT_SUMMARY', (num = 1) => num)
