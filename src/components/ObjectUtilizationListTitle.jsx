import React from 'react'
import { string } from 'prop-types'

function ObjectUtilizationListTitle ({ text }) {
  return (
    <div className='row row-tile-pf'>
      <div className='col-md-12'>
        <div>{text}</div>
      </div>
    </div>
  )
}

ObjectUtilizationListTitle.propTypes = {
  text: string.isRequired
}

export default ObjectUtilizationListTitle
