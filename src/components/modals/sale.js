import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

import { Button, Spin, Row, Col, Space, message, Avatar, Upload, Empty } from 'antd'
import Table from 'components/table'
import SalesService from 'services/sales'
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import docx from 'images/docx.svg'
import xls from 'images/xls.svg'
import pdf from 'images/pdf.svg'
import allImages from 'images/png-jpg-jpeg.svg'
import other from 'images/other.svg'
import csv from 'images/csv.svg'

// Import Interfaces`
import './style.scss'
const Sale = ({ match }) => {
  const {
    params: { id },
  } = match
  const [loading, setLoading] = useState(false)
  const [saleData, setSaleData] = useState([])
  const [installment, setInstallment] = useState([])
  const [name, setName] = useState('')
  const [docs, setDocs] = useState([])
  let x = 1
  const uploadDoc = async options => {
    const { onError, file, filename } = options
    const fmData = new FormData()
    fmData.append('ccdDocument', file)
    fmData.append('saleId', id)
    fmData.append('documentType', filename)
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    }
    try {
      const res = await SalesService.uploadDoc(fmData, requestOptions)
      if (res.status) {
        getSaleDetail(id)
        if (x === 1) {
          message.success('Document uploaded successfully')
          x++
        }
      } else {
        if (filename === 'Registry' && res.message.Registry) {
          message.error(res.message.Registry)
        } else if (filename === 'Plan' && res.message.Plan) {
          message.error(res.message.Plan)
        } else {
          message.error('Please upload a valid file type')
        }
      }
    } catch (err) {
      // console.log('Eroor: ', err)
      // const error = new Error('Some error')
      onError({ err })
    }
  }

  const docColumns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: '2',
    },
    {
      title: 'File Type',
      dataIndex: 'fileType',
      key: '1',
    },

    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: '3',
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      key: 'operation',
    },
  ]

  const columns = [
    {
      title: 'Serial #',
      dataIndex: 'count',
      key: '1',
    },
    {
      title: 'Amount',
      dataIndex: 'installmentAmount',
      key: '2',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '3',
      className: 'payment-status',
      render (text) {
        return {
          props: {
            style: { color: text === 'Cleared ' ? '#2dca89' : '#4d4f5c' },
          },
          children: <div>{text}</div>,
        }
      },
    },
    {
      title: 'Receiving Date',
      dataIndex: 'paymentTime',
      key: '4',
    },
    {
      title: 'Mode',
      dataIndex: 'type',
      key: '5',
    },
    {
      title: 'Type',
      dataIndex: 'paymentCategory',
      key: '6',
    },
  ]

  const changeDocStatus = async (documentId, status) => {
    try {
      setLoading(true)
      const response = await SalesService.changeDocStatus(documentId, status)
      if (response.status) {
        await getSaleDetail(id)
        message.success('Document status updated successfully')
      } else {
        message.error('Document status not updated, Please try again')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDocument = async documentId => {
    try {
      setLoading(true)
      const response = await SalesService.deleteDocument(documentId)
      if (response.status) {
        await getSaleDetail(id)
        message.success('File deleted successfully')
      } else {
        message.error('File not deleted, Please try again')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadDocument = async id => {
    try {
      setLoading(true)
      const response = await SalesService.downloadDocument(id)
      // Open the URL on new Window
      window.open(response, 'download')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const upperCaseArray = str => {
    const wordRegex = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g
    let result = str.match(wordRegex)
    return (
      result[0].charAt(0).toUpperCase() +
      result[0].slice(1).toLowerCase() +
      ' ' +
      (result[1] ? result[1].toLowerCase() : '')
    )
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSaleDetail = async id => {
    try {
      setLoading(true)
      const salesResponse = await SalesService.saleDetail(id)
      if (salesResponse.status) {
        setSaleData(salesResponse.sale)
        const fullname =
          (salesResponse.sale.customer.first_name || '') +
          ' ' +
          (salesResponse.sale.customer.last_name || '')
        setName(fullname)
        let downpayment = {
          key: 'Downpayment',
          count: 1,
          installmentAmount: Number(salesResponse.sale.downPayment || 0).toLocaleString(),
          status: salesResponse.sale.downPaymentTime ? 'Cleared ' : '',
          paymentCategory: 'Down payment',
          paymentTime: (
            <Moment format="DD-MM-YYYY">{salesResponse.sale.downPaymentTime || ''}</Moment>
          ),
          type: '',
        }
        const data =
          salesResponse.sale.cmInstallments.map((val, index) => ({
            key: val.id,
            count: index + 2,
            installmentAmount: Number(val.installmentAmount || 0).toLocaleString(),
            status: upperCaseArray(val.status || ''),
            method: val.type || '',
            paymentCategory: upperCaseArray(val.paymentCategory || ''),
            paymentTime: <Moment format="DD-MM-YYYY">{val.paymentTime || ''}</Moment>,
            type: upperCaseArray(val.type || ''),
          })) || []

        data.unshift(downpayment)
        setInstallment(data)
        const docsListing =
          salesResponse.sale.ccdSaleDocuments.map((val, index) => ({
            key: val.id,
            count: index + 1,
            fileName: (
              <>
                <div className="float-left">
                  <Avatar
                    shape="square"
                    size={45}
                    src={
                      val.originalName.split('.').pop() === 'docx'
                        ? docx
                        : val.originalName.split('.').pop() === 'pdf'
                          ? pdf
                          : val.originalName.split('.').pop() === 'xlsx'
                            ? xls
                            : val.originalName.split('.').pop() === 'csv'
                              ? csv
                              : val.originalName.split('.').pop() === 'jpg' ||
                          val.originalName.split('.').pop() === 'jpeg' ||
                          val.originalName.split('.').pop() === 'png'
                                ? allImages
                                : other
                    }
                  />
                </div>
                <div className="float-left file-name">{val.originalName}</div>
              </>
            ),
            dateCreated: <Moment format="MMMM DD,YYYY">{val.createdAt || ''}</Moment>,
            fileType:
              (val.documentType && val.documentType === 'Plan') || val.documentType === 'Registry'
                ? 'Title ' + val.documentType
                : val.documentType,
            operation: (
              <Space size="small" className="docActions">
                <Button type="link" onClick={() => downloadDocument(val.id)}>
                  <DownloadOutlined />
                </Button>
                <Button type="link" onClick={() => deleteDocument(val.id)}>
                  <DeleteOutlined />
                </Button>
                {val.documentType === 'Plan' || val.documentType === 'Registry' ? (
                  <Button type="link" onClick={() => changeDocStatus(val.id, !val.status)}>
                    {val.status ? 'Disable' : 'Enable'}
                  </Button>
                ) : (
                  ''
                )}
              </Space>
            ),
          })) || []
        setDocs(docsListing)
      } else {
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSaleDetail(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="detailBox">
      {loading ? (
        <div className="spin">
          <Spin className="handle-margin" size="large" />
        </div>
      ) : (
        <Row>
          <Col span="23">
            <div className="saleDetail">
              <div className="title">Summary</div>
              <div className="summary">
                <Row>
                  <Col span={5}>
                    <label htmlFor="data">Client Name</label>
                  </Col>
                  <Col span={7}>
                    <p>{name || ''} </p>
                  </Col>
                  <Col span={5}>
                    <label htmlFor="data">Total Price</label>
                  </Col>
                  <Col span={7}>
                    <p>{(((saleData || {}).unit || {}).finalPrice || 0).toLocaleString()} PKR</p>
                  </Col>

                  <Col span={5}>
                    <label htmlFor="data">Discount</label>
                  </Col>
                  <Col span={7}>
                    <p>
                      {(((saleData || {}).unit || {}).discount_amount || 0).toLocaleString()} PKR
                    </p>
                  </Col>

                  <Col span={5}>
                    <label htmlFor="data">Discounted Price</label>
                  </Col>
                  <Col span={7}>
                    <p>
                      {(((saleData || {}).unit || {}).discounted_price || 0).toLocaleString()} PKR
                    </p>
                  </Col>

                  <Col span={5}>
                    <label htmlFor="data">Total Paid</label>
                  </Col>
                  <Col span={7}>
                    <p>{(saleData.totalPaid || 0).toLocaleString()} PKR</p>
                  </Col>

                  <Col span={5}>
                    <label htmlFor="data">Remaining Amount</label>
                  </Col>
                  <Col span={7}>
                    <p>{((saleData || {} || {}).remaningAmount || 0).toLocaleString()} PKR</p>
                  </Col>
                </Row>
              </div>

              <div className="title">Unit Details</div>
              <div className="summary">
                {saleData ? (
                  <Row>
                    <Col span={5}>
                      <label htmlFor="data">Reference Number</label>
                    </Col>
                    <Col span={7}>
                      <p>{saleData.referenceNumber || '-'}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Unit</label>
                    </Col>
                    <Col span={7}>
                      <p>{(saleData.unit || {}).name || '-'}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Price/Sqft</label>
                    </Col>
                    <Col span={7}>
                      <p>{Number((saleData.unit || {}).pricePerSqFt || '-').toLocaleString()}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Size</label>
                    </Col>
                    <Col span={7}>
                      <p>
                        {Number(
                          (saleData.unit || {}).area ||
                            '-' + (saleData.unit || {}).area_unit ||
                            '-',
                        ).toLocaleString()}
                      </p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Rent</label>
                    </Col>
                    <Col span={7}>
                      <p>{Number((saleData.unit || {}).rent || '-').toLocaleString()}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Project Name</label>
                    </Col>
                    <Col span={7}>
                      <p>{(saleData.project || {}).name || '-'}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Investment Type</label>
                    </Col>
                    <Col span={7}>
                      <p>{saleData.investmentDuration || '-'}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Floor</label>
                    </Col>
                    <Col span={7}>
                      <p>{(saleData.floor || {}).name || '-'}</p>
                    </Col>

                    <Col span={5}>
                      <label htmlFor="data">Payment Plan</label>
                    </Col>
                    <Col span={7}>
                      <p>
                        {saleData.paymentPlan
                          ? saleData.paymentPlan.charAt(0).toUpperCase() +
                            saleData.paymentPlan
                              .replaceAll('_', ' ')
                              .slice(1)
                              .toLowerCase()
                          : '-'}
                      </p>
                    </Col>
                  </Row>
                ) : (
                  <Empty />
                )}
              </div>

              <div className="title">Documents</div>
              <div className="summary">
                <div className="info">
                  <Row gutter={[16, 16]}>
                    <Col span="8" className="docLabel">
                      <label htmlFor="Documents">Documents</label>
                    </Col>
                    <Col span="4">
                      <Upload
                        name="Documents"
                        showUploadList={false}
                        customRequest={uploadDoc}
                        multiple
                      >
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>
                    <Col span="8" className="docLabel">
                      <label htmlFor="Biometric">Biometric</label>
                    </Col>
                    <Col span="4">
                      <Upload
                        name="Biometric"
                        showUploadList={false}
                        customRequest={uploadDoc}
                        multiple
                      >
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>

                    <Col span="8" className="docLabel">
                      <label htmlFor="Cnic">NIC Photo copy</label>
                    </Col>
                    <Col span="4">
                      <Upload name="Cnic" showUploadList={false} customRequest={uploadDoc} multiple>
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>
                    <Col span="8" className="docLabel">
                      <label htmlFor="Tax">Tax CPR copy</label>
                    </Col>
                    <Col span="4">
                      <Upload name="Tax" showUploadList={false} customRequest={uploadDoc} multiple>
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>
                    <Col span="8" className="docLabel">
                      <label htmlFor="Rental">Rental Certificate copy</label>
                    </Col>
                    <Col span="4">
                      <Upload
                        name="Rental"
                        showUploadList={false}
                        customRequest={uploadDoc}
                        multiple
                      >
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>
                    <Col span="8" className="docLabel">
                      <label htmlFor="Plan">Title Plan</label>
                    </Col>
                    <Col span="4">
                      <Upload name="Plan" showUploadList={false} customRequest={uploadDoc}>
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>

                    <Col span="8" className="docLabel">
                      <label htmlFor="Registry">Title Registry</label>
                    </Col>
                    <Col span="4">
                      <Upload name="Registry" showUploadList={false} customRequest={uploadDoc}>
                        <Button type="dashed" className="uploadButton">
                          Upload
                        </Button>
                      </Upload>
                    </Col>
                  </Row>
                </div>
                <div className="document-table">
                  <div className="uploaded-documents-title">Uploaded Documents</div>
                  <Table columns={docColumns} listing={docs} isDetail={true} />
                </div>
              </div>

              <h4 className="title">Payments</h4>
              <div className="table-summary">
                <Table columns={columns} listing={installment} isDetail={true} />
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  )
}

Sale.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}

export default Sale
