import { isNumber } from './type-validation'
/**
 * Classic compare of two strings. If the parameter is not a string it returns 0.
 */
export function stringCompare (a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return 0
  }
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Special compare of two strings that have number suffix. At first, the string is divided into two parts - string and numeric.
 * If the string parts are equal, the numeric part is compared as a number.
 *
 * Example:
 * aaa1 < aaa9 < aaa10
 */
export function stringWithNumberSuffixCompare (a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return 0
  }

  let aNumberPart = parseInt(a.match(/[0-9]+$/))
  let aStringPart = a.replace(/[0-9]+$/, '')
  let bNumberPart = parseInt(b.match(/[0-9]+$/))
  let bStringPart = b.replace(/[0-9]+$/, '')

  if (isNumber(aNumberPart) && isNumber(bNumberPart)) {
    if (aStringPart !== bStringPart) {
      return stringCompare(aStringPart, bStringPart)
    } else {
      let aNumber = parseInt(aNumberPart, 10)
      let bNumber = parseInt(bNumberPart, 10)
      return aNumber - bNumber
    }
  } else {
    return stringCompare(a, b)
  }
}
