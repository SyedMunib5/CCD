import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import defaultUser from 'images/no-image.svg'
import amazon from 'images/G-11 Hotel@2x.png'
import florence from 'images/Florence@2x.png'
import golfFlora from 'images/Golf Floras@2x.png'
import ibm from 'images/IBM@2x.png'
import moa from 'images/MOA@2x.png'
import aom from 'images/Amazon@2x.png'

const Images = props => {
  const image = props && props.name.trim()
  const [src, setSrc] = useState('')
  const getImageName = async () => {
    let src = ''
    if (image === 'amazon hotel (g-11)') {
      src = amazon
    } else if (image === 'golf floras') {
      src = golfFlora
    } else if (image === 'florence galleria') {
      src = florence
    } else if (image === 'mall of arabia') {
      src = moa
    } else if (image === 'imarat builders mall') {
      src = ibm
    } else if (image === 'amazon outlet mall') {
      src = aom
    } else {
      src = defaultUser
    }
    setSrc(src)
  }

  useEffect(() => {
    getImageName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <img src={src} alt="not found" className="project-banner" />
}

Images.propTypes = {
  name: PropTypes.string,
}

export default Images
