/**
 * All api endpoints communicating with backend-for-frontend(bff) lie here
 */

const API_ENDPOINTS = {
  login: '/user/login',
  updatePassword: '/user/updatePassword',
  dashboard: {
    getProjectSummary: '/projects/summary',
    getTabData: (tabValue, page, pageSize, searchStr = '') => {
      if (tabValue === 'customers') {
        return `/customers/home?pageNo=${page}&limit=${pageSize}${searchStr &&
          `&cnic=${searchStr}`}`
      } else if (tabValue === 'complaints') {
        return `/${tabValue}?pageNo=${page}&limit=${pageSize}&type=home${searchStr &&
          `&cnic=${searchStr}`}`
      } else {
        return { message: 'error no tab url exist' }
      }
    },
    getDemoGraphics: '/complaints/demographics',
  },
  sales: {
    getSales: (pageNo = 1, limit, query = '') => {
      return `/sales?pageNo=${pageNo}&limit=${limit}${query && `&${query}`}&type=list`
    },
    exportSalesListing: (pageNo = 1, limit, query = '') => {
      return `/sales?${query && `${query}&type=list`}`
    },
    getSalesDropdown: type => {
      return `/sales/others?type=${type}`
    },
    getSalesById: Id => {
      return `/sales/${Id}`
    },
    generateContract: Id => {
      return `/contracts/${Id}`
    },
    downloadContract: id => {
      return `contracts/contractDocumentDownload/?saleId=${id}`
    },
    sendEmail: id => {
      return `contracts/email/${id}`
    },
    changeDocStatus: (id, status) => {
      return `contracts/changeDocumentStatus?id=${id}&status=${status}`
    },
    deleteDocument: id => {
      return `contracts/saleDocuments/deleteDocument/${id}`
    },
    downloadDocument: id => {
      return `contracts/saleDocumentDownload?id=${id}`
    },
    uploadDoc: 'contracts/saleDocuments',
  },
  clients: {
    getCustomerById: Id => {
      return `/customers/${Id}`
    },
    getCustomers: (pageNo = 1, limit, query = '') => {
      return `/customers?pageNo=${pageNo}&limit=${limit}${query && `&${query}`}`
    },
    exportCustomers: (pageNo = 1, limit, query = '') => {
      return `/customers?${query && `${query}&type=list`}`
    },
    getClientLogs: (pageNo = 1, limit, query = '') => {
      return `/userLogs?pageNo=${pageNo}&limit=${limit}${query && `&${query}`}`
    },
    getSalesByCsutomerId: id => {
      return `/customers/${id}/sales`
    },
    getCustomerSummary: id => {
      return `/customers/customerSummary/${id}`
    },
    getCustomerSalesListing: id => {
      return `/customers/${id}/salesListing/`
    },
    updateClient: '/customers',
  },
  updateRequests: {
    getUpdateRequests: (pageNo = 1, limit, query = '') => {
      return `/updateRequests?pageNo=${pageNo}&limit=${limit}${query && `&${query}`}`
    },

    getUpdateRequestByCustId: id => {
      return `/updateRequests/${id}`
    },

    patchRequestToUpdateCustomerRecord: cusId => {
      return `/updateRequests/${cusId}`
    },

    cancelRequest: () => {
      return `/updateRequests/individuals`
    },
  },
  complaints: {
    getComplaints: (pageNo = 1, limit, query = '') => {
      return `/complaints?pageNo=${pageNo}&limit=${limit}${query && `&${query}`}&type=list`
    },
    getComplaintById: complaintId => {
      return `/complaints/${complaintId}`
    },
    addComment: `/comments`,
    downloadDocument: id => {
      return `/comments/getAttachmentUrl?id=${id}`
    },
  },
}

export { API_ENDPOINTS }
