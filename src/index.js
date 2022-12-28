import React from 'react'
import { render } from 'react-dom'

import configureStore from 'libs/store'

import Root from 'components/root'

import 'normalize.css'

console.log(`Version: ${APP_VERSION} - ${GIT_COMMIT_HASH}`)

const store = configureStore()

render(<Root store={store} />, document.getElementById('root'))
