import React, { useState, useEffect } from 'react'
import { MESSAGES } from 'libs/utils/messages'
import { useDispatch, useSelector } from 'react-redux'

import Images from 'components/Images'
import { fetchProjectSummary } from '../../../modules/dashboard/projectSummary/helpers'

import { Row, Col, message, Spin } from 'antd'

import './style.scss'

const ProjectSummary = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [projectSummary, setProjectSummary] = useState([])
  const dispatch = useDispatch()
  const { fetchProjectSummaryData } = useSelector(state => state.projectSummary)
  const getProjectSummary = async () => {
    try {
      setIsLoading(true)

      const resp = fetchProjectSummaryData

      if (resp.status) {
        const projects = (resp.projects || []).reduce((acc, cur) => {
          return [
            ...acc,
            {
              projectName: cur.name || '',
              totalSales:
                ((resp.salesCount || []).find(saleObj => saleObj.name === cur.name) || {})
                  .SalesCount || 0,
              fullPaymentSales:
                (
                  (resp.fullPayment || []).find(
                    fullPaymentObj => fullPaymentObj.name === cur.name,
                  ) || {}
                ).fullPaymentCount || 0,
              installmentSales:
                (
                  (resp.installment || []).find(
                    installmentObj => installmentObj.name === cur.name,
                  ) || {}
                ).installmentCount || 0,
              totalClients:
                ((resp.customerCount || []).find(custObj => custObj.name === cur.name) || {})
                  .customerCount || 0,
            },
          ]
        }, [])
        setProjectSummary(projects)
      } else {
        // message.error(resp.message || MESSAGES.apiError)
      }
    } catch (e) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
    }
  }

  useEffect(() => {
    dispatch(fetchProjectSummary())
    setIsLoading(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getProjectSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProjectSummaryData])

  useEffect(() => {
    projectSummary.length > 0 && setIsLoading(false)
  }, [projectSummary])
  return (
    <div className="summary">
      {isLoading === true && (
        <div className="spinner">
          <Spin className="handle-margin" size="large" />
        </div>
      )}
      {!isLoading && projectSummary.length > 0 ? (
        projectSummary.map((project, index) => {
          return (
            <div key={`${project.projectName || 'no-name'}-${index}`} className="summary-card">
              <Row>
                <Col span={22} className="sub-card">
                  <Images name={project.projectName.toLowerCase()} />

                  <div className="content">
                    <div className="project-name">{project.projectName || 'No Name'}</div>
                    <p>
                      Total Sales
                      <span>{project.totalSales || null}</span>
                    </p>
                    <p>
                      Total Clients
                      <span>{project.totalClients || null}</span>
                    </p>
                    <p>
                      Full Payment Sales
                      <span>{project.fullPaymentSales || null}</span>
                    </p>
                    <p>
                      Installment Sales
                      <span>{project.installmentSales || null}</span>
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          )
        })
      ) : (
        <Row style={{ justifyContent: 'center' }}>
          {projectSummary.length > 0 && (
            <Col span={6}>
              <p>No Projects Found!</p>
            </Col>
          )}
        </Row>
      )}
    </div>
  )
}

export default ProjectSummary
