import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Moment from 'react-moment'

import Table from 'components/table'
import { fetchUpdateDetails } from '../../modules/updateRequests/helpers'
import { getPaginationApi, removePaginationData } from '../../modules/pagination/helpers'
import Search from 'components/search/updateRequest'

import { MESSAGES } from 'libs/utils/messages'
import { message, Button } from 'antd'

const UpdateRequests = () => {
  const dispatch = useDispatch()
  const { fetchUpdateRequestsData } = useSelector(state => state.updateRequests)
  const { getNavigation } = useSelector(state => state.search)
  const { getPagination } = useSelector(state => state.pagination)
  const [listing, setListing] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [value, setValues] = useState('')
  const history = useHistory()
  const columns = [
    {
      title: 'Full Name',
      width: 130,
      dataIndex: 'fullname',
      key: '1',
    },
    {
      title: 'CNIC',
      width: 100,
      dataIndex: 'cnic',
      key: '2',
    },
    { title: 'Email', dataIndex: 'email', key: '3', width: 150 },
    { title: 'Phone', dataIndex: 'phone', key: '4', width: 100 },
    { title: 'Status', dataIndex: 'status', key: '5', width: 100 },
    { title: 'Request Date', dataIndex: 'requestDate', key: '6', width: 100 },
    {
      title: '',
      dataIndex: 'operation',
      className: 'actions',
      width: 1,
      key: '7',
    },
  ]

  const getRequestsListing = async () => {
    try {
      setLoading(true)
      if (fetchUpdateRequestsData && fetchUpdateRequestsData.status) {
        setCount(fetchUpdateRequestsData.count)

        const data = ((fetchUpdateRequestsData || {}).customers || []).map(val => ({
          key: val.id || '',
          fullname: val.first_name || '' + val.last_name || '',
          status: (
            <div
              className={
                val.currenRequestStatus
                  ? val.currenRequestStatus === 'PENDING'
                    ? 'pending comment-type'
                    : val.currenRequestStatus === 'APPROVED'
                      ? 'approved comment-type'
                      : val.currenRequestStatus === 'DECLINED'
                        ? 'declined comment-type'
                        : ''
                  : ''
              }
            >
              {' '}
              {val.currenRequestStatus.charAt(0).toUpperCase() +
                val.currenRequestStatus.slice(1).toLowerCase()}
            </div>
          ),
          requestDate: <Moment format="DD-MM-YYYY">{val.updateRequestDate}</Moment>,
          operation: (
            <Link to={`/update request detail/${val.id}`}>
              <Button type="button" className="hover-detail-btn">
                View details
              </Button>
            </Link>
          ),
          ...val,
        }))
        setListing(data)
      } else {
        // message.error(clientsResponse.message || MESSAGES.apiError)
      }
    } catch (error) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  const changeValue = async values => {
    let str = []
    for (let p in values) {
      if (values.hasOwnProperty(p) && values[p] !== undefined) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(values[p]))
      }
    }
    let newVal = str.join('&')
    setValues(newVal)
  }

  useEffect(() => {
    getRequestsListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUpdateRequestsData])

  useEffect(() => {
    let newValue
    let pageNumber
    getPagination && getPagination ? (pageNumber = getPagination.pageNo) : (pageNumber = 1)
    getNavigation && getNavigation.allSearchValues
      ? (newValue = getNavigation.allSearchValues)
      : (newValue = value)
    if (newValue) {
      setValues(newValue)
      if (history.action !== 'POP' && getPagination) {
        dispatch(fetchUpdateDetails(1, 10, newValue, 'list'))
        dispatch(removePaginationData())
      } else dispatch(fetchUpdateDetails(pageNumber, 10, newValue, 'list'))
    } else {
      dispatch(fetchUpdateDetails(pageNumber, 10, '', 'list'))
      history.action = ''
    }
    setLoading(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="main-container clientsrequest">
      <Search
        callBack={value => changeValue(value)}
        clear={() => {
          dispatch(fetchUpdateDetails(1, 10, '', 'list'))
          setLoading(true)
          setValues('')
        }}
      />
      <Table
        listing={listing}
        columns={columns}
        pageCount={count}
        next={(pageNumber, pageSize) => {
          dispatch(
            getPaginationApi({
              pageNo: pageNumber,
              pageSize: pageSize,
            }),
          )
          dispatch(fetchUpdateDetails(pageNumber, pageSize, value, 'list'))
          setLoading(true)
        }}
        number={1300}
        loading={loading}
      />
    </div>
  )
}

export default UpdateRequests
