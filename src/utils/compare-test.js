import { expect } from 'chai'
import { stringCompare, stringWithNumberSuffixCompare } from './compare'

describe('compare functions tests', function () {
  describe('stringCompare tests', function () {
    it('should compare two strings', function () {
      expect(stringCompare('abc', 'abd')).to.equal(-1)
      expect(stringCompare('abc', 'abc')).to.equal(0)
      expect(stringCompare('abd', 'abc')).to.equal(1)
    })

    it('should handle undefinied parameters', function () {
      expect(stringCompare(undefined, 'abc')).to.equal(0)
      expect(stringCompare(undefined, undefined)).to.equal(0)
      expect(stringCompare('abc', undefined)).to.equal(0)
    })

    it('should handle number parameters', function () {
      expect(stringCompare(123, 'abc')).to.equal(0)
      expect(stringCompare(123, 123)).to.equal(0)
      expect(stringCompare('abc', 123)).to.equal(0)
    })

    it('should handle non string non number parameters', function () {
      expect(stringCompare(new Set(), 'abc')).to.equal(0)
      expect(stringCompare(new Set(), new Set())).to.equal(0)
      expect(stringCompare('abc', new Set())).to.equal(0)
    })
  })

  describe('stringWithNumberSuffixCompare tests', function () {
    it('should compare two strings with number suffix', function () {
      expect(stringWithNumberSuffixCompare('aaa111', 'aaa222')).to.be.lessThan(0)
      expect(stringWithNumberSuffixCompare('aaa111', 'aaa111')).to.equal(0)
      expect(stringWithNumberSuffixCompare('aaa222', 'aaa111')).to.be.greaterThan(0)

      expect(stringWithNumberSuffixCompare('aaa111', 'bbb111')).to.be.lessThan(0)
      expect(stringWithNumberSuffixCompare('bbb111', 'aaa111')).to.be.greaterThan(0)
    })

    it('should compare two strings without number suffix', function () {
      expect(stringWithNumberSuffixCompare('abc', 'abd')).to.be.lessThan(0)
      expect(stringWithNumberSuffixCompare('abc', 'abc')).to.equal(0)
      expect(stringWithNumberSuffixCompare('abd', 'abc')).to.be.greaterThan(0)

      expect(stringWithNumberSuffixCompare('abc', 'abc111')).to.be.lessThan(0)
      expect(stringWithNumberSuffixCompare('abc111', 'abc')).to.be.greaterThan(0)
    })

    it('should handle undefinied parameters', function () {
      expect(stringWithNumberSuffixCompare(undefined, 'abc')).to.equal(0)
      expect(stringWithNumberSuffixCompare(undefined, undefined)).to.equal(0)
      expect(stringWithNumberSuffixCompare('abc', undefined)).to.equal(0)
    })

    it('should handle number parameters', function () {
      expect(stringWithNumberSuffixCompare(123, 'abc')).to.equal(0)
      expect(stringWithNumberSuffixCompare(123, 123)).to.equal(0)
      expect(stringWithNumberSuffixCompare('abc', 123)).to.equal(0)
    })

    it('should handle non string non number parameters', function () {
      expect(stringWithNumberSuffixCompare(new Set(), 'abc')).to.equal(0)
      expect(stringWithNumberSuffixCompare(new Set(), new Set())).to.equal(0)
      expect(stringWithNumberSuffixCompare('abc', new Set())).to.equal(0)
    })
  })
})
