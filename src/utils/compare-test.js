import { stringCompare, stringWithNumberSuffixCompare } from './compare'

describe('compare functions tests', function () {
  describe('stringCompare tests', function () {
    it('should compare two strings', function () {
      expect(stringCompare('abc', 'abd')).toBe(-1)
      expect(stringCompare('abc', 'abc')).toBe(0)
      expect(stringCompare('abd', 'abc')).toBe(1)
    })

    it('should handle undefinied parameters', function () {
      expect(stringCompare(undefined, 'abc')).toBe(0)
      expect(stringCompare(undefined, undefined)).toBe(0)
      expect(stringCompare('abc', undefined)).toBe(0)
    })

    it('should handle number parameters', function () {
      expect(stringCompare(123, 'abc')).toBe(0)
      expect(stringCompare(123, 123)).toBe(0)
      expect(stringCompare('abc', 123)).toBe(0)
    })

    it('should handle non string non number parameters', function () {
      expect(stringCompare(new Set(), 'abc')).toBe(0)
      expect(stringCompare(new Set(), new Set())).toBe(0)
      expect(stringCompare('abc', new Set())).toBe(0)
    })
  })

  describe('stringWithNumberSuffixCompare tests', function () {
    it('should compare two strings with number suffix', function () {
      expect(stringWithNumberSuffixCompare('aaa111', 'aaa222')).toBeLessThan(0)
      expect(stringWithNumberSuffixCompare('aaa111', 'aaa111')).toBe(0)
      expect(stringWithNumberSuffixCompare('aaa222', 'aaa111')).toBeGreaterThan(0)

      expect(stringWithNumberSuffixCompare('aaa111', 'bbb111')).toBeLessThan(0)
      expect(stringWithNumberSuffixCompare('bbb111', 'aaa111')).toBeGreaterThan(0)
    })

    it('should compare two strings without number suffix', function () {
      expect(stringWithNumberSuffixCompare('abc', 'abd')).toBeLessThan(0)
      expect(stringWithNumberSuffixCompare('abc', 'abc')).toBe(0)
      expect(stringWithNumberSuffixCompare('abd', 'abc')).toBeGreaterThan(0)

      expect(stringWithNumberSuffixCompare('abc', 'abc111')).toBeLessThan(0)
      expect(stringWithNumberSuffixCompare('abc111', 'abc')).toBeGreaterThan(0)
    })

    it('should handle undefinied parameters', function () {
      expect(stringWithNumberSuffixCompare(undefined, 'abc')).toBe(0)
      expect(stringWithNumberSuffixCompare(undefined, undefined)).toBe(0)
      expect(stringWithNumberSuffixCompare('abc', undefined)).toBe(0)
    })

    it('should handle number parameters', function () {
      expect(stringWithNumberSuffixCompare(123, 'abc')).toBe(0)
      expect(stringWithNumberSuffixCompare(123, 123)).toBe(0)
      expect(stringWithNumberSuffixCompare('abc', 123)).toBe(0)
    })

    it('should handle non string non number parameters', function () {
      expect(stringWithNumberSuffixCompare(new Set(), 'abc')).toBe(0)
      expect(stringWithNumberSuffixCompare(new Set(), new Set())).toBe(0)
      expect(stringWithNumberSuffixCompare('abc', new Set())).toBe(0)
    })
  })
})
