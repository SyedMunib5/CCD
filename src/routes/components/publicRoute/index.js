import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from 'libs/utils/isLoggedIn'

import { ROUTES } from 'routes'

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={props =>
        isLoggedIn() && restricted ? (
          <Redirect to={ROUTES.dashboard} />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

PublicRoute.propTypes = {
  component: PropTypes.func,
  restricted: PropTypes.bool,
}

export default PublicRoute
