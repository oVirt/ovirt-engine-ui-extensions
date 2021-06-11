import { createErrorMessage } from './error-message'

describe('error message functions tests', function () {
  const message = 'abc'
  const file = 'file.js'
  const line = 30
  const column = 50

  describe('undefinied to error message test', function () {
    it('should return Undefinied error', function () {
      expect(createErrorMessage(undefined)).toBe('Undefinied error')
    })
  })

  describe('string to error message test', function () {
    it('should return exact string', function () {
      expect(createErrorMessage(message)).toBe(message)
    })
  })

  describe('Error to error message test', function () {
    it('should return message without details', function () {
      expect(createErrorMessage(createError())).toBe(message)
    })

    it('should return message with details', function () {
      const errorMessage = createErrorMessage(createError(), true)

      expect(errorMessage).toContain(message)
      expect(errorMessage).toContain(file)
      expect(errorMessage).toContain(line)
      expect(errorMessage).toContain(column)
    })
  })

  describe('ErrorEvent to error message test', function () {
    it('should return message without details', function () {
      expect(createErrorMessage(createEvent())).toBe(message)
    })

    it('should return message with details', function () {
      const errorMessage = createErrorMessage(createEvent(), true)

      expect(errorMessage).toContain(message)
      expect(errorMessage).toContain(file)
      expect(errorMessage).toContain(line)
      expect(errorMessage).toContain(column)
    })
  })

  function createError () {
    return {
      message: message,
      fileName: file,
      lineNumber: line,
      columnNumber: column
    }
  }

  function createEvent () {
    return {
      message: message,
      filename: file,
      lineno: line,
      colno: column
    }
  }
})
