import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CUSTOMERS, COMPLAINTS } from 'libs/utils/constants'

import { Row, Col, Button, Divider } from 'antd'

import './style.scss'
const Tile = ({ obj = {}, type = '', getIndex = '' }) => {
  return (
    <Row>
      <Col span={24} style={getIndex === 4 ? { marginBottom: '1px' } : { marginBottom: '20px' }}>
        <div className="tile">
          <div className="content">
            {type === COMPLAINTS ? (
              <Row>
                <Col span={24}>
                  <div className="title-div">
                    <span className="complaint-type">
                      <label>{obj.title || null}</label>{' '}
                    </span>

                    {obj.status && obj.status !== '' && (
                      <p
                        className={`pull-right ${
                          obj.status
                            ? obj.status === 'REVIEWED'
                              ? 'reviewed comment-type'
                              : obj.status === 'CONTACTED'
                                ? 'contacted comment-type'
                                : obj.status === 'RESOLVED'
                                  ? 'resolved comment-type'
                                  : obj.status === 'ON HOLD'
                                    ? 'onhold comment-type'
                                    : obj.status === 'IN PROGRESS'
                                      ? 'inprogress comment-type'
                                      : obj.status === 'DROPPED'
                                        ? 'dropped comment-type'
                                        : obj.status === 'PENDING'
                                          ? 'pending comment-type'
                                          : ''
                            : ''
                        }`}
                      >
                        {obj.status.charAt(0).toUpperCase() + obj.status.slice(1).toLowerCase() ||
                          ''}
                      </p>
                    )}
                  </div>
                </Col>
                <Col span={5} className="user-info">
                  <span>Complaint Type </span>
                  <p>{obj.type || null}</p>
                </Col>
                <Col span={5} className="user-info">
                  <span>Tracking ID</span>
                  <p>{obj.tracking_id || 'NA'}</p>
                </Col>
                <Col span={5} className="user-info">
                  <span>Client Name</span>
                  <p>
                    {' '}
                    {obj.customer.first_name && obj.customer.last_name
                      ? obj.customer.first_name + obj.customer.last_name
                      : 'NA'}
                  </p>
                </Col>
                <Col span={5} className="user-info">
                  <span>CNIC</span>
                  <p>{obj.cnic || (obj.customer || {}).cnic || 'NA'}</p>
                </Col>
                <Col span={4} className="user-info">
                  <span>Phone</span>
                  <p>{type === CUSTOMERS ? obj.phone || 'NA' : obj.customer.phone}</p>
                </Col>
                <Col span={24}>
                  {obj.description && obj.description !== '' && obj.description !== null ? (
                    <div className="description">
                      <div>{obj.description}</div>
                    </div>
                  ) : null}
                </Col>
                <Col>
                  <Button
                    type="link"
                    shape="round"
                    htmlType="submit"
                    className="view-enter-details-btn pull-right"
                  >
                    <Link to={`/inquiry detail/${obj.id}`}>View details</Link>
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}

            {type === CUSTOMERS ? (
              <Row>
                <Col span={24}>
                  <h3 className="username">
                    {obj.first_name || ''} {obj.last_name || ''}
                  </h3>
                </Col>
                <Col span={9} className="user-info">
                  <Row>
                    <Col span={12}>
                      <span>CNIC:</span>
                    </Col>
                    <Col span={12} className="pull-right">
                      {' '}
                      {obj.cnic || (obj.customer || {}).cnic || 'NA'}
                    </Col>
                  </Row>
                  {type === CUSTOMERS ? (
                    <Row className="email-investment-margin">
                      <Col span={12}>
                        <span>Email:</span>
                      </Col>
                      <Col span={12} className="pull-right">
                        {obj.email || 'NA'}
                      </Col>
                    </Row>
                  ) : null}
                </Col>
                <Col span={6}>
                  <Divider type="vertical" className="vertical-divider" />
                </Col>
                <Col span={9} className="user-info">
                  <Row>
                    <Col span={12}>
                      <span>Phone:</span>
                    </Col>
                    <Col span={12} className="pull-right">
                      {obj.phone || 'NA'}
                    </Col>
                  </Row>
                  <Row className="email-investment-margin">
                    <Col span={12}>
                      <span>Investment:</span>
                    </Col>
                    <Col span={12} className="pull-right">
                      {obj.armsProjectLeads[0].referenceNumber || '-'}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Button
                    type=""
                    htmlType="submit"
                    shape="round"
                    className="greetings pull-right view-enter-details-btn"
                  >
                    <Link to={`/client detail/${obj.id}`}>Enter Details</Link>
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}
          </div>
        </div>
      </Col>
    </Row>
  )
}

Tile.propTypes = {
  obj: PropTypes.shape(),
  type: PropTypes.string,
  getIndex: PropTypes.string,
}

export default Tile
