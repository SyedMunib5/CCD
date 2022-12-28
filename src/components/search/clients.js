import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Row, Col, DatePicker, Tooltip, Select } from 'antd'
import { fetchProjects } from '../../modules/sales/helpers'
import { searchPageNavigation, removeSearchData } from '../../modules/search/helpers'
import { removePaginationData } from '../../modules/pagination/helpers'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import './style.scss'
import exportImg from 'images/export.svg'
import moment from 'moment'

const ClientSearch = props => {
  const [form] = Form.useForm()
  const [change, setChange] = useState(false)
  const [startdate, setStartdate] = useState(null)
  const [minPaymentPaid, setMinPaymentPaid] = useState(0)
  const [maxPaymentPaid, setMaxPaymentPaid] = useState(0)
  const [checkMinPaid, setCheckMinPaid] = useState('')
  const [checkMaxPaid, setCheckMaxPaid] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [enddate, setEnddate] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const { getProjects } = useSelector(state => state.sales)
  const { getNavigation } = useSelector(state => state.search)

  const onFinish = async values => {
    const { cnic, createdFrom, createdTo, dob, maxPaid, minPaid, name, projectName } = values
    if (
      !cnic &&
      !createdFrom &&
      !createdTo &&
      !dob &&
      !maxPaid &&
      !minPaid &&
      !name &&
      !projectName
    ) {
      // props && props.callBack(values)
    } else {
      let searchValues = {
        cnic: cnic,
        createdFrom: createdFrom,
        createdTo: createdTo,
        dob: dob,
        maxPaid: maxPaid,
        minPaid: minPaid,
        name: name,
        projectName: projectName,
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
    setStartdate(null)
    setEnddate(null)
    setChange(false)
    props.clear()
    setStartdate(null)
    setMinPaymentPaid('')
    setMaxPaymentPaid('')
    setCheckMinPaid('')
    setCheckMaxPaid('')
    dispatch(removeSearchData())
  }

  const onValuesChange = values => {
    if (!change) setChange(true)
  }

  const disabledDate = current => {
    return current && current < moment(startdate, 'DD-MM-YYYY')
  }
  const disableAfterTodate = current => {
    return current && current >= moment(enddate, 'DD-MM-YYYY').add(1, 'days')
  }
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
  useEffect(() => {
    dispatch(fetchProjects())
    if (getNavigation && Object.keys(getNavigation).length !== 0 && history.action === 'POP') {
      onFinish(getNavigation)
      setChange(true)
    }
    if (history.action === 'PUSH') {
      dispatch(removeSearchData())
      dispatch(removePaginationData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="searchBox">
      <Form
        form={form}
        layout="inline"
        name="horizontal_login"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        {' '}
        <Row gutter={[16, 12]}>
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
              name="dob"
              rules={[
                {
                  type: 'date',
                  required: false,
                },
              ]}
            >
              <DatePicker
                format={'DD-MM-YYYY'}
                placeholder="Date of birth"
                defaultValue={((getNavigation || {}).searchValues || {}).dob}
              />
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
              name="createdFrom"
              rules={[
                {
                  type: 'date',
                  required: false,
                },
              ]}
            >
              <DatePicker
                format={'DD-MM-YYYY'}
                placeholder="Created Date From"
                selected={startdate}
                disabledDate={disableAfterTodate}
                defaultValue={((getNavigation || {}).searchValues || {}).createdFrom}
                allowClear={() => {
                  return true
                }}
                onChange={e => {
                  if (e !== null) {
                    setStartdate(e.format('DD-MM-YYYY'))
                  } else {
                    setStartdate(null)
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="createdTo"
              rules={[
                {
                  type: 'date',
                  required: false,
                },
              ]}
            >
              <DatePicker
                format={'DD-MM-YYYY'}
                placeholder="Created Date To"
                disabledDate={disabledDate}
                defaultValue={((getNavigation || {}).searchValues || {}).createdTo}
                allowClear={() => {
                  return true
                }}
                onChange={e => {
                  if (e !== null) {
                    setEnddate(e.format('DD-MM-YYYY'))
                  } else {
                    setEnddate(null)
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item
              name="name"
              rules={[
                {
                  required: false,
                },
                () => ({
                  validator (_, value) {
                    if (value && !/^[a-zA-Z ]*$/.test(value)) {
                      return Promise.reject(
                        new Error('Please enter a valid name with alphabets only'),
                      )
                    }

                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input
                placeholder="Name"
                defaultValue={((getNavigation || {}).searchValues || {}).name}
              />
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
                defaultValue={((getNavigation || {}).searchValues || {}).projectName}
              >
                {getProjects &&
                  ((getProjects || []).data || {}).map(val => (
                    <option key={val.name} value={val.name}>
                      {val.name}
                    </option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}></Col>
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
                htmlType="submit"
                shape="round"
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

ClientSearch.propTypes = {
  callBack: PropTypes.func,
  exportListing: PropTypes.func,
  resultCount: PropTypes.number,
  clear: PropTypes.func,
}

export default ClientSearch
