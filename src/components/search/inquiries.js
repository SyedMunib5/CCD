import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchPageNavigation, removeSearchData } from '../../modules/search/helpers'
import { removePaginationData } from '../../modules/pagination/helpers'
import { Form, Input, Button, Row, Col, Select, DatePicker } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

import './style.scss'
import moment from 'moment'

const Inquiries = props => {
  const [form] = Form.useForm()
  const [change, setChange] = useState(false)
  const [startdate, setStartdate] = useState(null)
  const [enddate, setEnddate] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const { getNavigation } = useSelector(state => state.search)

  const onFinish = async values => {
    const { cnic, createdFrom, createdTo, currenRequestStatus, name, referenceNumber } = values

    if (!cnic && !createdFrom && !createdTo && !currenRequestStatus && !referenceNumber && !name) {
      // props && props.callBack(values)
    } else {
      let searchValues = {
        cnic: cnic,
        createdFrom: createdFrom,
        createdTo: createdTo,
        currenRequestStatus: currenRequestStatus,
        name: name,
        referenceNumber: referenceNumber,
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
    setStartdate(null)
    setEnddate(null)
    props.clear()
    setStartdate(null)
    dispatch(removeSearchData())
    dispatch(removePaginationData())
  }

  const onValuesChange = () => {
    if (!change) setChange(true)
  }

  const disabledDate = current => {
    return current && current < moment(startdate, 'DD-MM-YYYY')
  }
  const disableAfterTodate = current => {
    return current && current >= moment(enddate, 'DD-MM-YYYY').add(1, 'days')
  }

  useEffect(() => {
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
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="referenceNumber"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                placeholder="Tracking Id"
                defaultValue={((getNavigation || {}).searchValues || {}).referenceNumber}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="cnic"
              rules={[
                { required: false },
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

          <Col className="gutter-row" span={6}>
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

          <Col className="gutter-row" span={6}>
            <Form.Item
              name="currenRequestStatus"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Status"
                defaultValue={((getNavigation || {}).searchValues || {}).currenRequestStatus}
              >
                <option value="ALL">All</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="CONTACTED">Contacted</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ON HOLD">On Hold</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="DROPPED">Dropped</option>
                <option value="PENDING">Pending</option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
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
                placeholder="Inquiry Date From"
                format={'DD-MM-YYYY'}
                selected={startdate}
                disabledDate={disableAfterTodate}
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
                defaultValue={((getNavigation || {}).searchValues || {}).createdFrom}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
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
                placeholder="Inquiry Date To"
                format={'DD-MM-YYYY'}
                disabledDate={disabledDate}
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
                defaultValue={((getNavigation || {}).searchValues || {}).createdTo}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}></Col>
          <Col className="gutter-row" span={2}>
            <Form.Item>
              <Button type="primary" className="search-btn" htmlType="submit" shape="round" block>
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

Inquiries.propTypes = {
  callBack: PropTypes.func,
  clear: PropTypes.func,
}

export default Inquiries
