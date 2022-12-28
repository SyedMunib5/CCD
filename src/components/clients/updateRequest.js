import React from 'react'
import Moment from 'react-moment'
import { Row, Col, Button } from 'antd'
import { Link } from 'react-router-dom'
const updateRequest = props => {
  return (
    <div className="side-tile">
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <h3 className="title">Update Request</h3>
        </Col>
        <Col span={12}>
          <label htmlFor="lastUpdated">Requested Date: </label>
        </Col>
        <Col span={12}>
          <span>
            <Moment
              utc="DD-MM-YYYY"
              format="DD-MM-YYYY"
              date={props.requestedDate && props.requestedDate}
            />
          </span>
        </Col>
        <Col span={12}>
          <label htmlFor="lastUpdated">Status: </label>
        </Col>
        <Col span={12}>
          {/* {props.updateRequestStatus} */}
          {props.updateRequestStatus && props.updateRequestStatus !== '' && (
            <div
              className={` ${
                props.updateRequestStatus
                  ? props.updateRequestStatus === 'REVIEWED'
                    ? 'reviewed comment-type'
                    : props.updateRequestStatus === 'CONTACTED'
                      ? 'contacted comment-type'
                      : props.updateRequestStatus === 'RESOLVED'
                        ? 'resolved comment-type'
                        : props.updateRequestStatus === 'ON HOLD'
                          ? 'onhold comment-type'
                          : props.updateRequestStatus === 'IN PROGRESS'
                            ? 'inprogress comment-type'
                            : props.updateRequestStatus === 'DROPPED'
                              ? 'dropped comment-type'
                              : props.updateRequestStatus === 'PENDING'
                                ? 'pending comment-type'
                                : props.updateRequestStatus === 'DECLINED'
                                  ? 'declined comment-type'
                                  : props.updateRequestStatus === 'APPROVED'
                                    ? 'approved comment-type'
                                    : ''
                  : ''
              }`}
            >
              {props.updateRequestStatus.charAt(0).toUpperCase() +
                props.updateRequestStatus.slice(1).toLowerCase() || ''}
            </div>
          )}
        </Col>
        <Col span={24}>
          <Button className="view-detail-btn">
            <Link to={`/update request detail/${props.updateRequestId}`}>View Details</Link>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default updateRequest
