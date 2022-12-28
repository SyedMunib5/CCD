/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Empty } from 'antd'
import { fetchCustomerSalesListing } from '../../modules/clients/helpers'

const summary = props => {
  const dispatch = useDispatch()
  const { fetchCustomerSales } = useSelector(state => state.clients)
  useEffect(() => {
    dispatch(fetchCustomerSalesListing(props.userId && props.userId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <div className="side-tile">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <h3 className="title">Summary</h3>
          </Col>
          <Col span={12}>
            <label htmlFor="totalSales">Total Sales: </label>
          </Col>
          <Col span={12}>
            <span>{props.totalSales ? props.totalSales : '0'}</span>
          </Col>
          <Col span={12}>
            <label htmlFor="amountPaid">Total Amount Paid: </label>
          </Col>
          <Col span={12}>
            <span> {Number(props.totalPaid || 0).toLocaleString()} </span>
          </Col>
          <Col span={12}>
            <label htmlFor="dateCreated">Date Created: </label>
          </Col>
          <Col span={12}>
            <span>
              <Moment utc="DD-MM-YYYY" format="DD-MM-YYYY">
                {props.createdAt && props.createdAt}
              </Moment>
            </span>
          </Col>
          <Col span={12}>
            <label htmlFor="lastUpdated">Last Updated: </label>
          </Col>
          <Col span={12}>
            <span>
              <Moment utc="DD-MM-YYYY" format="DD-MM-YYYY">
                {props.updatedAt && props.updatedAt}
              </Moment>
            </span>
          </Col>
        </Row>
      </div>
      <h3 className="sale-listing-heading">Sale Listings</h3>
      <div className="sale-listing">
        {fetchCustomerSales.customer && fetchCustomerSales.customer[0].armsProjectLeads ? (
          fetchCustomerSales.customer[0].armsProjectLeads.map((val, index) => (
            <div
              className="side-tile"
              key={index}
              style={
                fetchCustomerSales.customer[0].armsProjectLeads.length > 2
                  ? { marginRight: '11px', marginLeft: '20px' }
                  : { marginRight: '15px', marginLeft: '20px' }
              }
            >
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <label htmlFor="totalSales">Project Name:</label>
                </Col>
                <Col span={12}>
                  <span>{((val || {}).project || {}).name || ''}</span>
                </Col>
                <Col span={12}>
                  <label htmlFor="amountPaid">Reference #: </label>
                </Col>
                <Col span={12}>
                  <span> {(val || {}).referenceNumber || ''} </span>
                </Col>
                <Col span={12}>
                  <label htmlFor="dateCreated">Payment Plan: </label>
                </Col>
                <Col span={12}>
                  <span className="text-transform">
                    {(((val || {}).projectProduct || {}).paymentPlan || '').replace(/_/g, ' ') ||
                      ''}
                  </span>
                </Col>
                <Col span={12}>
                  <label htmlFor="lastUpdated">Paid Amount: </label>
                </Col>
                <Col span={12}>
                  <span> {Number(val.installmentSum || 0).toLocaleString()} </span>
                </Col>
                <Col span={12}>
                  <label htmlFor="lastUpdated">Total Amount: </label>
                </Col>
                <Col span={12}>
                  <span> {Number(val.unit.finalPrice || 0).toLocaleString()} </span>
                </Col>
                <Col span={24}>
                  <Button className="view-detail-btn">
                    <Link to={`/sale detail/${val.id}`}>View Details</Link>
                  </Button>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </>
  )
}

export default summary
