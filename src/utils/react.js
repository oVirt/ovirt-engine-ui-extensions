import React from 'react'

export function cloneElementWithCustomRef (reactElement, customRef, props = {}) {
  return React.cloneElement(reactElement, Object.assign({}, props, {
    ref: (e) => {
      // invoke custom callback ref
      customRef(e)

      // invoke existing callback ref, if it's defined
      if (typeof reactElement.ref === 'function') {
        reactElement.ref(e)
      }
    }
  }))
}
