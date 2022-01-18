// with any existing occurrences, like in UtilizationBar component.
export const randomId = () => `generated-id-${randomHexString()}`

/**
 * Generate a string of hex characters of the specified length.
 *
 * @param {*} length String length
 */
export const randomHexString = (length = 10) => {
  if (length <= 0) {
    return ''
  }

  let str = ''
  for (let i = 0; i < length; i++) {
    str += randomHexDigit()
  }
  return str
}

export function randomHexDigit () {
  const digit = Math.floor(Math.random() * 16)
  return digit.toString(16)
}
