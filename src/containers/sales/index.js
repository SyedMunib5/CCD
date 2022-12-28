import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import $ from 'jquery'
import Moment from 'react-moment'

import SalesService from 'services/sales'
import Search from 'components/search/sales'
import { fetchSales } from '../../modules/sales/helpers'
import { getPaginationApi, removePaginationData } from '../../modules/pagination/helpers'
import { MESSAGES } from 'libs/utils/messages'

import Table from 'components/table'

import { Modal, Menu, message, Button, Dropdown } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import './style.scss'
const { confirm } = Modal

const Sales = () => {
  const dispatch = useDispatch()
  const { fetchSalesData } = useSelector(state => state.sales)
  const { getNavigation } = useSelector(state => state.search)
  const { getPagination } = useSelector(state => state.pagination)
  const location = useLocation()
  const [listing, setListing] = useState([])
  const [loading, setLoading] = useState(false)
  const [value, setValues] = useState()
  const [count, setCount] = useState(0)
  const [id, setId] = useState(0)
  const [clientId, setClientId] = useState(0)
  const [contract, setContract] = useState(false)
  const history = useHistory()

  const columns = [
    { title: 'Reference No', dataIndex: 'ref_no', key: '1', width: 90 },
    { title: 'Client Name', dataIndex: 'ClientName', key: '2', width: 120 },
    { title: 'Project', dataIndex: 'Project', key: '3', width: 100 },
    { title: 'Floor', dataIndex: 'Floor', key: '4', width: 100 },
    { title: 'Unit', dataIndex: 'Unit', key: '5', width: 90 },
    { title: 'Size', dataIndex: 'Size', key: '6', width: 100 },
    { title: 'Final Amount', dataIndex: 'TotalAmount', key: '7', width: 120 },
    { title: 'Paid Amount', dataIndex: 'Paid', key: '8', width: 120 },
    { title: 'Payment Plan', dataIndex: 'PaymentPlan', key: '9', width: 90 },
    {
      title: 'Booking Date',
      width: 90,
      dataIndex: 'booking_date',
      key: '10',
    },

    { title: 'Status', dataIndex: 'Status', key: '11', width: 100 },
    { title: 'Contract Generated', dataIndex: 'ContractGenerated', key: '12', width: 100 },
    { title: 'Contract sent to vendor', dataIndex: 'SentToVendor', key: '13', width: 100 },
    {
      title: '',
      key: 'operation',
      dataIndex: 'operation',
      width: 1,
      className: 'actions',
    },
  ]

  const showConfirm = (id, clientId) => {
    confirm({
      content: 'Are you sure you want to regenerate contract for this sale?',
      icon: <ExclamationCircleOutlined />,
      onOk () {
        generateContract(id, clientId)
      },
      onCancel () {
        console.log('Cancel')
      },
    })
  }

  const sendEmail = async id => {
    try {
      setLoading(true)
      const response = await SalesService.sendEmail(id)
      if (response.status) {
        alertBox('Email sent to vendor successfully', 'success')
        getSalesListing()
      } else {
        alertBox('There was some issue in sending email to vendor, Please try again', 'danger')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function alertBox (message, type) {
    if (type === 'success') {
      Modal.success({
        content: message,
      })
    } else if (type === 'danger') {
      Modal.warning({
        content: message,
      })
    }
  }

  const downloadContract = async id => {
    try {
      setLoading(true)
      const response = await SalesService.downloadContract(id)
      const file = new Blob([response], { type: 'application/pdf' })
      // Build a URL from the file

      const fileURL = URL.createObjectURL(file)
      // Open the URL on new Window
      window.open(fileURL)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateContract = async (id, clientsId) => {
    setId(id)
    setClientId(clientsId)
    try {
      setContract(false)
      setLoading(true)
      const response = await SalesService.generateContract(id)
      if (response.status) {
        alertBox('Contract generated successfully', 'success')
        getSalesListing()
      } else if (response.missingDetails) {
        history.push({
          pathname: `/client detail/${clientsId}`,
          state: {
            missingFields: Object.keys(response.missingDetails),
            saleId: id,
          },
        })
      } else {
        alertBox('Contract template not found against this project and sale type', 'danger')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const menu = (id, clientId, isContractGenerated) => (
    <Menu className="main-menu">
      <Menu.Item
        onClick={() =>
          (isContractGenerated === true ? 'yes' : 'no') === 'no'
            ? generateContract(id, clientId)
            : showConfirm(id, clientId)
        }
      >
        {(isContractGenerated === true ? 'yes' : 'no') === 'no' ? (
          <span className="adjust-padding">Generate Contract</span>
        ) : (
          'Regenerate Contract'
        )}
      </Menu.Item>
      {(isContractGenerated === true ? 'yes' : 'no') === 'yes' ? (
        <>
          <Menu.Item onClick={() => downloadContract(id)}>View Contract</Menu.Item>
          <Menu.Item onClick={() => sendEmail(id)}>Send Contract To Vendor</Menu.Item>
        </>
      ) : (
        ''
      )}
    </Menu>
  )

  const changeClass = async (val, id, dp = 'show') => {
    $('#parent' + id).css('opacity', val)

    dp === 'show' ? $('#dropdown' + id).show() : $('#dropdown' + id).hide()
  }

  const getSalesListing = async () => {
    if (location.state) {
      setClientId(location.state.id)
      setId(location.state.saleId)
      setContract(true)
      delete location.state
    }
    try {
      setLoading(true)
      if (fetchSalesData && fetchSalesData.status) {
        setCount(fetchSalesData.count)
        const data =
          ((fetchSalesData || {}).sales || []).map(val => ({
            ref_no: val.referenceNumber,
            booking_date: (
              <Moment utc="DD-MM-YYYY" format="DD-MM-YYYY">
                {val.downPaymentTime || ''}
              </Moment>
            ),
            Project: val.project.name || '',
            Floor: val.floor.name || '',
            Unit: val.unit.name || '',
            Size: val.unit.area
              ? Number(val.unit.area).toLocaleString() + ' ' + val.unit.area_unit
              : '',
            Price: val.pricesqft,
            TotalAmount: val.unit.finalPrice ? val.unit.finalPrice.toLocaleString() : '',
            Paid: val.installmentSum ? Number(val.installmentSum).toLocaleString() : '',
            ClientName: val.customer.first_name + ' ' + val.customer.last_name,
            PaymentPlan:
              val.paymentPlan.charAt(0).toUpperCase() +
              val.paymentPlan.replaceAll('_', ' ').slice(1),
            ContractGenerated: val.isContractGenerated === true ? 'Yes' : 'No',
            SentToVendor: val.sendToVendor === true ? 'Yes' : 'No',
            Status: (
              <div
                className={
                  val.ccdStatus
                    ? val.ccdStatus === 'Active'
                      ? 'active-status comment-type'
                      : val.ccdStatus === 'BuyBack'
                        ? 'buyback comment-type'
                        : val.ccdStatus === 'Refund'
                          ? 'refund comment-type'
                          : ''
                    : ''
                }
              >
                {' '}
                {val.ccdStatus
                  ? val.ccdStatus.charAt(0).toUpperCase() + val.ccdStatus.slice(1).toLowerCase()
                  : ''}
              </div>
            ),
            operation: (
              <Button.Group
                className="button-group"
                id={'parent' + val.id}
                onMouseOver={() => changeClass('1', val.id)}
                onMouseLeave={() => changeClass('0', val.id, 'hidedp')}
              >
                <Link to={`/sale detail/${val.id}`}>
                  <Button type="button" className="hover-detail-btn2">
                    View Details
                  </Button>
                </Link>

                <Button className="action-dropdown" type="button">
                  <Dropdown
                    overlay={menu(val.id, val.customer.id, val.isContractGenerated)}
                    id={'dropdown' + val.id}
                  >
                    <div className="ant-dropdown-link">
                      Actions <DownOutlined />
                    </div>
                  </Dropdown>
                </Button>
              </Button.Group>
            ),
          })) || []
        setListing(data)
      } else {
      }
    } catch (error) {
      console.log(error)
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
    getSalesListing(1, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSalesData])

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
        dispatch(fetchSales(1, 10, newValue, 'list'))
        dispatch(removePaginationData())
      } else dispatch(fetchSales(pageNumber, 10, newValue, 'list'))
    } else {
      dispatch(fetchSales(pageNumber, 10, '', 'list'))
      history.action = ''
    }
    setLoading(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    if (contract === true) generateContract(id, clientId)
  }, [clientId, contract, generateContract, id])
  const exportLisiting = async () => {
    const salesResponse = await SalesService.exportSalesListing('', '', value, 'list')
    let blob = new Blob([salesResponse], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    let url = URL.createObjectURL(blob)
    window.open(url)
  }
  return (
    <div className="main-container sales">
      <Search
        callBack={value => changeValue(value)}
        exportListing={() => exportLisiting()}
        resultCount={value && listing.length ? listing.length : 0}
        clear={() => {
          dispatch(fetchSales(1, 10, '', 'list'))
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
          dispatch(fetchSales(pageNumber, pageSize, value, 'list'))
          setLoading(true)
        }}
        number={2200}
        loading={loading}
      />
    </div>
  )
}

export default Sales
