const chalk = require('chalk')
const table = require('table').table
const englishMessages = require('../src/intl/messages')

const byValue = {}
Object.keys(englishMessages).forEach(key => {
  const { id, defaultMessage: value } = englishMessages[key]
  const byVal = byValue[value] || []
  byVal.push({ id, key })
  byValue[value] = byVal
})
console.log(chalk`English key count: {yellow ${Object.keys(englishMessages).length}}`)

const multiples = {}
Object.keys(byValue).forEach(value => {
  if (byValue[value].length > 1) {
    multiples[value] = byValue[value]
  }
})
console.log(chalk`Multiple value count: {yellow ${Object.keys(multiples).length}}`)

const report = []
Object.keys(byValue).forEach(value => {
  if (byValue[value].length > 1) {
    report.push([
      chalk`{blue ${value}}`,
      byValue[value].map(a => `${a.id} / ${a.key}`).join('\n')
    ])
  }
})

if (report.length > 0) {
  console.log(table(report))
} else {
  console.log('No keys with duplicate values!')
}
