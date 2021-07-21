import React, { useState } from 'react'
import { List, ListItem } from '@patternfly/react-core'
import PropTypes from 'prop-types'

const VmList = ({
  vmNames = [],
  showAllThreshold = 10,
  showAllLabel = 'Show all Virtual Machines',
  showLessLabel = 'Show less Virtual Machines',
}) => {
  const [showAll, setShowAll] = useState(false)

  const vmNamesToShow = showAll ? vmNames : vmNames.slice(0, showAllThreshold)
  const showLink = vmNames.length > showAllThreshold

  return (
    <>
      <List className='vm-list'>
        {vmNamesToShow.map(name => (
          <ListItem key={name}>{name}</ListItem>
        ))}
      </List>
      {showLink && (
        <a href='#' onClick={event => {
          event.preventDefault()
          setShowAll(!showAll)
        }}
        >
          {showAll ? showLessLabel : showAllLabel}
        </a>
      )}
    </>
  )
}

VmList.propTypes = {
  vmNames: PropTypes.arrayOf(PropTypes.string),
  showAllThreshold: PropTypes.number,
  showAllLabel: PropTypes.string,
  showLessLabel: PropTypes.string,
}

export default VmList
