import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { CUSTOMERS, COMPLAINTS } from 'libs/utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { MESSAGES } from 'libs/utils/messages'
import lazyLoad from 'libs/utils/lazy-loading'
import DashboardSearch from '../../components/search/dashboard'
import { fetchTabData, removefetchTabData } from '../../modules/dashboard/helpers'
import { getPaginationApi, removePaginationData } from '../../modules/pagination/helpers'
import { removeSearchData } from '../../modules/search/helpers'
import { Row, Col, Tabs, message, Spin, Pagination } from 'antd'

import Tile from 'containers/dashboard/tile'
import './style.scss'

// lazy loaded components
const ProjectSummary = lazyLoad(() => import('./projectSummary'))

const { TabPane } = Tabs

const Dashboard = () => {
  const dispatch = useDispatch()
  const { fetchTabListingData } = useSelector(state => state.dashboard)
  const history = useHistory()

  useEffect(() => {
    if (fetchTabListingData.status) {
      if (fetchTabListingData.complaints) {
        setComplaints(fetchTabListingData.complaints || [])
        setTotalComplaints(fetchTabListingData.count || 0)
      } else {
        setCustomers(fetchTabListingData.customers || [])
        setTotalCustomers(fetchTabListingData.count || 0)
      }
    }
    if (fetchTabListingData.count === 0) {
      setIsLoading(false)
    }
  }, [fetchTabListingData])

  const pageSizeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
  const [complaints, setComplaints] = useState([])
  const [customers, setCustomers] = useState([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalComplaints, setTotalComplaints] = useState(0)
  const [activeKey, setActiveKey] = useState(COMPLAINTS)
  const [custPage, setCustPage] = useState(1)
  const [compPage, setCompPage] = useState(1)
  const [custPageSize, setCustPageSize] = useState(5)
  const [compPageSize, setCompPageSize] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  // const [flag, setFlag] = useState(false)
  const { getNavigation } = useSelector(state => state.search)
  const { getPagination } = useSelector(state => state.pagination)

  useEffect(() => {
    customers.length > 0 && setIsLoading(false)
    complaints.length > 0 && setIsLoading(false)
    setIsSwitching(false)
  }, [complaints, customers])

  const getTabbedData = async (tabValue, str = '', page = 1, pageSize = 5) => {
    if (str === 1) {
      str = ''
    }
    try {
      setIsLoading(true)
      let newValue
      let pageNumber
      getPagination && getPagination ? (pageNumber = getPagination.pageNo) : (pageNumber = page)
      getNavigation && getNavigation.cnic ? (newValue = getNavigation.cnic) : (newValue = str)
      if (newValue) {
        if (history.action !== 'POP' && getPagination) {
          dispatch(fetchTabData(tabValue, page, pageSize, newValue))
          dispatch(removePaginationData())
        } else {
          dispatch(fetchTabData(tabValue, pageNumber, pageSize, newValue))
        }
      } else {
        dispatch(fetchTabData(tabValue, pageNumber, pageSize))
        history.action = ''
      }
    } catch (e) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
    }
  }

  // useEffect(() => {
  //   console.log('cnic- ', getNavigation.cnic)
  //   if (activeKey === CUSTOMERS) {
  //     getTabbedData(CUSTOMERS, '', 1, 5, getNavigation.cnic)
  //   } else {
  //     getTabbedData(COMPLAINTS, '', 1, 5, getNavigation.cnic)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getNavigation.cnic])

  // get default tab new customers data on first mount
  useEffect(() => {
    getTabbedData(COMPLAINTS, '')
    return () => {
      dispatch(removefetchTabData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPageChange = (tabValue, page, pageSize) => {
    dispatch(
      getPaginationApi({
        pageNo: page,
        pageSize: pageSize,
      }),
    )
    if (tabValue === CUSTOMERS) {
      setCustPage(page)
      setCustPageSize(pageSize)
      getTabbedData(tabValue, '', page, pageSize)
    } else {
      setCompPage(page)
      setCompPageSize(pageSize)
      getTabbedData(tabValue, '', page, pageSize)
    }
  }

  const setActiveKeyState = activeKey => {
    setActiveKey(activeKey)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTabSwitch = activeKey => {
    setIsSwitching(true)
    if (history.action !== 'POP') {
      dispatch(removeSearchData())
      dispatch(removePaginationData())
    } else {
      // history.action = ''
    }
    if (activeKey === CUSTOMERS) {
      getTabbedData(CUSTOMERS, '', custPage, custPageSize)
    } else {
      getTabbedData(COMPLAINTS, '', compPage, compPageSize)
    }
  }

  const onSearch = str => {
    if (str !== '') {
      if (activeKey === CUSTOMERS) {
        setCustPage(1)
        setCustPageSize(5)
        getTabbedData(CUSTOMERS, str)
      } else {
        setCompPage(1)
        setCompPageSize(5)
        getTabbedData(COMPLAINTS, str)
      }
    } else {
      onTabSwitch(activeKey)
    }
  }
  useEffect(() => {
    onTabSwitch(activeKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey])

  useEffect(() => {
    if (activeKey === CUSTOMERS) {
      getTabbedData(CUSTOMERS, '', getPagination.pageNo, 5)
    } else {
      getTabbedData(COMPLAINTS, '', getPagination.pageNo, 5)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ getPagination.pageNo ])

  return (
    <Row className="dashboard">
      <Col span={24}>
        {/* Home Content Row */}
        <Row gutter={[0, 20]}>
          <Col span={18} className="left">
            <Tabs
              defaultActiveKey={COMPLAINTS}
              onChange={setActiveKeyState}
              renderTabBar={(props, TabBar) => <TabBar {...props} tabPosition="top" />}
            >
              <TabPane tab="Inquiries" key={COMPLAINTS} className="main-container">
                {isSwitching ? (
                  <Col span={24} className="loader">
                    <Spin className="handle-margin" size="large" />
                  </Col>
                ) : (
                  <Row>
                    <Col span={24}>
                      <DashboardSearch
                        search={data => {
                          data && onSearch(Number(data.cnic))
                        }}
                        clear={() => {
                          dispatch(fetchTabData(COMPLAINTS, 1, 5))
                          setIsLoading(true)
                        }}
                      />
                    </Col>
                    {isLoading ? (
                      <Col span={24} className="loader">
                        <Spin className="handle-margin" size="large" />
                      </Col>
                    ) : (
                      <Col span={24}>
                        <div className="tileBlock">
                          {complaints.length > 0 ? (
                            complaints.map((complaint, index) => {
                              return (
                                <Tile
                                  key={`${complaint.tracking_id || `complaint`}-${complaint.id ||
                                    index}`}
                                  obj={complaint}
                                  type={COMPLAINTS}
                                  getIndex={index}
                                />
                              )
                            })
                          ) : (
                            <Row style={{ justifyContent: 'center' }}>
                              <Col span={6}>
                                <p>No Inquiries Found!</p>
                              </Col>
                            </Row>
                          )}
                        </div>
                        <Row>
                          <Col span={18}>
                            <div className="pagination">
                              <Pagination
                                current={getPagination ? getPagination.pageNo : custPage}
                                onChange={(page, pageSize) =>
                                  onPageChange(COMPLAINTS, page, pageSize)
                                }
                                total={totalComplaints}
                                showTotal={(total, range) =>
                                  `${range[0]}-${range[1]} of ${total} items`
                                }
                                hideOnSinglePage={totalComplaints === 0}
                                defaultPageSize={5}
                                showSizeChanger={false}
                                pageSize={compPageSize}
                                pageSizeOptions={pageSizeOptions}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                )}
              </TabPane>
              <TabPane tab="New Clients" key={CUSTOMERS} className="main-container">
                {isSwitching ? (
                  <Col
                    span={24}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '10px',
                    }}
                  >
                    <Spin className="handle-margin" size="large" />
                  </Col>
                ) : (
                  <Row>
                    <Col span={24}>
                      <DashboardSearch
                        search={data => {
                          data && onSearch(Number(data.cnic))
                        }}
                        clear={() => {
                          dispatch(fetchTabData(CUSTOMERS, 1, 5))
                        }}
                      />
                    </Col>
                    {isLoading ? (
                      <Col
                        span={24}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '10px',
                        }}
                      >
                        <Spin className="handle-margin" size="large" />
                      </Col>
                    ) : (
                      <Col span={24}>
                        <div className="tileBlock">
                          {customers.length > 0 ? (
                            customers.map((customer, index) => {
                              return (
                                <>
                                  <Tile
                                    key={`${customer.created_at || `customer`}-${customer.id ||
                                      index}`}
                                    obj={customer}
                                    type={CUSTOMERS}
                                    getIndex={index}
                                  />
                                </>
                              )
                            })
                          ) : (
                            <Row style={{ justifyContent: 'center' }}>
                              <Col span={6}>
                                <p>No Clients Found!</p>
                              </Col>
                            </Row>
                          )}
                        </div>
                        <Row>
                          <Col>
                            <div className="pagination">
                              <Pagination
                                current={getPagination ? getPagination.pageNo : custPage}
                                onChange={(page, pageSize) =>
                                  onPageChange(CUSTOMERS, page, pageSize)
                                }
                                total={totalCustomers}
                                showTotal={(total, range) =>
                                  `${range[0]}-${range[1]} of ${total} items`
                                }
                                hideOnSinglePage={totalCustomers === 0}
                                defaultPageSize={5}
                                showSizeChanger={false}
                                pageSize={custPageSize}
                                pageSizeOptions={pageSizeOptions}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                )}
              </TabPane>
            </Tabs>
          </Col>
          <br></br>
          <Col span={6} className="right">
            <Row>
              <Col span={24}>
                <p className="title">Project Summary</p>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <ProjectSummary />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Dashboard
