import React, { useState, useEffect } from 'react'

import { MESSAGES } from 'libs/utils/messages'
import DashboardService from 'services/dashboard'

import { Row, Col, message, Spin } from 'antd'

import './style.scss'

const DemoGraphics = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [demoGraphics, setDemoGraphics] = useState({})

  const getDemoGraphics = async () => {
    try {
      setIsLoading(true)
      const resp = await DashboardService.getDemoGraphics()
      if (resp.status) {
        const countObj = (resp.complaints || []).reduce((acc, cur) => {
          return {
            ...acc,
            [cur.status]: cur.count || 0,
          }
        }, {})
        setDemoGraphics({ ...countObj, total: resp.count || 0 })
      } else {
        message.error(resp.message || MESSAGES.apiError)
      }
    } catch (e) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDemoGraphics()
  }, [])

  return (
    <Row className="demoGrahpics">
      {isLoading ? (
        <div className="spinner">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Col span={6}>
            <div className="content">
              <p className="title">Urgent Complaints</p>
              <p className="count">{demoGraphics.INPROGRESS || 0}</p>
            </div>
          </Col>
          <Col span={6}>
            <div className="content">
              <p className="title">Pending Complaints</p>
              <p className="count">{demoGraphics.PENDING || 0}</p>
            </div>
          </Col>
          <Col span={6}>
            <div className="content">
              <p className="title">Resolved Complaints</p>
              <p className="count">{demoGraphics.RESOLVED || 0}</p>
            </div>
          </Col>
          <Col span={6}>
            <div className="content noRightBorder">
              <p className="title">Total Complaints</p>
              <p className="count">{demoGraphics.total || 0}</p>
            </div>
          </Col>
        </>
      )}
    </Row>
  )
}

export default DemoGraphics
