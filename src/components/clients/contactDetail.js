import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col } from 'antd'
import FloatLabel from 'components/floatlabel'
import './style.scss'

const contactDetail = props => {
  return (
    <div className="client-details">
      <Row gutter={16}>
        <Col span="12">
          <FloatLabel label="Phone Number *">
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Please enter a valid phone number',
                },
                () => ({
                  validator (_, value) {
                    if (value && !/^(\+92|0|0092)[0-9]{10}$/gm.test(value)) {
                      return Promise.reject(new Error('Please enter a valid phone number'))
                    }

                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Phone Number (Optional)">
            <Form.Item
              name="phone2"
              rules={[
                {
                  required: false,
                },
                () => ({
                  validator (_, value) {
                    if (value && !/^(\+92|0|0092)[0-9]{10}$/gm.test(value)) {
                      return Promise.reject(new Error('Please enter a valid phone number'))
                    }

                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Email">
            <Form.Item
              className="email"
              name="email"
              rules={[
                {
                  required: false,
                  type: 'email',
                  message: 'Please enter a valid email address',
                },
              ]}
            >
              <Input placeholder="Enter Email" />
            </Form.Item>
          </FloatLabel>
          <div className="emailError">{props.emailError ? 'Email already exists.' : ''}</div>
        </Col>
      </Row>
    </div>
  )
}

contactDetail.propTypes = {
  emailError: PropTypes.bool,
}

export default contactDetail
