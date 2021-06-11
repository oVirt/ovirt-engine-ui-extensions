export function createErrorMessage (error, includeDetails = false) {
  if (!error) {
    return 'Undefinied error'
  }

  if (typeof error === 'string') {
    return error
  }

  let errorMessage = ''

  // both Error and ErrorEvent have this property
  if (error.message) {
    errorMessage += error.message
  }

  if (includeDetails) {
    // error || event || default
    errorMessage = `${errorMessage}
    Details:
        file: ${error.fileName || error.filename || 'unknown'}
        line: ${error.lineNumber || error.lineno || 'unknown'}
        column: ${error.columnNumber || error.colno || 'unknown'}
    `
    if (error.stack) {
      errorMessage = `${errorMessage}
      Stack:
          ${error.stack}
      `
    }
  }

  return errorMessage
}
