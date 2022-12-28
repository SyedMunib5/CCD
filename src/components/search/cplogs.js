import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Form, Input, Button, Row, Col, DatePicker } from 'antd'

import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import './style.scss'
import moment from 'moment'

const CpLogs = props => {
  const [form] = Form.useForm()
  const [change, setChange] = useState(false)
  const [startdate, setStartdate] = useState(null)
  const [enddate, setEnddate] = useState(null)

  const onFinish = async values => {
    const { cnic, dateFrom, dateTo, name } = values
    if (!cnic && !dateFrom && !dateTo && !name) {
      // props && props.callBack(values)
    } else props && props.callBack(values)
  }

  const onReset = () => {
    form.resetFields()
    setStartdate(null)
    setEnddate(null)
    setChange(false)
    props.clear()
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
              <Input placeholder="CNIC" />
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
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="dateFrom"
              rules={[
                {
                  type: 'date',
                  required: false,
                },
              ]}
            >
              <DatePicker
                format={'DD-MM-YYYY'}
                placeholder="Date From"
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
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="dateTo"
              rules={[
                {
                  type: 'date',
                  required: false,
                },
              ]}
            >
              <DatePicker
                format={'DD-MM-YYYY'}
                placeholder="Date To"
                selected={enddate}
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
              />
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={20}></Col>
          <Col className="gutter-row" span={2}>
            <Form.Item>
              <Button
                type="primary"
                className="search-btn"
                htmlType="submit"
                shape="round"
                // disabled={isDisabled}
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

CpLogs.propTypes = {
  callBack: PropTypes.arrayOf(),
  resultCount: PropTypes.number,
  clear: PropTypes.func,
}

export default CpLogs
