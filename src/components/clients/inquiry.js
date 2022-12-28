import React from 'react'
import { Row, Col, Button } from 'antd'
import { Link } from 'react-router-dom'
const inquiry = props => {
  return (
    <div className="side-tile">
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <h3 className="title">{props.inquiryTitle && props.inquiryTitle}</h3>
        </Col>
        <Col span={12}>
          <label htmlFor="status">Status</label>
        </Col>
        <Col span={12}>
          {props.complaintStatus && props.complaintStatus !== '' && (
            <div
              className={` ${
                props.complaintStatus
                  ? props.complaintStatus === 'REVIEWED'
                    ? 'reviewed comment-type'
                    : props.complaintStatus === 'CONTACTED'
                      ? 'contacted comment-type'
                      : props.complaintStatus === 'RESOLVED'
                        ? 'resolved comment-type'
                        : props.complaintStatus === 'ON HOLD'
                          ? 'onhold comment-type'
                          : props.complaintStatus === 'IN PROGRESS'
                            ? 'inprogress comment-type'
                            : props.complaintStatus === 'DROPPED'
                              ? 'dropped comment-type'
                              : props.complaintStatus === 'PENDING'
                                ? 'pending comment-type'
                                : props.complaintStatus === 'DECLINED'
                                  ? 'declined comment-type'
                                  : props.complaintStatus === 'APPROVED'
                                    ? 'approved comment-type'
                                    : ''
                  : ''
              }`}
            >
              {props.complaintStatus.charAt(0).toUpperCase() +
                props.complaintStatus.slice(1).toLowerCase() || ''}
            </div>
          )}
        </Col>
        <Col span={12}>
          <label htmlFor="complainttype">Complaint Type: </label>
        </Col>
        <Col span={12}>
          <span>
            {/* {props.complaintType} */}
            {props.complaintType.charAt(0).toUpperCase() +
              props.complaintType.slice(1).toLowerCase() || ''}
          </span>
        </Col>
        <Col span={12}>
          <label htmlFor="trackingid">Tracking ID: </label>
        </Col>
        <Col span={12}>
          <span>{props.trackingID && props.trackingID}</span>
        </Col>
        <Col span={12}>
          <label htmlFor="clientname">Client Name: </label>
        </Col>
        <Col span={12}>
          <span>{props.clientName && props.clientName}</span>
        </Col>
        <Col span={12}>
          <label htmlFor="cnic">CNIC: </label>
        </Col>
        <Col span={12}>
          <span>{props.clientCnic && props.clientCnic}</span>
        </Col>
        <Col span={12}>
          <label htmlFor="phone">Phone: </label>
        </Col>
        <Col span={12}>
          <span>{props.clientPhone && props.clientPhone}</span>
        </Col>
        <Col span={24}>
          <Button className="view-detail-btn">
            <Link to={`/inquiry detail/${props.clientId}`}>View Details</Link>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default inquiry
