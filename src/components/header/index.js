import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { signOut } from 'libs/utils/storage'
import { getUserFullName } from 'libs/utils/storage/index'
import { ROUTES } from 'routes'

import { Layout, Menu, Affix, Dropdown, Button, Space } from 'antd'
import { LogoutOutlined, DownOutlined, LockOutlined } from '@ant-design/icons'

import './style.scss'

const { Header } = Layout
const HeaderComp = () => {
  const location = useLocation()
  const name = getUserFullName()
  let title = ''
  if (location && location.pathname && location.pathname !== '') {
    title = location.pathname.slice(1)
    title = title.split('/')[0]
  }
  const handleLogout = async () => {
    try {
      signOut()
      window.location.href = '/'
    } catch (error) {
      console.log(error)
    }
  }

  const menu = (
    <Menu>
      <Menu.Item className="header-dropdown" key="1" icon={<LockOutlined />}>
        <Link to={ROUTES.changePassword}>Update Password</Link>
      </Menu.Item>
    </Menu>
  )
  return (
    <Affix offsetTop={0}>
      <Header className="header">
        <Menu mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item className="heading" key="1">
            {title}
          </Menu.Item>
          <Menu mode="horizontal" defaultSelectedKeys={['1']} className="sub-menu">
            <Menu.Item className="header-dropdown-menu">
              <Space wrap>
                <Dropdown overlay={menu}>
                  <Button>
                    {name} <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </Menu.Item>
            <Menu.Item className="dash">
              <p></p>
            </Menu.Item>
            <Menu.Item className="subMenu" key="3" onClick={() => handleLogout()}>
              <LogoutOutlined /> Sign out
            </Menu.Item>
          </Menu>
        </Menu>
      </Header>
    </Affix>
  )
}

export default HeaderComp
