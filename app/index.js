import domready from 'domready'
import React from 'react'
import ReactDOM from 'react-dom'
import Application from 'components/Application'

domready(() => {
  ReactDOM.render((
    <Application />
  ), document.getElementById('application'))
})
