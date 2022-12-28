import React from 'react'
import { css } from '@emotion/react'
import PropagateLoader from 'react-spinners/PropagateLoader'

import './style.scss'

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  border-color: #009fe3;
  background-color: #009fe3;
  margin: 0;
`
const Loader = props => {
  return (
    <div className="loaderWrapper">
      <PropagateLoader color={'#009fe3'} loading={true} css={override} size={15} {...props} />
    </div>
  )
}

export default Loader
