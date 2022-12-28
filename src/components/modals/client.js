import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Spin, message, Tabs, Row, Col, Empty } from 'antd'
import PersonalDetail from 'components/clients/personalDetail'
import AddressDetail from 'components/clients/addressDetail'
import ContactDetail from 'components/clients/contactDetail'
import OtherDetail from 'components/clients/otherDetail'
import Summary from 'components/clients/summary'
import UpdateRequest from 'components/clients/updateRequest'
import Inquiry from 'components/clients/inquiry'
import ClientsService from 'services/clients'
import { Country, State, City } from 'country-state-city'
import { MESSAGES } from 'libs/utils/messages'
import { fetchCustomerSummary } from '../../modules/clients/helpers'

// Import Interfaces`
import './style.scss'

const Modals = ({ match }) => {
  const {
    params: { id },
  } = match
  const dispatch = useDispatch()
  const { fetchClientDetails } = useSelector(state => state.clients)
  const location = useLocation()
  const history = useHistory()
  const { missingFields } = location.state ? location.state : ''
  const { saleId } = location.state ? location.state : ''
  const [addressDropdowns, setaddressDropdowns] = useState({})
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [emailExist, setEmailExist] = useState(false)
  const [cnicExist, setCnicExist] = useState(false)
  const [serialExist, setSerialExist] = useState(false)
  const [changeState, setChangeState] = useState(false)
  const { TabPane } = Tabs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getClientDetail = async id => {
    try {
      setLoading(true)
      const clientsResponse = await ClientsService.clientsDetail(id)
      if (clientsResponse.status) {
        const data = clientsResponse.customer
        const dropdowns = {
          countryList: Country.getAllCountries(),
          provinceList: State.getAllStates(),
          cityList: City.getAllCities(),
        }
        setaddressDropdowns(dropdowns)

        const relation = (data.ccdCustomerRelatives || []).map(relation => {
          if (relation.relationType === 'OTHER') {
            return {
              relationWithCustomerOther: relation.relationWithCustomer || '',
              customerRelativeNameOther: relation.customerRelativeName || '',
            }
          } else {
            return {
              relationWithCustomerNOK: relation.relationWithCustomer || '',
              customerRelativeNameNOK: relation.customerRelativeName || '',
            }
          }
        })
        form.setFieldsValue({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          serialNumber: data.serialNumber || '',
          customerTitle: data.customerTitle || undefined,
          address: data.address || '',
          city: data.city || undefined,
          country: data.country || undefined,
          district: data.district || undefined,
          province: data.province || undefined,
          cnic: data.cnic || '',
          dob: data.dob === null ? '' : moment(data.dob, 'YYYY-MM-DD'),
          nationality: data.nationality || undefined,
          email: data.email || '',
          phone: data.phone || '',
          phone2: data.phone2 || '',
          password: '',
          relationWithCustomerOther:
            (relation[0] && relation[0].relationWithCustomerOther
              ? relation[0].relationWithCustomerOther
              : undefined) ||
            (relation[1] && relation[1].relationWithCustomerOther
              ? relation[1].relationWithCustomerOther
              : undefined),
          customerRelativeNameOther:
            (relation[0] && relation[0].customerRelativeNameOther) ||
            (relation[1] && relation[1].customerRelativeNameOther),
          relationWithCustomerNOK:
            (relation[0] && relation[0].relationWithCustomerNOK) ||
            (relation[1] && relation[1].relationWithCustomerNOK),
          customerRelativeNameNOK:
            (relation[0] && relation[0].customerRelativeNameNOK) ||
            (relation[1] && relation[1].customerRelativeNameNOK),
        })
      } else {
        message.error(clientsResponse.message || MESSAGES.apiError)
      }
    } catch (error) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async values => {
    try {
      setCnicExist(false)
      setEmailExist(false)
      setSerialExist(false)
      setLoading(true)
      const ccdCustomerRelatives = [
        {
          customerRelativeName: values.customerRelativeNameNOK || '',
          relationWithCustomer: values.relationWithCustomerNOK || '',
          relationType: 'NOK',
        },
        {
          customerRelativeName: values.customerRelativeNameOther || '',
          relationWithCustomer: values.relationWithCustomerOther || '',
          relationType: 'OTHER',
        },
      ]
      const data = { ...values, ccdCustomerRelatives }
      delete data.customerRelativeNameNOK
      delete data.customerRelativeNameOther
      delete data.relationWithCustomerNOK
      delete data.relationWithCustomerOther
      if (data.serialNumber === '') delete data.serialNumber
      if (data.email === '') delete data.email
      const updateResponse = await ClientsService.updateClient(data, id)

      if (updateResponse.status) {
        if (missingFields) {
          // Applicant Title, Full Name, Last Name, Applicant (S/O, D/O, W/O), Applicant Relative Name, Address, CNIC'
          if (
            values.customerTitle &&
            values.first_name &&
            values.last_name &&
            values.relationWithCustomerOther &&
            values.customerRelativeNameOther &&
            values.address &&
            values.cnic
          ) {
            history.push({
              pathname: `/sales`,
              state: { contract: true, saleId: saleId, id: id },
            })
          } else {
            message.warning(
              'Client data updated succesfully but to generate contract you have to complete this form by submitting Applicant Title, Full Name, Last Name, Applicant (S/O, D/O, W/O), Applicant Relative Name, Address, CNIC',
            )
          }
        } else {
          setChangeState(true)
          message.success('Client data updated succesfully')
        }
      } else {
        if (updateResponse.message.Cnic) setCnicExist(true)
        if (updateResponse.message.Email) setEmailExist(true)
        if (updateResponse.message.serialNumber) setSerialExist(true)
      }
    } catch (error) {
      message.error(MESSAGES.defaultError)
      throw new Error()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getClientDetail(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    dispatch(fetchCustomerSummary(id))
    setChangeState(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeState])

  return (
    <>
      <div className="detailBox">
        <div className="userDetailTab">
          {loading ? (
            <div className="spin">
              <Spin className="handle-margin" size="large" />
            </div>
          ) : (
            <Row>
              <Col span="17" className="">
                <Form form={form} onFinish={onFinish}>
                  <div className="editForm main-container">
                    {missingFields ? (
                      <div style={{ color: '#ea6070' }}>
                        {'Contract not generated due to missing fields!'}
                        {
                          ' Complete the form by entering Applicant Title, Full Name, Last Name, Applicant (S/O, D/O, W/O), Applicant Relative Name, Address, CNIC'
                        }
                      </div>
                    ) : (
                      ''
                    )}

                    <Row>
                      <Col span={24}>
                        <h4 className="section-title">Personal Details</h4>
                        <PersonalDetail serialError={serialExist} />
                        <h4 className="section-title">Address Details</h4>
                        <AddressDetail addressDropdowns={addressDropdowns} />
                        <h4 className="section-title">Contact Details</h4>
                        <ContactDetail emailError={emailExist} />
                        <h4 className="section-title">Other Details</h4>
                        <OtherDetail addressDropdowns={addressDropdowns} cnicError={cnicExist} />
                      </Col>
                    </Row>
                  </div>
                  <Form.Item>
                    <Button
                      className="ant-btn-submit"
                      style={{ marginTop: '15px' }}
                      htmlType="submit"
                      key="submit"
                    >
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span="7" className="saleList">
                <Tabs defaultActiveKey="1" type="card">
                  <TabPane tab="Summary" key="1">
                    <Summary
                      userId={id}
                      totalSales={(fetchClientDetails || {}).salesCount || []}
                      totalPaid={
                        fetchClientDetails.customer && fetchClientDetails.customer[0].installmentSum
                      }
                      createdAt={
                        fetchClientDetails.customer && fetchClientDetails.customer[0].createdAt
                      }
                      updatedAt={
                        fetchClientDetails.customer && fetchClientDetails.customer[0].updatedAt
                      }
                    />
                  </TabPane>
                  <TabPane tab="Update request" key="2">
                    {fetchClientDetails.customer &&
                    fetchClientDetails.customer[0].ccdUpdateRequests[0] ? (
                        <UpdateRequest
                          requestedDate={
                            fetchClientDetails.customer[0].ccdUpdateRequests[0].createdAt
                          }
                          updateRequestStatus={
                            fetchClientDetails.customer[0].ccdUpdateRequests[0].requestStatus
                          }
                          updateRequestId={
                            fetchClientDetails.customer[0].ccdUpdateRequests[0].customerId
                          }
                        />
                      ) : (
                        <div className="side-tile">
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                  </TabPane>
                  <TabPane tab="Inquiries" key="3">
                    {/* this class used for sidebar scroll ---> className="summaryList" */}
                    {fetchClientDetails.customer &&
                    fetchClientDetails.customer[0].ccdComplaints[0] ? (
                        fetchClientDetails.customer[0].ccdComplaints.map((value, index) => {
                          return (
                          <>
                            {' '}
                            <Inquiry
                              key={index}
                              inquiryTitle={value.title}
                              complaintStatus={value.status}
                              complaintType={value.type}
                              trackingID={value.tracking_id}
                              clientName={
                                fetchClientDetails.customer[0].first_name +
                                ' ' +
                                fetchClientDetails.customer[0].last_name
                              }
                              clientCnic={fetchClientDetails.customer[0].cnic}
                              clientPhone={fetchClientDetails.customer[0].phone}
                              clientId={value.id}
                            />
                          </>
                          )
                        })
                      ) : (
                        <div className="side-tile">
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </>
  )
}

Modals.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}
export default Modals
