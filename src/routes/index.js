import React from 'react'
import { withRouter, useHistory, Switch } from 'react-router-dom'

import lazyLoad from 'libs/utils/lazy-loading'

import PrivateRoute from 'routes/components/privateRoute'

import PageNotFound from 'components/pageNotFound'

const Dashboard = lazyLoad(() => import('containers/dashboard'))
const Clients = lazyLoad(() => import('containers/clients'))
const Sales = lazyLoad(() => import('containers/sales'))
const Complaints = lazyLoad(() => import('containers/complaints'))
const UpdateRequests = lazyLoad(() => import('containers/updateRequests'))
const ChangePassword = lazyLoad(() => import('containers/changePassword'))
const ClientDetail = lazyLoad(() => import('components/modals/client'))
const SaleDetail = lazyLoad(() => import('components/modals/sale'))
const UpdateRequestDetail = lazyLoad(() => import('components/modals/updateRequest'))
const InquiryDetail = lazyLoad(() => import('components/modals/complaint'))
const ClientPortalLog = lazyLoad(() => import('containers/clientPortalLogs'))

export const ROUTES = {
  default: '/',
  dashboard: '/dashboard',
  sales: '/sales',
  clients: '/clients',
  complaints: '/inquiries',
  updateRequests: '/update Requests',
  changePassword: '/Update Password',
  clientDetail: '/client detail/:id',
  saleDetail: '/sale detail/:id',
  updateRequestDetail: '/update request detail/:id',
  inquiryDetail: '/inquiry detail/:id',
  clientPortalLog: '/client portal logs',
}

const Routes = () => {
  const history = useHistory()
  history.listen(() => {
    window.scrollTo(0, 0)
  })

  return (
    <>
      <Switch>
        {/**
         *****************
         * PRIVATE ROUTES
         *****************
         */}
        <PrivateRoute exact path={ROUTES.dashboard} component={Dashboard} />
        <PrivateRoute exact path={ROUTES.clients} component={Clients} />
        <PrivateRoute exact path={ROUTES.sales} component={Sales} />
        <PrivateRoute exact path={ROUTES.complaints} component={Complaints} />
        <PrivateRoute exact path={ROUTES.updateRequests} component={UpdateRequests} />
        <PrivateRoute exact path={ROUTES.changePassword} component={ChangePassword} />
        <PrivateRoute path={ROUTES.clientDetail} exact component={ClientDetail} />
        <PrivateRoute path={ROUTES.saleDetail} exact component={SaleDetail} />
        <PrivateRoute path={ROUTES.updateRequestDetail} exact component={UpdateRequestDetail} />
        <PrivateRoute path={ROUTES.inquiryDetail} exact component={InquiryDetail} />
        <PrivateRoute path={ROUTES.clientPortalLog} exact component={ClientPortalLog} />
        {/**
         *****************
         * FALLBACK ROUTE
         *****************
         */}
        <PrivateRoute component={PageNotFound} />
      </Switch>
    </>
  )
}

export default withRouter(Routes)
