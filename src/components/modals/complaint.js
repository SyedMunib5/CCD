import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Spin, message, Row, Col, Empty } from 'antd'
import ComplaintService from 'services/complaints'
import { MESSAGES } from 'libs/utils/messages'
import { getUserId } from 'libs/utils/storage'
import StatusModal from './statusModal/statusModal'
import { DownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import './style.scss'

const Modals = ({ match }) => {
  const {
    params: { id },
  } = match

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [comments, setComments] = useState([])
  const [modalValue, setModalValue] = useState('')
  const [visibleFlag, setVisibleFlag] = useState(false)
  const [form] = Form.useForm()

  const messagesEnd = useRef()

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
  }

  const downloadDocument = async id => {
    try {
      setLoading(true)
      const response = await ComplaintService.attachmentDownload(id)
      // Open the URL on new Window
      window.open(response, 'download')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    messagesEnd.current && scrollToBottom()
  }, [])

  const getComplaintDetail = async id => {
    try {
      setLoading(true)
      const complaintResponse = await ComplaintService.complaintDetail(id)
      if (complaintResponse && complaintResponse.status) {
        const val = complaintResponse.complaints || {}
        const data =
          {
            tracking_id: val.tracking_id || '',
            cnic: ((val || {}).customer || {}).cnic || '',
            fullname:
              ((val || {}).customer || {}).first_name ||
              '' + ' ' + ((val || {}).customer || {}).last_name ||
              '',
            phone: ((val || {}).customer || {}).phone || '',
            title: val.title || '',
            status: val.status || '',
            description: val.description || '',
            type: val.type || '',
          } || []
        setData(data)
        // setStatus(data.status)
        setComments([...(val.ccdComments || [])])
      } else {
        message.error(MESSAGES.apiError)
      }
    } catch (error) {
      //  message.error(MESSAGES.defaultError)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const CommentList = ({ comments }) => (
    <div className="inquiry-container">
      <p className="comments-title heading-fontsize">Comments</p>
      {comments.length > 0 ? (
        comments.map((data, key) => {
          return (
            <div className="ant-comment" id="ant-comment" key={key}>
              <Row>
                <Col span={4}>
                  <span className="ant-comment-date">
                    {moment(data.createdAt || '').format('MMMM-DD-YYYY HH:MM')}
                  </span>
                </Col>
                <Col span={18}>
                  <div className="title-div">
                    <span className="complaint-title">
                      <label htmlFor="title-label">{data.title || null}</label>{' '}
                      {console.log(data.status)}
                    </span>
                    {data.status && data.status !== '' && (
                      <p
                        className={
                          data.status
                            ? data.status === 'REVIEWED'
                              ? 'reviewed comment-type'
                              : data.status === 'CONTACTED'
                                ? 'contacted comment-type'
                                : data.status === 'RESOLVED'
                                  ? 'resolved comment-type'
                                  : data.status === 'ON HOLD'
                                    ? 'onhold comment-type'
                                    : data.status === 'IN PROGRESS'
                                      ? 'inprogress comment-type'
                                      : data.status === 'DROPPED'
                                        ? 'dropped comment-type'
                                        : data.status === 'PENDING'
                                          ? 'pending comment-type'
                                          : ''
                            : ''
                        }
                      >
                        {data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase() ||
                          ''}
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="comment-description">{data.comment || ''}</div>
                </Col>
                <Col span={24}>
                  {data.originalName ? (
                    <button onClick={() => downloadDocument(data.id)} className="attachment">
                      <DownloadOutlined />
                      <label htmlFor="attachment-label">Attachment</label>
                    </button>
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </div>
          )
        })
      ) : (
        <Empty
          description="Hi, There is no comment for now.
      "
        />
      )}
      {/* <AlwaysScrollToBottom /> */}
      <div ref={messagesEnd}></div>
    </div>
  )
  CommentList.propTypes = {
    comments: PropTypes.array,
    length: PropTypes.number,
  }
  useEffect(() => {
    getComplaintDetail(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CommentModal = () => {
    setVisibleFlag(true)
  }

  const onFinish = async fmData => {
    let data = visibleFlag ? fmData : new FormData()
    data.append('tableName', 'ccdComment')
    data.append('table_id', id)
    data.append('armsUser_id', getUserId())
    // if (fmData.comment) {
    //   data.append('comment', fmData.comment)
    // } else {
    //   data.append('status', visibleFlag ? status || '' : '')
    // }
    try {
      const resp = await ComplaintService.addComment(data)
      // setLoading(true)
      if (resp.status) {
        message.success(`${resp.message}`)
        getComplaintDetail(id)
        setComments([...comments, resp.comment])
        setModalValue('')
        setVisibleFlag(false)
        // scrollToBottom()
        form.resetFields()
      } else {
        message.error('Please upload a valid file type')
      }
    } catch (error) {
      message.error(MESSAGES.defaultError)
      console.log(error)
      throw new Error()
    } finally {
      // setLoading(false)
    }
  }

  return (
    <div className="inquiry-container">
      {loading ? (
        <div className="spin">
          <Spin className="handle-margin" size="large" />
        </div>
      ) : (
        <Row>
          <Col span={24} className="complaint-box">
            {/* <h4>Inquiry Details</h4> */}
            <div className="complaint-section">
              <Col span={24}>
                <StatusModal
                  visible={visibleFlag}
                  key={visibleFlag}
                  submitFinish={onFinish}
                  value={modalValue}
                  onCancel={() => {
                    setVisibleFlag(false)
                    setModalValue('')
                  }}
                  statusValue={data.status}
                  className="adj"
                />
              </Col>
              <div className="top-content">
                <Row>
                  <Col span={21}>
                    <div className="title-div">
                      <p className="inquiry-type">{data.title || ''}</p>
                      {data.status && data.status !== '' && (
                        <p
                          style={{ float: 'left' }}
                          className={
                            data.status
                              ? data.status === 'REVIEWED'
                                ? 'reviewed comment-type'
                                : data.status === 'CONTACTED'
                                  ? 'contacted comment-type'
                                  : data.status === 'RESOLVED'
                                    ? 'resolved comment-type'
                                    : data.status === 'ON HOLD'
                                      ? 'onhold comment-type'
                                      : data.status === 'IN PROGRESS'
                                        ? 'inprogress comment-type'
                                        : data.status === 'DROPPED'
                                          ? 'dropped comment-type'
                                          : data.status === 'PENDING'
                                            ? 'pending comment-type'
                                            : ''
                              : ''
                          }
                        >
                          {data.status.charAt(0).toUpperCase() +
                            data.status.slice(1).toLowerCase() || ''}
                        </p>
                      )}
                    </div>
                  </Col>
                  <Col span={3}>
                    <button className="change-status" onClick={CommentModal}>
                      Change Status
                    </button>
                    {/* {select} */}
                  </Col>
                </Row>

                <Row>
                  <div className="complaint-type">
                    <Row>
                      <Col span={24}>
                        {' '}
                        <label htmlFor="complaint-label"> Complaint Type:</label>{' '}
                      </Col>
                      <Col span={24}>
                        <span>{data.type || '-'}</span>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        {' '}
                        <label htmlFor="complaint-label"> Tracking ID:</label>{' '}
                      </Col>
                      <Col span={24}>
                        <span>{data.tracking_id || ''}</span>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <label htmlFor="complaint-label"> Client Name:</label>
                      </Col>
                      <Col span={24}>
                        <span> {data.fullname || ''}</span>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <label htmlFor="complaint-label"> CNIC:</label>
                      </Col>
                      <Col span={24}>
                        <span> {data.cnic || ''}</span>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <label htmlFor="complaint-label"> Phone No:</label>
                      </Col>
                      <Col span={24}>
                        <span> {data.phone || ''}</span>
                      </Col>
                    </Row>
                  </div>
                  <Col span={23}>
                    <p className="description">{data.description}</p>
                  </Col>
                </Row>
              </div>
              {/* <Divider /> */}
              {/* //comment section */}
              <Col span={24}>
                <div className="">
                  {' '}
                  {comments.length > 0 && (
                    <div className="handle-scroll">
                      <CommentList comments={comments || ''} />{' '}
                    </div>
                  )}
                </div>
              </Col>
            </div>
            <Col span={24}>
              <Form.Item>
                <Button
                  htmlType="submit"
                  shape="round"
                  // type="primary"
                  className="add-comment-btn"
                  onClick={CommentModal}
                >
                  Add Comment
                </Button>
              </Form.Item>
            </Col>
          </Col>
        </Row>
      )}
    </div>
  )
}

Modals.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),

  comments: PropTypes.array,
  length: PropTypes.number,
}

export default Modals
