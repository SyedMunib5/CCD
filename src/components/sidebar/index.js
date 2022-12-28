import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { Menu, Affix } from 'antd'
import { ROUTES } from 'routes'

import logo from 'images/logo.svg'
import home from 'images/home.svg'
import sales from 'images/sales.svg'
import clients from 'images/clients.svg'
import inquiries from 'images/inquiries.svg'
import updaterequests from 'images/updaterequests.svg'
import clientLogs from 'images/client-logs.svg'

import './style.scss'

const Sidebar = () => {
  const location = useLocation()
  return (
    <>
      <Affix offsetTop={2}>
        <Menu defaultSelectedKeys={[location.pathname]} mode="inline" className="sidebar">
          <div className="logo">
            <img className="ant-menu-item" src={logo} alt="logo not loaded" />
          </div>
          <Menu.Item key={ROUTES.dashboard} className="item">
            <Link to={ROUTES.dashboard} className="active">
              <img className="sidebar-icons" src={home} alt="loading" />
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key={ROUTES.sales} className="item">
            <Link to={ROUTES.sales}>
              <img className="sidebar-icons" src={sales} alt="loading" />
              Sales
            </Link>
          </Menu.Item>
          <Menu.Item key={ROUTES.clients} className="item">
            <Link to={ROUTES.clients}>
              <img className="sidebar-icons" src={clients} alt="loading" />
              Clients
            </Link>
          </Menu.Item>
          <Menu.Item key={ROUTES.complaints} className="item">
            <Link to={ROUTES.complaints}>
              <img className="sidebar-icons" src={inquiries} alt="loading" />
              Inquiries
            </Link>
          </Menu.Item>
          <Menu.Item key={ROUTES.updateRequests} className="item">
            <Link to={ROUTES.updateRequests}>
              <img className="sidebar-icons" src={updaterequests} alt="loading" />
              Update Requests
            </Link>
          </Menu.Item>
          <Menu.Item key={ROUTES.clientPortalLog} className="item">
            <Link to={ROUTES.clientPortalLog}>
              <img className="sidebar-icons" src={clientLogs} alt="loading" />
              Client Portal Logs
            </Link>
          </Menu.Item>
        </Menu>
      </Affix>
    </>
  )
}

export default Sidebar
