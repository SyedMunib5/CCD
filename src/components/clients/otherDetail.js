import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Row, Col, Select } from 'antd'
import FloatLabel from 'components/floatlabel'
import './style.scss'

const OtherDetail = props => {
  const [changePassword, setChangePassword] = useState(false)
  const passwordValidation = e => {
    e !== '' ? setChangePassword(true) : setChangePassword(false)
  }
  return (
    <div className="client-details">
      <Row gutter={16}>
        <Col span="12">
          <FloatLabel label="CNIC *">
            <Form.Item
              className="cnic"
              name="cnic"
              rules={[
                {
                  required: true,
                  message: 'Please enter 13 digit CNIC number without dashes',
                },
                () => ({
                  validator (_, value) {
                    if ((value && isNaN(value)) || (value.length !== 13 && value.length > 0)) {
                      return Promise.reject(
                        new Error('Please enter 13 digit CNIC number without dashes'),
                      )
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input placeholder="Enter CNIC" />
            </Form.Item>
          </FloatLabel>
          <div className="cnicError">{props.cnicError ? 'CNIC already exists.' : ''}</div>
        </Col>
        <Col span="12">
          <FloatLabel label="Date Of Birth *">
            <Form.Item name="dob" rules={[{ required: true, message: 'DOB must be valid.' }]}>
              <DatePicker format={'DD-MM-YYYY'} placeholder="Enter Date Of Birth" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Nationality">
            <Form.Item rules={[{ required: false }]} name={'nationality'}>
              <Select placeholder="Select">
                {props.addressDropdowns.countryList
                  ? props.addressDropdowns.countryList.map(val => (
                    <option key={val.isoCode} value={val.isoCode}>
                      {val.name}
                    </option>
                  ))
                  : ''}
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Relationship">
            <Form.Item rules={[{ required: false }]} name={'relationWithCustomerNOK'}>
              <Select placeholder="Select">
                <option value="Friends">Friends</option>
                <option value="Business Partner">Business Partner</option>
                <option value="Wife">Wife</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Father">Father</option>
                <option value="Son">Son</option>
                <option value="Husband">Husband</option>
                <option value="Daughter">Daughter</option>
                <option value="Mother">Mother</option>
                <option value="Cousin">Cousin</option>
                <option value="Nephew">Nephew</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunty">Aunty</option>
                <option value="Niece">Niece</option>
                <option value="Grandson">Grandson</option>
                <option value="Granddaughter">Granddaughter</option>
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Next Of Kin Name">
            <Form.Item
              name="customerRelativeNameNOK"
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
              <Input placeholder="Enter Next Of Kin Name" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Password">
            <Form.Item
              name="password"
              onChange={e => passwordValidation(e.target.value)}
              rules={[
                {
                  required: false,
                  message: 'Password must be valid.',
                },
              ]}
              hasFeedback
            >
              <Input.Password suffix={null} placeholder="Enter Password" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Confirm Password">
            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: changePassword,
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
              <Input.Password placeholder="Enter Confirm Password" />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </div>
  )
}

OtherDetail.propTypes = {
  addressDropdowns: PropTypes.array,
  cnicError: PropTypes.bool,
}

export default OtherDetail
