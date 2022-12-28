import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import PublicRoute from 'routes/components/publicRoute'
import Routes, { ROUTES } from 'routes'
import Login from 'containers/login'
import Header from 'components/header'
import Sidebar from 'components/sidebar'

import './style.scss'

const { Sider, Content } = Layout

const App = () => {
  return (
    <Router>
      <Switch>
        <PublicRoute
          exact
          restricted={true}
          path={ROUTES.default}
          component={props => <Login {...props} />}
        />
        <Layout className="app">
          <Sider width={256}>
            <Sidebar />
          </Sider>
          <Layout>
            <Header />
            <Content>
              <Routes />
            </Content>
          </Layout>
        </Layout>
      </Switch>
    </Router>
  )
}

export default App
