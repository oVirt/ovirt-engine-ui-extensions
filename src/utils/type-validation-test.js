import { expect } from 'chai'
import { isNumber, isNumberInRange } from './type-validation'

describe('type validation tests', function () {
  describe('isNumber tests', function () {
    it('should detect if value is integer', function () {
      expect(isNumber(-1.5)).to.true
      expect(isNumber(0)).to.true
      expect(isNumber(1.5)).to.true

      expect(isNumber('-1.5')).to.true
      expect(isNumber('0')).to.true
      expect(isNumber('1.5')).to.true

      expect(isNumber(Infinity)).to.false
      expect(isNumber('abc')).to.false
      expect(isNumber(true)).to.false
      expect(isNumber(undefined)).to.false
      expect(isNumber(null)).to.false
    })
  })

  describe('isNumberInRange tests', function () {
    it('should detect if value is in range', function () {
      expect(isNumberInRange(-1.5, -5, 5)).to.true
      expect(isNumberInRange(0, -5, 5)).to.true
      expect(isNumberInRange(1.5, -5, 5)).to.true
      expect(isNumberInRange(5, -5, 5)).to.true

      expect(isNumberInRange(-5, -5, 5)).to.false
      expect(isNumberInRange(-5.1, -5, 5)).to.false
      expect(isNumberInRange(5.1, -5, 5)).to.false

      expect(isNumberInRange(-1.5, -5, 5)).to.true
      expect(isNumberInRange(0, -5, 5)).to.true
      expect(isNumberInRange(1.5, -5, 5)).to.true
      expect(isNumberInRange(5, -5, 5)).to.true

      expect(isNumberInRange(-5, -5, 5)).to.false
      expect(isNumberInRange(-5.1, -5, 5)).to.false
      expect(isNumberInRange(5.1, -5, 5)).to.false
      expect(isNumberInRange(Infinity, -5, 5)).to.false
      expect(isNumberInRange('abc', -5, 5)).to.false
      expect(isNumberInRange(true, -5, 5)).to.false
      expect(isNumberInRange(undefined, -5, 5)).to.false
      expect(isNumberInRange(null, -5, 5)).to.false
    })
  })
})
