import { parse } from './cpuPinningParser'

describe('cpu pinning parser', function () {
  describe('with single item cpu set', function () {
    it('should parse to a single number array', function () {
      const result = parse({ vcpu: '1', cpuSet: '3' })
      expect(result[0]).toBe(1)
      expect(result[1].size).toBe(1)
      expect(result[1].has(3)).toBeTruthy()
    })
  })

  describe('with cpu set range', function () {
    it('should parse as a continuous range of numbers', function () {
      const result = parse({ vcpu: '1', cpuSet: '3-5' })
      expect(result[0]).toBe(1)
      expect(result[1].size).toBe(3)
      expect(result[1].has(3)).toBeTruthy()
      expect(result[1].has(4)).toBeTruthy()
      expect(result[1].has(5)).toBeTruthy()
    })
  })

  describe('with cpu set range with excluded cpus', function () {
    it('should parse as a range of cpus with excluded cpus', function () {
      const result = parse({ vcpu: '1', cpuSet: '3-5,^4' })
      expect(result[0]).toBe(1)
      expect(result[1].size).toBe(2)
      expect(result[1].has(3)).toBeTruthy()
      expect(result[1].has(4)).toBeFalsy()
      expect(result[1].has(5)).toBeTruthy()
    })
  })
})
