
// Define in module scope, __config__ will expose getter
let useFakeData = false

const pluginConfigs = {}

/**
 * This flag is a hint to components that normally work with remote data. If set to true,
 * such components should use fake data instead of communicating with remote endpoint(s).
 */
Object.defineProperty(pluginConfigs, 'useFakeData', {
  get () { return useFakeData },
  enumerable: true
})

/**
 * Use this function to update configurations.  The default export __pluginConfigs__
 * cannot be edited directly.
 */
export function updateConfig (updates) {
  useFakeData = Boolean(updates.useFakeData)
}

export default pluginConfigs
