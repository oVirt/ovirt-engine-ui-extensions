import React from 'react'

// TODO(vs): This is only used by jQuery-based Tooltip component, remove this
// once that component gets replaced by patternfly-react equivalent component.
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
