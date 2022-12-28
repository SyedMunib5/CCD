import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button, Input, Divider } from 'antd'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchPageNavigation, removeSearchData } from '../../modules/search/helpers'
import { removePaginationData } from '../../modules/pagination/helpers'
import './style.scss'
const DashboardSearch = props => {
  const [searchString, setSearchString] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()
  const { getNavigation } = useSelector(state => state.search)
  const [form] = Form.useForm()

  const onReset = () => {
    setSearchString('')
    form.resetFields()
    props.clear()
    dispatch(removeSearchData())
    dispatch(removePaginationData())
  }
  useEffect(() => {
    setSearchString('')
  }, [])

  const onFinish = async values => {
    const {
      cnic,
    } = values
    if (
      !cnic
    ) {
    } else {
      dispatch(
        searchPageNavigation({
          'cnic': cnic,
        }),
      )
      props && props.search(values)
    }
  }
  useEffect(() => {
    if (getNavigation && Object.keys(getNavigation).length !== 0 && history.action === 'POP') {
      onFinish(getNavigation)
    } if (history.action === 'PUSH') {
      dispatch(removeSearchData())
      dispatch(removePaginationData())
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Row className="dashboard-search">
      <Col span={24}>
        <Form form={form} onFinish={onFinish}>
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
              className="search-input"
              placeholder="Enter CNIC Number"
              onChange={ev => {
                ev.preventDefault()
                setSearchString(ev.target.value)
              }}
              defaultValue={(getNavigation || {}).cnic || ''}
            />
          </Form.Item>
          {searchString || getNavigation ? <Divider type="vertical" className="vertical-divider" /> : ''}

          <Button
            icon={<SearchOutlined />}
            className="search-button"
            htmlType="submit"
            key="submit"
          />
          {searchString || getNavigation ? (
            <Button icon={<CloseOutlined />} className="reset-button" onClick={onReset}></Button>
          ) : (
            ''
          )}
        </Form>
      </Col>
    </Row>
  )
}

DashboardSearch.propTypes = {
  search: PropTypes.func,
  clear: PropTypes.func,
}

export default DashboardSearch
