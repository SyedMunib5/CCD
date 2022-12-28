import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col } from 'antd'
import FloatLabel from 'components/floatlabel'
import './style.scss'
const AddressDetail = props => {
  const [countryCode, setCountryCode] = useState('PK')
  const [stateCode, setStateCode] = useState('')

  const onChangeDropdown = e => {
    setCountryCode(e)
  }

  return (
    <div className="client-details">
      <Row gutter={16}>
        <Col span="8">
          <FloatLabel label="Country">
            <Form.Item rules={[{ required: false }]} name={'country'}>
              <Select onChange={e => onChangeDropdown(e)} placeholder="Select">
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
        <Col span="8">
          <FloatLabel label="Province">
            <Form.Item rules={[{ required: false }]} name={'province'}>
              <Select onChange={e => setStateCode(e)} placeholder="Select">
                {props.addressDropdowns.provinceList
                  ? props.addressDropdowns.provinceList.map(val =>
                    countryCode === val.countryCode ? (
                      <option key={val.name} value={val.isoCode}>
                        {val.name}
                      </option>
                    ) : (
                      ''
                    ),
                  )
                  : ''}
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="8">
          <FloatLabel label="City">
            <Form.Item rules={[{ required: false }]} name={'city'}>
              <Select placeholder="City">
                {props.addressDropdowns.cityList
                  ? props.addressDropdowns.cityList.map(val =>
                    countryCode === val.countryCode && stateCode === val.stateCode ? (
                      <option key={val.name} value={val.name}>
                        {val.name}
                      </option>
                    ) : (
                      ''
                    ),
                  )
                  : ''}
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span="24">
          <FloatLabel label="Address">
            <Form.Item name="address" rules={[{ required: false }]}>
              <Input.TextArea rows={4} placeholder="Enter Address" style={{ paddingTop: '17px' }} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </div>
  )
}

AddressDetail.propTypes = {
  addressDropdowns: PropTypes.array,
}

export default AddressDetail
