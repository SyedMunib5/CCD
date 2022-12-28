import React from 'react'
// import {ROUTES} from 'routes'
import './style.scss'

const NotFound = () => (
  <React.Fragment>
    <section className="section notFoundWrapper">
      <h1>Coming soon</h1>
      <p className="zoom-area">The page you are looking might not exist.</p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      {/* <div className="link-container"></div> */}
    </section>
  </React.Fragment>
)

export default NotFound
