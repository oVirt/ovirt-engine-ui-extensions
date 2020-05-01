import { round } from './round'

describe('rounding precision tests', function () {
  it('rounding to tens', function () {
    expect(round(12344, -1)).toBe(12340)
    expect(round(12345, -1)).toBe(12350)
    expect(round(12344, -2)).toBe(12300)
    expect(round(12354, -2)).toBe(12400)
    expect(round(12445, -3)).toBe(12000)
    expect(round(12545, -3)).toBe(13000)
  })

  it('rounding to integer', function () {
    expect(round(12345)).toBe(12345)
    expect(round(12345, 0)).toBe(12345)
    expect(round(12345.4, 0)).toBe(12345)
    expect(round(12345.5, 0)).toBe(12346)
  })

  it('rounding to decimals', function () {
    expect(round(1.2345, 1)).toBe(1.2)
    expect(round(1.2567, 1)).toBe(1.3)
    expect(round(1.2345, 2)).toBe(1.23)
    expect(round(1.2356, 2)).toBe(1.24)
    expect(round(1.2344, 3)).toBe(1.234)
    expect(round(1.2345, 3)).toBe(1.235)
  })
})
