import { createAction } from 'redux-actions'

export const increment = createAction('INCREMENT', (num = 1) => num)
export const decrement = createAction('DECREMENT', (num = 1) => num)
export const api = createAction('FETCHCLIENTS', (num = 1) => num)
export const apiForExport = createAction('EXPORTFETCHCLIENTS', (num = 1) => num)
export const customerSummaryApi = createAction('GETCUSTOMERSUMMARY', (num = 1) => num)
export const CustomerSalesListingApi = createAction('GETCUSTOMERSALES', (num = 1) => num)
