export function isNone (policy) {
  return policy === 'none'
}

export function isManual (policy) {
  return policy === 'manual'
}

export function isResizeAndPinNuma (policy) {
  return policy === 'resize_and_pin_numa'
}

export function isDedicated (policy) {
  return policy === 'dedicated'
}

export function isDynamic (policy) {
  return policy && !isManual(policy) && !isNone(policy)
}

export function isExclusive (policy) {
  return isDedicated(policy)
}
