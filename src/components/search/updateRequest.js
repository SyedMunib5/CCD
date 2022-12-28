import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchPageNavigation, removeSearchData } from '../../modules/search/helpers'
import { removePaginationData } from '../../modules/pagination/helpers'
import { Form, Input, Button, Row, Col, Select } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

import './style.scss'
const UpdateRequestSearch = props => {
  const [form] = Form.useForm()
  const [change, setChange] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const { getNavigation } = useSelector(state => state.search)

  const onFinish = async values => {
    const { cnic, currenRequestStatus, email, name, phone } = values
    if (!cnic && !currenRequestStatus && !email && !name && !phone) {
      // props && props.callBack(values)
    } else {
      let searchValues = {
        cnic: cnic,
        currenRequestStatus: currenRequestStatus,
        email: email,
        name: name,
        phone: phone,
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
    dispatch(removeSearchData())
    dispatch(removePaginationData())
  }

  const onValuesChange = () => {
    if (!change) setChange(true)
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
              name="phone"
              rules={[
                {
                  required: false,
                },
                () => ({
                  validator (_, value) {
                    if (value && isNaN(value)) {
                      return Promise.reject(new Error('Please enter a valid phone number'))
                    }

                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input
                placeholder="Phone"
                defaultValue={((getNavigation || {}).searchValues || {}).phone}
              />
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={6}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: false,
                  type: 'email',
                  message: 'Please enter a valid email address',
                },
              ]}
            >
              <Input
                placeholder="Email"
                defaultValue={((getNavigation || {}).searchValues || {}).email}
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="DECLINED">Declined</option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={14}></Col>
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

UpdateRequestSearch.propTypes = {
  callBack: PropTypes.func,
  clear: PropTypes.func,
}

export default UpdateRequestSearch
