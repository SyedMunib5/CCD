import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Form, Input, message, Divider } from 'antd'
import LoginService from 'services/login'
import './style.scss'
import { removeSearchData } from '../../modules/search/helpers'
import { useDispatch } from 'react-redux'

const ChangePassword = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    if (history.action === 'PUSH') {
      dispatch(removeSearchData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = async values => {
    values.id = localStorage.getItem('user_id')
    const updateResponse = await LoginService.updatePassword(values)
    if (updateResponse.status === true) {
      message.success(updateResponse.message)
    } else {
      message.error(updateResponse.message)
    }
  }

  return (
    <div className="change-password-container">
      <Row>
        <Col span={9} className="changepassword">
          <Form onFinish={onFinish} onSubmit={e => e.preventDefault()}>
            <p className="title">Password Details</p>
            <Divider />
            <div className="floatlabel">
              <Form.Item
                name="previousPassword"
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please enter old password',
                  },
                ]}
              >
                <Input.Password placeholder="Enter old password" />
              </Form.Item>
              <label htmlFor="Old Password" className="label labelfloat">
                Old Password
              </label>
            </div>

            <div className="floatlabel">
              <Form.Item
                name="password"
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please enter a password',
                  },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>
              <label htmlFor="New Password" className="labelfloat">
                New Password
              </label>
            </div>

            <div className="floatlabel">
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password',
                  },
                  ({ getFieldValue }) => ({
                    validator (_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(new Error('Passwords do not match'))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
              <label htmlFor="Confirm Password" className="labelfloat">
                Confirm Password
              </label>
            </div>

            <button type="submit" className="ant-btn-primary">
              Update
            </button>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
export default ChangePassword
