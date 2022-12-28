import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader/root'

import App from 'components/app'

const Root = ({ store }) => (
  <Provider store={store}>
    <App path="/*" />
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default hot(Root)
