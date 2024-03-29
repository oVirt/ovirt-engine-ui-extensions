import { buildSearch, applySearch } from './webadmin-search'

describe('buildSearch', function () {
  it('returns prefix only when fields are undefined or empty', function () {
    expect(buildSearch('FooPrefix')).toBe('FooPrefix:')
    expect(buildSearch('FooPrefix', [])).toBe('FooPrefix:')
  })

  it('returns prefix only when fields are not defined properly', function () {
    expect(buildSearch('FooPrefix', [
      {
        theNameOfMyField: 'bar', // should be `name`
        values: ['aa', 'bb'],
      },
    ])).toBe('FooPrefix:')
    expect(buildSearch('FooPrefix', [
      {
        name: 'bar',
        values: [], // should not be empty
      },
    ])).toBe('FooPrefix:')
  })

  it('returns search with field values combined with `or` for the given field', function () {
    expect(buildSearch('FooPrefix', [
      {
        name: 'bar',
        values: ['aa', 'bb'],
      },
    ])).toBe('FooPrefix: bar = aa or bar = bb')
  })

  it('returns search containing `and` to combine multiple field definitions', function () {
    expect(buildSearch('FooPrefix', [
      {
        name: 'bar',
        values: ['aa', 'bb'],
      },
      {
        name: 'qux',
        values: [1, 2], // values converted to strings
      },
    ])).toBe('FooPrefix: bar = aa or bar = bb and qux = 1 or qux = 2')
  })

  it('allows customizing the operator for the given field', function () {
    expect(buildSearch('FooPrefix', [
      {
        name: 'bar',
        values: [1],
        operator: '<',
      },
    ])).toBe('FooPrefix: bar < 1')
  })
})

describe('applySearch', function () {
  it('calls pluginApi with search built via buildSearch', function () {
    const pluginApiStubs = window.top.pluginApi()

    const place = 'FooPlace'
    const prefix = 'FooPrefix'
    const fields = [{ name: 'bar', values: ['aa', 'bb'] }]
    const expectedSearch = buildSearch(prefix, fields)

    applySearch(place, prefix, fields)

    expect(pluginApiStubs.revealPlace.mock.calls[0]).toEqual([place])
    expect(pluginApiStubs.revealPlace.mock.calls.length).toBe(1)
    expect(pluginApiStubs.setSearchString.mock.calls[0]).toEqual([expectedSearch])
    expect(pluginApiStubs.setSearchString.mock.calls.length).toBe(1)
  })
})
