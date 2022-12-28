import React, { useState } from 'react'
import LoginService from 'services/login'
import { setToken, setUserId, setUserType, setUserFullName } from 'libs/utils/storage'
import { MESSAGES } from 'libs/utils/messages'
import { ROUTES } from 'routes'
import FloatLabel from 'components/floatlabel/index'
import { Form, Input, Button, Row, Col, Image, Alert, message } from 'antd'
import logo from 'images/login_logo.svg'

import './style.scss'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [invalidCred, setInvalidCred] = useState(false)
  const [username, setusername] = useState('')
  const [userpassword, setuserpassword] = useState('')

  const onFinish = async credentials => {
    setLoading(true)
    try {
      const resp = await LoginService.login(credentials)
      if (resp.status) {
        setToken(resp.token || '')
        setUserId((resp.user || {}).id || '')
        setUserType((resp.user || {}).type || '')
        const fullName = `${(resp.user || {}).firstName || ''} ${(resp.user || {}).lastName || ''}`
        setUserFullName(fullName)

        window.location.href = ROUTES.dashboard
      } else {
        setInvalidCred(true)
      }
    } catch (error) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = errorInfo => {
    setInvalidCred(false)
  }

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: 'Please input your ${name}!',
    types: {
      email: MESSAGES.login.invalidEmail,
    },
  }

  return (
    <div className="login-body">
      <Row justify="space-around" align="middle">
        <Col span={7}>
          <div className="login-box-body">
            <Image src={logo} width={150} preview={false} alt="not found" />
            <div className="login-form">
              <Form
                name="login"
                initialValues={{
                  email: '',
                  password: '',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                validateMessages={validateMessages}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      required: true,
                      message: 'Please enter a valid email address',
                    },
                  ]}
                >
                  <div className="login-input">
                    <FloatLabel label="Email" name="Email">
                      <Input
                        value={username}
                        onChange={e => setusername(e.target.value)}
                        placeholder="Enter email"
                      />
                    </FloatLabel>
                  </div>
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a password',
                    },
                  ]}
                >
                  <div className="login-input">
                    <FloatLabel label="Password" name="Password">
                      <Input.Password
                        value={userpassword}
                        onChange={e => setuserpassword(e.target.value)}
                        defaultValue=""
                        placeholder="Enter password"
                      />
                    </FloatLabel>
                  </div>
                </Form.Item>

                {invalidCred && (
                  <Alert
                    className="invalid-cred"
                    message={MESSAGES.login.invalidCred}
                    type="error"
                    showIcon
                  />
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    className="login-btn"
                    htmlType="submit"
                    shape="round"
                    loading={loading}
                    block
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Login
