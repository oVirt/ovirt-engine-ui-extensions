import { isNumber, isNumberInRange } from './type-validation'

describe('type validation tests', function () {
  describe('isNumber tests', function () {
    it('should detect if value is integer', function () {
      expect(isNumber(-1.5)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(1.5)).toBe(true)

      expect(isNumber('-1.5')).toBe(true)
      expect(isNumber('0')).toBe(true)
      expect(isNumber('1.5')).toBe(true)

      expect(isNumber(Infinity)).toBe(false)
      expect(isNumber('abc')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
      expect(isNumber(null)).toBe(false)
    })
  })

  describe('isNumberInRange tests', function () {
    it('should detect if value is in range', function () {
      expect(isNumberInRange(-1.5, -5, 5)).toBe(true)
      expect(isNumberInRange(0, -5, 5)).toBe(true)
      expect(isNumberInRange(1.5, -5, 5)).toBe(true)
      expect(isNumberInRange(5, -5, 5)).toBe(true)

      expect(isNumberInRange(-5, -5, 5)).toBe(false)
      expect(isNumberInRange(-5.1, -5, 5)).toBe(false)
      expect(isNumberInRange(5.1, -5, 5)).toBe(false)

      expect(isNumberInRange(-1.5, -5, 5)).toBe(true)
      expect(isNumberInRange(0, -5, 5)).toBe(true)
      expect(isNumberInRange(1.5, -5, 5)).toBe(true)
      expect(isNumberInRange(5, -5, 5)).toBe(true)

      expect(isNumberInRange(-5, -5, 5)).toBe(false)
      expect(isNumberInRange(-5.1, -5, 5)).toBe(false)
      expect(isNumberInRange(5.1, -5, 5)).toBe(false)
      expect(isNumberInRange(Infinity, -5, 5)).toBe(false)
      expect(isNumberInRange('abc', -5, 5)).toBe(false)
      expect(isNumberInRange(true, -5, 5)).toBe(false)
      expect(isNumberInRange(undefined, -5, 5)).toBe(false)
      expect(isNumberInRange(null, -5, 5)).toBe(false)
    })
  })
})
