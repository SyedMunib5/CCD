import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import Table from 'components/table'
import Search from 'components/search/cplogs'
import { fetchClientLogs } from '../../modules/clientLogs/helpers'
import { removeSearchData } from '../../modules/search/helpers'

import { MESSAGES } from 'libs/utils/messages'
import { message } from 'antd'

import './style.scss'

const Logs = () => {
  const [listing, setListing] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [value, setValues] = useState('')
  const dispatch = useDispatch()
  const { fetchClientLogsData } = useSelector(state => state.clientLogs)
  // const [pageSize, setPageSize] = useState(10)
  const history = useHistory()
  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'fullname',
      key: '1',
    },
    {
      title: 'CNIC',
      dataIndex: 'cnic',
      key: '2',
    },
    { title: 'Phone', dataIndex: 'phone', key: '3' },
    { title: 'Logged In Date Time', dataIndex: 'loggedTime', key: '4' },
    { title: 'Current Status', dataIndex: 'loginStatus', key: '5' },
  ]

  const getClientsLog = async () => {
    try {
      setLoading(true)
      if (fetchClientLogsData && fetchClientLogsData.status) {
        setCount(fetchClientLogsData.count)

        const data = ((fetchClientLogsData || {}).userLogs || []).map(val => ({
          key: val.id || '',
          fullname: (val.customer || {}).first_name || '' + (val.customer || {}).last_name || '',
          cnic: (val.customer || {}).cnic,
          phone: (val.customer || {}).phone,
          loggedTime: <Moment format="DD-MM-YYYY HH:mm A">{val.createdAt}</Moment>,
          loginStatus: val.loginStatus ? 'Logged In' : 'Logged Out',
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
    let isDate = false
    for (let p in values) {
      if (values.hasOwnProperty(p) && values[p] !== undefined && values[p] !== null) {
        isDate = false
        if (p === 'dateFrom' || p === 'dateTo') {
          isDate = true
        }
        str.push(
          encodeURIComponent(p) +
            '=' +
            encodeURIComponent(isDate ? moment(values[p]).format('YYYY-MM-DD') : values[p]),
        )
      }
    }
    let newVal = str.join('&')
    setValues(newVal)
  }

  // use effect
  useEffect(() => {
    getClientsLog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getClientsLog()
    if (history.action === 'PUSH') {
      dispatch(removeSearchData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // useEffect(() => {
  //   // get sales listing
  //   dispatch(fetchClientLogs(1, 10, value, 'list'))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    getClientsLog()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchClientLogsData])

  useEffect(() => {
    if (value) dispatch(fetchClientLogs(1, 10, value, 'list'))
    else dispatch(fetchClientLogs(1, 10, '', 'list'))

    setLoading(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <div className="main-container clients">
      <Search
        callBack={value => changeValue(value)}
        resultCount={value && listing.length ? listing.length : 0}
        clear={() => {
          dispatch(fetchClientLogs(1, 10, '', 'list'))
          setLoading(true)
          setValues('')
        }}
      />
      <Table
        listing={listing}
        columns={columns}
        pageCount={count}
        // pageSize={pageSize, pageNumber => getClientsListing(pageNumber,pageSize)}
        next={(pageNumber, pageSize) => {
          dispatch(fetchClientLogs(pageNumber, pageSize, value, 'list'))
          setLoading(true)
        }}
        // number={1700}
        loading={loading}
      />
    </div>
  )
}

export default Logs
