import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col } from 'antd'
import FloatLabel from 'components/floatlabel'

const PesonalDetail = props => {
  return (
    <div className="client-details">
      <Row gutter={16}>
        <Col span="12">
          <FloatLabel label="Serial Number">
            <Form.Item className="serial" name="serialNumber" rules={[{ required: false }]}>
              <Input placeholder="Enter Serial Number" />
            </Form.Item>
          </FloatLabel>
          <div className="serialError">
            {props.serialError ? 'Serail Number already exists.' : ''}
          </div>
        </Col>
        <Col span="12">
          <FloatLabel label="Applicant Title">
            <Form.Item rules={[{ required: false }]} name={'customerTitle'}>
              <Select placeholder="Select">
                <option value="Mr.">Mr</option>
                <option value="Ms.">Ms</option>
                <option value="Miss.">Miss</option>
                <option value="Mrs.">Mrs</option>
                <option value="Dr.">Dr</option>
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="First Name">
            <Form.Item
              name="first_name"
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
              <Input placeholder="Enter First Name" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Last Name">
            <Form.Item
              name="last_name"
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
              <Input placeholder="Enter Last Name" />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Relation">
            <Form.Item rules={[{ required: false }]} name={'relationWithCustomerOther'}>
              <Select placeholder="select">
                <option value="D/O">D/O</option>
                <option value="S/O">S/O</option>
                <option value="W/O">W/O</option>
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="12">
          <FloatLabel label="Relative Name">
            <Form.Item name="customerRelativeNameOther" rules={[{ required: false }]}>
              <Input placeholder="Enter Relative Name" />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </div>
  )
}
PesonalDetail.propTypes = {
  data: PropTypes.object,
  serialError: PropTypes.bool,
}

export default PesonalDetail
