import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, Select, Modal, Col, Row, Upload } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import './styles.scss'

const { Dragger } = Upload
const { TextArea } = Input
const StatusModal = props => {
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState(0)
  const [status, setStatus] = useState(props.statusValue)
  const [flag, setFlag] = useState(false)

  const uploadDoc = async options => {
    const { file } = options
    setFormValues(file)
  }

  const onFinish = async e => {
    const fmData = new FormData()
    fmData.append('attachment', formValues)
    fmData.append('comment', e.comment.target.value)
    if (flag) {
      fmData.append('status', status)
    }
    props && props.submitFinish(fmData)
  }

  const changeStatus = value => {
    setStatus(value)
    setFlag(true)
  }

  return (
    <>
      {props.visible ? (
        <div className="status-modal">
          <Modal
            mask={true}
            header={null}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.558)' }}
            visible={true}
            onCancel={() => props.onCancel()}
            className="my-modal"
            footer={false}
            closable={false}
          >
            <Form
              onFinish={e => onFinish(e)}
              name="status-modal-comment"
              form={form}
              className="add-comment"
            >
              <Row>
                <Col span={12}>
                  <div className="add-heading">Add Comment</div>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Select
                      className="ant-select-the-input pull-right"
                      value={status || ''}
                      name="status"
                      valuePropName="status"
                      onChange={value => changeStatus(value)}
                      // onChange={(value) => {setStatus(value)}}
                      style={{ width: 120 }}
                    >
                      <Select.Option key={1} value={'REVIEWED'}>
                        Reviewed
                      </Select.Option>
                      <Select.Option key={2} value={'CONTACTED'}>
                        Contacted
                      </Select.Option>
                      <Select.Option key={3} value={'RESOLVED'}>
                        Resolved
                      </Select.Option>
                      <Select.Option key={4} value={'ON HOLD'}>
                        On Hold
                      </Select.Option>
                      <Select.Option key={5} value={'IN PROGRESS'}>
                        In Progress
                      </Select.Option>
                      <Select.Option key={6} value={'DROPPED'}>
                        Dropped
                      </Select.Option>
                      <Select.Option key={7} value={'PENDING'}>
                        Pending
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24} className="uplaod-attachment">
                  Upload Attachments
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Dragger showUploadList={false} customRequest={uploadDoc}>
                      <p className="ant-upload-drag-icon">
                        <CloudUploadOutlined />
                      </p>
                      <p className="ant-upload-hint">
                        Drag & drop your files here or <span className="upload">upload</span>
                      </p>
                      <p className="upload-file-title">
                        Supports: Png, Jpg, Jpeg, Pdf, Xlsx, Gif, Csv, Docx
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <div htmlFor="comment" className="comment-title">
                    Comment
                  </div>
                  <Form.Item
                    name="comment"
                    valuePropName="comment"
                    rules={[{ required: true, message: 'Comment must be valid.' }]}
                  >
                    <TextArea rows={4} placeholder="Write here" />
                  </Form.Item>
                </Col>

                <Col>
                  <Button
                    htmlType="danger"
                    className="ant-btn-cancel"
                    onClick={() => props.onCancel()}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col span={1}></Col>
                <Col>
                  <Button htmlType="submit" className="ant-btn-submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

StatusModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  submitFinish: PropTypes.func,
  statusValue: PropTypes.string,
}
export default StatusModal
