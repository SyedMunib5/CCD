import { createAction } from 'redux-actions'

export const increment = createAction('INCREMENT', (num = 1) => num)
export const decrement = createAction('DECREMENT', (num = 1) => num)
export const apiSale = createAction('FETCHSALES', (num = 1) => num)
export const projectsApi = createAction('GETPROJECTSAPI', (num = 1) => num)
