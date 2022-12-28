import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Button, Row, Col, message, Spin, Divider } from 'antd'
import RequestService from 'services/updateRequests'
import _ from 'underscore'
import Moment from 'react-moment'

import './style.scss'
const UpdateRequests = ({ match }) => {
  const {
    params: { id },
  } = match
  const [updatedData, setUpdatedData] = useState('')
  const [orignalData, setOrignalData] = useState('')
  const [flag, setFlag] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDetail = async id => {
    try {
      // setLoading(true)
      const response = await RequestService.updateRequestsDetail(id)
      setUpdatedData(response.customer.ccdUpdateRequests || {})
      setOrignalData(response.customer || {})

      if (response.status) {
      } else {
      }
    } catch (error) {
    } finally {
      // setLoading(false)
    }
  }

  const patchDetailsUpdateRequest = async (id, key) => {
    let ccdUpdateRequests = updatedData && updatedData
    const selectedData = ccdUpdateRequests[key]
    selectedData.requestStatus = 'APPROVED'
    try {
      const response = await RequestService.updateRequestPatchDetails(id, selectedData)
      response.status && message.success(`${response.message}`)
      response.status && setFlag(true)
      !response.status && message.error(`${response.message}`)
    } catch (error) {
      throw new Error(error)
    }
  }

  const cancelRequest = async key => {
    // setVisible(false);
    let payLoad = {}
    let ccdUpdateRequests = updatedData && updatedData
    const currentData = ccdUpdateRequests[key]
    let collectStatus = _.pluck(ccdUpdateRequests, 'requestStatus')
    let withOutApproveAndDecline = _.without(collectStatus, 'APPROVED', 'DECLINED')

    payLoad = {
      id: currentData.id,
      customerId: currentData.customerId,
      isPending: withOutApproveAndDecline.length > 1,
    }

    try {
      const response = await RequestService.cancelRequest(payLoad)
      response.status && setFlag(true)
      response.status && message.success(`${response.message}`)
      !response.status && message.error(`${response.message}`)
    } catch (error) {
      throw new Error(error)
    }
  }

  const checkStringMatched = (old, updated) => {
    if (old !== updated) {
      return 'right-updated'
    }
  }

  const checkRelativeType = (relationType, orignal, updated) => {
    let filteredData =
      orignalData &&
      _.filter(orignalData.ccdCustomerRelatives, function (data) {
        return data.relationType === relationType
      })
    if (filteredData.length > 0 && filteredData[0][orignal] === updated) {
      return 'right'
    } else {
      return 'right-updated'
    }
  }

  useEffect(() => {
    getDetail(id)
    setFlag(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag])
  return (
    <div className="detailBox">
      <div className="request">
        {!updatedData && (
          <div className="spin-position" style={{ marginTop: 10 }}>
            <Spin className="handle-margin" size="large" />
          </div>
        )}
        {updatedData &&
          updatedData.map((data, key) => {
            return (
              <>
                <Row>
                  {key > 0 ? <Divider /> : ''}
                  <Col span={8} className="requestdate">
                    <label htmlFor="dateRequested">Date Requested: </label>
                    <Moment format="MMMM-DD-YYYY" className="date-moment">
                      {data.createdAt}
                    </Moment>
                  </Col>
                  <Col span={12} className="comment-status">
                    <label htmlFor="status" className="float-left">
                      Status:{' '}
                    </label>
                    {data.requestStatus && data.requestStatus !== '' && (
                      <p
                        className={`float-left ${
                          data.requestStatus
                            ? data.requestStatus === 'REVIEWED'
                              ? 'reviewed comment-type'
                              : data.requestStatus === 'CONTACTED'
                                ? 'contacted comment-type'
                                : data.requestStatus === 'RESOLVED'
                                  ? 'resolved comment-type'
                                  : data.requestStatus === 'ON HOLD'
                                    ? 'onhold comment-type'
                                    : data.requestStatus === 'IN PROGRESS'
                                      ? 'inprogress comment-type'
                                      : data.requestStatus === 'DROPPED'
                                        ? 'dropped comment-type'
                                        : data.requestStatus === 'PENDING'
                                          ? 'pending comment-type'
                                          : data.requestStatus === 'APPROVED'
                                            ? 'approved comment-type'
                                            : data.requestStatus === 'DECLINED'
                                              ? 'dropped comment-type'
                                              : ''
                            : ''
                        }`}
                      >
                        {data.requestStatus.charAt(0).toUpperCase() +
                          data.requestStatus.slice(1).toLowerCase() || ''}
                      </p>
                    )}
                  </Col>
                </Row>
                <div className="">
                  <Row gutter={[16, 24]}>
                    <Col span="24" key={key}>
                      <div className="requestDiv">
                        <div className="requestHeader2">
                          <Row>
                            <Col span={8} className="title">
                              Labels
                            </Col>
                            <Col span={8} className="title">
                              Original
                            </Col>
                            <Col span={8} className="title">
                              Updated
                            </Col>
                          </Row>
                        </div>

                        <div className="mainTable">
                          <p>Applicant&#39;s Title</p>
                          <p>{orignalData && orignalData.customerTitle}</p>
                          <p id="title_ count ">{updatedData && data.customerTitle}</p>
                        </div>
                        <div className="mainTable">
                          <p>Applicant&#39;s Name</p>
                          <p>
                            {orignalData && orignalData.first_name}{' '}
                            {orignalData.last_name && orignalData.last_name.substring(0, 7)}
                          </p>
                          <p
                            className={
                              orignalData &&
                              checkStringMatched(
                                orignalData.first_name + ' ' + orignalData.last_name,
                                data.firstName + ' ' + data.lastName,
                              )
                            }
                            id="title_ count "
                          >
                            {updatedData && data.firstName + ' ' + data.lastName
                              ? data.lastName.substring(0, 7)
                              : ''}
                          </p>
                        </div>
                        {/* data is missing for S/O D/O
                          <div className="mainTable">
                            <p>Applicant's (S/O, D/O, W/O)</p>
                            <p className="left"> </p>
                            <p className="right" id="title_ count ">
                            {updatedData && updatedData.customer.ccdUpdateRequests[0].keyMissing }
                            </p>
                          </div> */}
                        <div className="mainTable">
                          <p>Applicant&#39;s Relative Name</p>
                          <p>
                            {orignalData &&
                              (orignalData.ccdCustomerRelatives || {}).map((data, key) => {
                                return (
                                  <React.Fragment key={key}>
                                    {data.relationType === 'OTHER' &&
                                      data.customerRelativeName &&
                                      data.customerRelativeName}
                                  </React.Fragment>
                                )
                              })}
                          </p>
                          <p
                            className={checkRelativeType(
                              'OTHER',
                              'customerRelativeName',
                              data.relativeName || '',
                            )}
                            id="title_ count "
                          >
                            {data.relativeName}
                          </p>
                        </div>

                        <div className="mainTable">
                          <p>Address</p>
                          <p>{orignalData && orignalData.address}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.address, data.address)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.address}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>City</p>
                          <p>{orignalData && orignalData.city}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.city, data.city)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.city}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>District</p>
                          <p>{orignalData && orignalData.district}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.district, data.district)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.district}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Province</p>
                          <p>{orignalData && orignalData.province}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.province, data.province)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.province}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Country</p>
                          <p>{orignalData && orignalData.country}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.country, data.country)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.country}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Phone</p>
                          <p>{orignalData && orignalData.phone}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.phone, data.phone)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.phone}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Phone (Optional)</p>
                          <p>{orignalData && orignalData.phone2}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.phone2, data.phone2)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.phone2}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Email ID</p>
                          <p>{orignalData && orignalData.email}</p>
                          <p
                            className={
                              orignalData && checkStringMatched(orignalData.email, data.email)
                            }
                            id="title_ count "
                          >
                            {updatedData && data.email}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Date of birth</p>
                          <p>
                            {orignalData && <Moment format="DD-MM-YYYY">{orignalData.dob}</Moment>}
                          </p>
                          <p
                            className={
                              orignalData &&
                              checkStringMatched(
                                <Moment format="DD-MM-YYYY">{orignalData.dob}</Moment>,
                                <Moment format="DD-MM-YYYY">{data.dob}</Moment>,
                              )
                            }
                            id="title_ count "
                          >
                            {updatedData && <Moment format="DD-MM-YYYY">{data.dob}</Moment>}
                          </p>
                        </div>
                        <div className="mainTable">
                          <p>Relation with Next of Kin</p>
                          <p>
                            {orignalData &&
                              orignalData.ccdCustomerRelatives.map((data, key) => {
                                return (
                                  <React.Fragment key={key}>
                                    {data.relationType === 'NOK' && data.relationWithCustomer}
                                  </React.Fragment>
                                )
                              })}
                          </p>
                          <p
                            className={checkRelativeType(
                              'NOK',
                              'relationWithCustomer',
                              data.nokRelation || '',
                            )}
                            id="title_ count "
                          >
                            {data.nokRelation}
                          </p>
                        </div>

                        <div className="mainTable">
                          <p className="last-chile">Next of Kin Name</p>
                          <p>
                            {orignalData &&
                              orignalData.ccdCustomerRelatives.map((data, key) => {
                                return (
                                  <React.Fragment key={key}>
                                    {data.relationType === 'NOK' &&
                                      data.customerRelativeName &&
                                      data.customerRelativeName}
                                  </React.Fragment>
                                )
                              })}
                          </p>
                          <p
                            className={checkRelativeType(
                              'NOK',
                              'customerRelativeName',
                              data.nokName || '',
                            )}
                            id="title_ count "
                          >
                            {data.nokName}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="adjust-row-padding" gutter={[16, 24]}>
                    <Col>
                      <Button
                        className={
                          data.requestStatus === 'APPROVED' || data.requestStatus === 'DECLINED'
                            ? 'disable'
                            : 'ant-btn-cancel'
                        }
                        onClick={() => cancelRequest(key)}
                        disabled={
                          (data.requestStatus === 'APPROVED' ||
                            data.requestStatus === 'DECLINED') &&
                          true
                        }
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="success"
                        className={
                          data.requestStatus === 'APPROVED' || data.requestStatus === 'DECLINED'
                            ? 'disable'
                            : 'ant-btn-submit'
                        }
                        onClick={() => patchDetailsUpdateRequest(data.customerId, key)}
                        disabled={
                          (data.requestStatus === 'APPROVED' ||
                            data.requestStatus === 'DECLINED') &&
                          true
                        }
                      >
                        Confirm
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            )
          })}
      </div>
    </div>
  )
}

UpdateRequests.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}

export default UpdateRequests
