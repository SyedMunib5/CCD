import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import moment from 'moment'

import Table from 'components/table'
import Search from 'components/search/clients'
import { fetchClients } from '../../modules/clients/helpers'
import { getPaginationApi, removePaginationData } from '../../modules/pagination/helpers'
import ClientsService from 'services/clients'

import { MESSAGES } from 'libs/utils/messages'
import { message, Badge, Button } from 'antd'

import './style.scss'

const Clients = () => {
  const dispatch = useDispatch()
  const { fetchClientData } = useSelector(state => state.clients)
  const { getNavigation } = useSelector(state => state.search)
  const { getPagination } = useSelector(state => state.pagination)
  const [listing, setListing] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [value, setValues] = useState('')
  // const [pageSize, setPageSize] = useState(10)

  const columns = [
    {
      title: 'Client Name',
      width: 120,
      dataIndex: 'fullname',
      key: '1',
    },
    {
      title: 'CNIC',
      width: 120,
      dataIndex: 'cnic',
      key: '2',
    },

    { title: 'Phone', dataIndex: 'phone', key: '3', width: 100 },
    { title: 'Email', dataIndex: 'email', key: '5', width: 160 },
    { title: 'DOB', dataIndex: 'dateOfBirth', key: '6', width: 80 },
    { title: 'Purchases', dataIndex: 'purchases', key: '7', width: 80 },
    { title: 'Paid', dataIndex: 'paid', key: '8', width: 120 },
    { title: 'Created Date', dataIndex: 'createdat', key: '10', width: 110 },
    {
      title: '',
      dataIndex: 'operation',
      className: 'action2',
      width: 1,
    },
  ]

  const getClientsListing = async (pageNumber, pageSize = 10) => {
    try {
      setLoading(true)
      if (fetchClientData && fetchClientData.status) {
        setCount(fetchClientData.count)

        const data = ((fetchClientData || {}).customers || []).map(val => ({
          key: val.id || '',
          fullname: val.isNew ? (
            <Badge color="#e0ae67" size="large" text={val.first_name || '' + val.last_name || ''} />
          ) : (
            <div className="firstName">{val.first_name || '' + val.last_name || ''}</div>
          ),
          purchases: (val.leadsCounts || 0) + ' Unit' + (val.leadsCounts > 1 ? 's' : ''),
          paid: Number(val.installmentSum || 0).toLocaleString(),
          createdat: val.created_at ? <Moment format="DD-MM-YYYY">{val.created_at}</Moment> : '',
          dateOfBirth: val.dob ? <Moment format="DD-MM-YYYY">{val.dob}</Moment> : '',
          operation: (
            <Link to={`/client detail/${val.id}`}>
              <Button type="button" className="hover-detail-btn">
                View details
              </Button>
            </Link>
          ),
          ...val,
        }))

        setListing(data)
      } else {
        // message.error(fetchClientData.message || MESSAGES.apiError)
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
        if (p === 'dob' || p === 'createdFrom' || p === 'createdTo') {
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

  useEffect(() => {
    // get sales listing
    getClientsListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchClientData])

  useEffect(() => {
    // get clients listing
    let newValue
    let pageNumber
    getPagination && getPagination ? (pageNumber = getPagination.pageNo) : (pageNumber = 1)
    getNavigation && getNavigation.allSearchValues
      ? (newValue = getNavigation.allSearchValues)
      : (newValue = value)
    if (newValue) {
      setValues(newValue)
      if (history.action !== 'POP' && getPagination) {
        dispatch(fetchClients(1, 10, newValue, 'list'))
        dispatch(removePaginationData())
      } else dispatch(fetchClients(pageNumber, 10, newValue, 'list'))
    } else {
      dispatch(fetchClients(pageNumber, 10, '', 'list'))
      history.action = ''
    }
    setLoading(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const exportLisiting = async () => {
    const clientsResponse = await ClientsService.exportClientsListing('', '', value, 'list')
    let blob = new Blob([clientsResponse], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    let url = URL.createObjectURL(blob)
    window.open(url)
  }
  return (
    <div className="main-container clients">
      <Search
        callBack={value => changeValue(value)}
        exportListing={() => exportLisiting()}
        resultCount={value && listing.length ? listing.length : 0}
        clear={() => {
          dispatch(fetchClients(1, 10, '', 'list'))
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
          dispatch(
            getPaginationApi({
              pageNo: pageNumber,
              pageSize: pageSize,
            }),
          )
          dispatch(fetchClients(pageNumber, pageSize, value, 'list'))
          setLoading(true)
        }}
        number={1700}
        loading={loading}
      />
    </div>
  )
}

export default Clients
