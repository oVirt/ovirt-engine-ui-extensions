import { randomHexString, randomHexDigit, randomId } from './random'

describe('random digit tests', () => {
  it('get a digit between 0 and F', () => {
    for (let i = 0; i < 10; i++) {
      expect(randomHexDigit()).toEqual(expect.stringMatching(/^[0123456789abcedf]$/))
    }
  })
})

describe('random hex string tests', () => {
  it('length <= 0 is empty string', () => {
    expect(randomHexString(-1)).toBe('')
    expect(randomHexString(0)).toBe('')
  })

  it('length > 0 is a random string of that length', () => {
    const randomString = expect.stringMatching(/^[0123456789abcedf]+$/)

    for (let i = 1; i <= 20; i++) {
      const toTest = randomHexString(i)
      expect(toTest).toHaveLength(i)
      expect(toTest).toEqual(randomString)
    }
  })

  it('no length specified is 10 random hex characters', () => {
    const tenRandom = expect.stringMatching(/^[0123456789abcedf]{10}$/)

    for (let i = 0; i < 10; i++) {
      expect(randomHexString()).toEqual(tenRandom)
    }
  })
})

describe('random id tests', () => {
  const randomIdRegex = expect.stringMatching(/^generated-id-[0123456789abcedf]{10}$/)

  it('is the expected format', () => {
    for (let i = 0; i < 10; i++) {
      expect(randomId()).toEqual(randomIdRegex)
    }
  })
})
