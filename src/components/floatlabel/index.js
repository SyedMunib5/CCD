import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'
const FloatLabel = props => {
  const { children, label } = props

  return (
    <div className="float-label">
      {children}
      <label className="label label-float">{label}</label>
    </div>
  )
}

FloatLabel.propTypes = {
  children: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
}
export default FloatLabel
