import getPluginApi from '../plugin-api'

export function buildSearch (prefix, fields = []) {
  let str = `${prefix}:`

  fields.forEach(({ name, values, operator = '=' }, fieldIndex) => {
    if (name && values.length > 0) {
      // add conjunction if needed
      str = fieldIndex > 0 ? `${str} and` : str

      // add field search criteria
      str = values.reduce((str, value, valueIndex) => (
        valueIndex === 0
          ? `${str} ${name} ${operator} ${value}`
          : `${str} or ${name} ${operator} ${value}`
      ), str)
    }
  })

  return str
}

/**
 * Apply a search query to the given webadmin place.
 *
 * @param {string} place Top level place to navigate the user
 * @param {string} prefix Primary search entity
 * @param {[{ name: string, values: [string], operator: string }]} fields Search fields and values
 */
export function applySearch (place, prefix, fields = []) {
  getPluginApi().revealPlace(place)
  getPluginApi().setSearchString(buildSearch(prefix, fields))
}
