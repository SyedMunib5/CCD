import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from 'libs/utils/isLoggedIn'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to login page
    <Route
      {...rest}
      render={props => (isLoggedIn() ? <Component {...props} /> : <Redirect to="/" />)}
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.shape(),
}

export default PrivateRoute
