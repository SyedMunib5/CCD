import { createAction } from 'redux-actions'

export const paginationApi = createAction('PAGINATIONAPI', (num = 1) => num)
export const removePaginationApi = createAction('REMOVE_PAGINATION_DATA', (num = 1) => num)
