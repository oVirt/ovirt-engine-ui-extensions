/**
 * Return a promise that will resolve after the given time.
 *
 * @param {number} ms Milliseconds to sleep, defaults to 5000
 * @returns Promise that resolves after a timeout of _ms_ milliseconds
 */
export const sleep = (ms = 5000) => {
  console.log(`sleeping for ${ms}ms`)
  return new Promise(resolve => setTimeout(() => {
    console.log('sleeping complete!')
    resolve()
  }, ms))
}

/**
 * Return the provided __data__ item after sleeping for the given interval __ms__.
 */
export const resultAfterSleep = async (data, ms = 5000) => {
  const [toReturn] = await Promise.all([data, sleep(ms)])
  return toReturn
}
