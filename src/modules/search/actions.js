import { createAction } from 'redux-actions'

export const searchNavigarionApi = createAction('NAVIGATIONAPI', (num = 1) => num)
export const RemoveSearchData = createAction('REMOVE_Search_DATA', (num = 1) => num)
