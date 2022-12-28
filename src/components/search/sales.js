import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SalesService from 'services/sales'
import { searchPageNavigation, removeSearchData } from '../../modules/search/helpers'
import { removePaginationData } from '../../modules/pagination/helpers'
import { Form, Input, Button, Select, Row, Col, Tooltip } from 'antd'

import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

import './style.scss'
import exportImg from 'images/export.svg'

const SaleSearch = props => {
  const [projects, setProject] = useState([])
  const [floors, setFloor] = useState([])
  const [form] = Form.useForm()
  const [change, setChange] = useState(false)
  const [minPaymentPaid, setMinPaymentPaid] = useState(0)
  const [maxPaymentPaid, setMaxPaymentPaid] = useState(0)
  const [checkMinPaid, setCheckMinPaid] = useState('')
  const [checkMaxPaid, setCheckMaxPaid] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const { getNavigation } = useSelector(state => state.search)

  const getDropDownData = async () => {
    try {
      const resp = await SalesService.getSalesDropdown('project')
      if (resp.status) {
        setProject(resp.data)
      } else {
        console.log(resp)
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const onChangeDropdown = e => {
    const floor = (projects || []).filter(({ name }) => name === e)
    setFloor(floor[0].floors)
  }

  const onFinish = async values => {
    const {
      ccdStatus,
      cnic,
      floorName,
      maxPaid,
      minPaid,
      paymentPlan,
      projectName,
      referenceNumber,
      unitName,
    } = values
    if (
      !ccdStatus &&
      !cnic &&
      !floorName &&
      !maxPaid &&
      !minPaid &&
      !paymentPlan &&
      !projectName &&
      !referenceNumber &&
      !unitName
    ) {
    } else {
      let searchValues = {
        ccdStatus: ccdStatus,
        cnic: cnic,
        floorName: floorName,
        maxPaid: maxPaid,
        minPaid: minPaid,
        paymentPlan: paymentPlan,
        projectName: projectName,
        referenceNumber: referenceNumber,
        unitName: unitName,
      }
      let str = []
      for (let p in searchValues) {
        if (values.hasOwnProperty(p) && values[p] !== undefined) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(values[p]))
        }
      }
      let newVal = str.join('&')
      dispatch(
        searchPageNavigation({
          searchValues,
          allSearchValues: newVal,
        }),
      )
      props && props.callBack(values)
    }
  }

  const onReset = () => {
    form.resetFields()
    setChange(false)
    props.clear()

    setMinPaymentPaid('')
    setMaxPaymentPaid('')
    setCheckMinPaid('')
    setCheckMaxPaid('')
    setFloor('')
    dispatch(removeSearchData())
    dispatch(removePaginationData())
  }

  const onValuesChange = () => {
    if (!change) setChange(true)
  }

  useEffect(() => {
    getDropDownData()
    if (getNavigation && Object.keys(getNavigation).length !== 0 && history.action === 'POP') {
      onFinish(getNavigation)
      setChange(true)
    }
    if (history.action === 'PUSH') {
      dispatch(removeSearchData())
      dispatch(removePaginationData())
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMinMaxValue = event => {
    event.preventDefault()
    if (event.currentTarget.name === 'minPaid') {
      setMinPaymentPaid(event.target.value)
      setCheckMinPaid(
        !isNaN(event.target.value)
          ? Number(maxPaymentPaid) &&
            !isNaN(maxPaymentPaid) &&
            Number(maxPaymentPaid) !== 0 &&
            Number(maxPaymentPaid) <= Number(event.target.value)
            ? 'Please enter a valid amount'
            : ''
          : 'Please enter a valid amount',
      )
      if (isNaN(event.target.value)) {
        setIsDisabled(true)
      } else {
        setIsDisabled(false)
        if (Number(maxPaymentPaid) && Number(event.target.value) < Number(maxPaymentPaid)) {
          setCheckMaxPaid('')
          setIsDisabled(false)
        } else if (Number(maxPaymentPaid) && Number(event.target.value) >= Number(maxPaymentPaid)) {
          setIsDisabled(true)
        } else if (!Number(maxPaymentPaid) && Number(event.target.value) > Number(maxPaymentPaid)) {
          setCheckMaxPaid('')
          setIsDisabled(false)
        }
      }
    } else if (event.currentTarget.name === 'maxPaid') {
      setMaxPaymentPaid(event.target.value)
      setCheckMaxPaid(
        !isNaN(event.target.value)
          ? Number(minPaymentPaid) &&
            Number(event.target.value) !== 0 &&
            Number(event.target.value) <= Number(minPaymentPaid)
            ? 'Please enter a valid amount'
            : ''
          : 'Please enter a valid amount',
      )
      if (isNaN(event.target.value)) {
        setIsDisabled(true)
      } else {
        if (Number(minPaymentPaid) && Number(event.target.value) === 0) {
          setCheckMinPaid('')
          setIsDisabled(false)
        } else if (Number(minPaymentPaid) && Number(event.target.value) > Number(minPaymentPaid)) {
          setCheckMinPaid('')
          setIsDisabled(false)
        } else if (Number(minPaymentPaid) && Number(event.target.value) <= Number(minPaymentPaid)) {
          setIsDisabled(true)
        } else if (!Number(minPaymentPaid) && Number(event.target.value) > Number(minPaymentPaid)) {
          setIsDisabled(false)
        }
      }
    }
  }

  return (
    <div className="searchBox">
      <Form
        form={form}
        layout="inline"
        name="horizontal_search"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        {' '}
        <Row gutter={[16, 12]}>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="referenceNumber"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                placeholder="Reference Number"
                defaultValue={((getNavigation || {}).searchValues || {}).referenceNumber}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="cnic"
              rules={[
                {
                  required: false,
                },
                () => ({
                  validator (_, value) {
                    if (value && (isNaN(value) || (value.length !== 13 && value.length > 0))) {
                      return Promise.reject(
                        new Error('Please enter 13 digit CNIC number without dashes'),
                      )
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input
                placeholder="CNIC"
                defaultValue={((getNavigation || {}).searchValues || {}).cnic}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="ccdStatus"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Status"
                defaultValue={((getNavigation || {}).searchValues || {}).ccdStatus}
              >
                <option value="Active">Active</option>
                <option value="BuyBack">BuyBack</option>
                <option value="Refund">Refund</option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="unitName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Unit"
                defaultValue={((getNavigation || {}).searchValues || {}).unitName}
              >
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
                <option value="Clinic">Clinic</option>
                <option value="Food Court">Food Court</option>
                <option value="Suite">Suite</option>
                <option value="Commercial Shop">Commercial Shop</option>
                <option value="Pearl Office">Pearl Office</option>
                <option value="Pearl Shop">Pearl Shop</option>
                <option value="Pearl Food Court">Pearl Food Court</option>
                <option value="Kiosk">Kiosk</option>
                <option value="Gold Souk">Gold Souk</option>
                <option value="Executive Office">Executive Office</option>
                <option value="Appartment">Appartment</option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="projectName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Project"
                onChange={e => onChangeDropdown(e)}
                defaultValue={((getNavigation || {}).searchValues || {}).projectName}
              >
                {(projects || []).map(val => (
                  <option key={val.name} value={val.name}>
                    {val.name}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="floorName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Floor"
                onChange={e => onChangeDropdown(e)}
                defaultValue={((getNavigation || {}).searchValues || {}).floorName}
              >
                {(floors || []).map(val => (
                  <option key={val.name} value={val.name}>
                    {val.name}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={4}>
            <Form.Item name="minPaid">
              <Input
                placeholder="Min. Payment Paid"
                onChange={e => getMinMaxValue(e)}
                name="minPaid"
                defaultValue={((getNavigation || {}).searchValues || {}).minPaid}
              />
            </Form.Item>
            <span className="error">{checkMinPaid}</span>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="maxPaid">
              <Input
                placeholder="Max. Payment Paid"
                onChange={e => getMinMaxValue(e)}
                name="maxPaid"
                defaultValue={((getNavigation || {}).searchValues || {}).maxPaid}
              />
            </Form.Item>
            <span className="error">{checkMaxPaid}</span>
          </Col>

          <Col className="gutter-row" span={4}>
            <Form.Item
              name="paymentPlan"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Payment Plan"
                defaultValue={((getNavigation || {}).searchValues || {}).paymentPlan}
              >
                <option value="full_payment">Full Payment</option>
                <option value="installments">Installment</option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={2}>
            {change && props && props.resultCount > 0 ? (
              <Tooltip placement="bottom" title={'Download search results in excel'}>
                <Form.Item>
                  <Button
                    type="default"
                    onClick={() => props.exportListing()}
                    className="export-btn"
                    block
                  >
                    <img src={exportImg} alt="logo not loaded" />
                  </Button>
                </Form.Item>
              </Tooltip>
            ) : (
              ''
            )}
          </Col>
          <Col className="gutter-row" span={2}>
            <Form.Item>
              <Button
                type="primary"
                className="search-btn"
                shape="round"
                htmlType="submit"
                key="submit"
                disabled={isDisabled}
                block
              >
                <SearchOutlined />
              </Button>
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={2}>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={onReset}
                  shape="round"
                  block
                  danger
                  disabled={!change}
                >
                  <ReloadOutlined />
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

SaleSearch.propTypes = {
  callBack: PropTypes.arrayOf(),
  exportListing: PropTypes.func,
  resultCount: PropTypes.number,
  clear: PropTypes.func,
}
export default SaleSearch
