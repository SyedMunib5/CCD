import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Table from 'components/table'
import ComplaintService from 'services/complaints'
import { fetchComplaints } from '../../modules/complaints/helpers'
import { getPaginationApi, removePaginationData } from '../../modules/pagination/helpers'
import Search from 'components/search/inquiries'

import { Button, message } from 'antd'
import { MESSAGES } from 'libs/utils/messages'
const Complaints = () => {
  const [value, setValues] = useState('')
  const { fetchComplaintData } = useSelector(state => state.complaints)
  const { getNavigation } = useSelector(state => state.search)
  const { getPagination } = useSelector(state => state.pagination)
  const [listing, setListing] = useState([])
  const [count, setCount] = useState(0)
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const columns = [
    {
      title: 'Tracking ID',
      width: 80,
      dataIndex: 'tracking_id',
      key: '1',
    },
    { title: 'Type', dataIndex: 'type', key: '2', width: 50 },
    { title: 'Title', dataIndex: 'title', key: '3', width: 100 },
    { title: 'Client Name', dataIndex: 'fullname', key: '4', width: 100 },
    {
      title: 'CNIC',
      width: 100,
      dataIndex: 'cnic',
      key: '5',
    },
    { title: 'Inquiry date', dataIndex: 'createdAt', key: '6', width: 100 },
    { title: 'Phone', dataIndex: 'phone', key: '7', width: 80 },
    { title: 'Status', dataIndex: 'status', key: '8', width: 100 },
    {
      title: '',
      dataIndex: 'operation',
      className: 'actions',
      width: 1,
    },
  ]

  const getComplaintsListing = async () => {
    try {
      setLoader(true)
      if (fetchComplaintData && fetchComplaintData.status) {
        setCount(fetchComplaintData.count)

        const data =
          ((fetchComplaintData || {}).complaints || []).map(val => ({
            key: val.id,
            tracking_id: val.tracking_id || '',
            cnic: ((val || {}).customer || {}).cnic || '',
            fullname:
              ((val || {}).customer || {}).first_name ||
              '' + ' ' + ((val || {}).customer || {}).last_name ||
              '',
            phone: ((val || {}).customer || {}).phone || '',
            createdAt: ComplaintService.getFullDate(val.createdAt),
            title: val.title || '',
            status: (
              <div
                className={
                  val.status
                    ? val.status === 'REVIEWED'
                      ? 'reviewed comment-type'
                      : val.status === 'CONTACTED'
                        ? 'contacted comment-type'
                        : val.status === 'RESOLVED'
                          ? 'resolved comment-type'
                          : val.status === 'ON HOLD'
                            ? 'onhold comment-type'
                            : val.status === 'IN PROGRESS'
                              ? 'inprogress comment-type'
                              : val.status === 'DROPPED'
                                ? 'dropped comment-type'
                                : val.status === 'PENDING'
                                  ? 'pending comment-type'
                                  : ''
                    : ''
                }
              >
                {' '}
                {val.status
                  ? val.status.charAt(0).toUpperCase() + val.status.slice(1).toLowerCase()
                  : ''}
              </div>
            ),
            type: val.type || '',
            operation: (
              <Link to={`/inquiry detail/${val.id}`}>
                <Button type="button" className="hover-detail-btn">
                  View details
                </Button>
              </Link>
            ),
          })) || []

        setListing(data)
      } else {
      }
    } catch (error) {
      message.error(MESSAGES.defaultError)
      console.log(error)
      throw new Error()
    } finally {
      fetchComplaintData && setLoader(false)
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
    getComplaintsListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchComplaintData])

  // use Effect
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
        dispatch(fetchComplaints(1, 10, newValue, 'list'))
        dispatch(removePaginationData())
      } else dispatch(fetchComplaints(pageNumber, 10, newValue, 'list'))
    } else {
      dispatch(fetchComplaints(pageNumber, 10, '', 'list'))
      history.action = ''
    }
    setLoader(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="main-container clientscomplaint">
      <Search
        callBack={value => changeValue(value)}
        clear={() => {
          dispatch(fetchComplaints(1, 10, '', 'list'))
          setLoader(true)
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
          dispatch(fetchComplaints(pageNumber, pageSize, 'list'))
          setLoader(true)
        }}
        number={1300}
        loading={loader}
      />
    </div>
  )
}

export default Complaints
