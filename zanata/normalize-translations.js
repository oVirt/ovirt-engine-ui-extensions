#! /usr/bin/node
const stringify = require('json-stable-stringify')
const fs = require('fs')
const chalk = require('chalk')
const table = require('table').table

const filename = [
  'src/intl/translations.json',
  '../src/intl/translations.json'
].find(filename => fs.existsSync(filename))

const translatedMessages = JSON.parse(fs.readFileSync(filename, 'utf8'))

console.log(chalk`removing empty translations from {green ${filename}}`)
Object.keys(translatedMessages).forEach(locale => {
  const removed = []
  Object.keys(translatedMessages[locale]).forEach(id => {
    if (translatedMessages[locale][id] === '') {
      removed.push(id)
      delete translatedMessages[locale][id]
    }
  })
  if (removed.length) {
    console.log(chalk`\t{yellow ${locale}}`)
    removed.forEach(key => { console.log(chalk`\t\t{yellow ${key}}`) })
  }
})

console.log(chalk`normalizing translations in {green ${filename}}`)
const pretty = stringify(translatedMessages, {
  space: '  ',
  cmp: (a, b) => { return a.key > b.key ? 1 : -1 }
})

fs.writeFileSync(filename, pretty, 'utf8')

// check and report on per-locale translation coverage and untranslated keys
function round (number, precision = 0) {
  const factor = Math.pow(10, precision)
  const temp = number * factor
  const roundedTemp = Math.round(temp)
  return roundedTemp / factor
}

function reportCoverage (englishMessages, translatedMessagesPerLocale) {
  const messagesKeyCount = Object.keys(englishMessages).length

  const report = []
  Object.keys(translatedMessagesPerLocale).forEach(
    locale => {
      const localKeyCount = Object.keys(translatedMessagesPerLocale[locale]).length
      const percent = round((localKeyCount / messagesKeyCount) * 100, 1)
      report.push([
        chalk`{blue ${locale}}`,
        `${localKeyCount}/${messagesKeyCount}`,
        chalk`{yellow ${percent}%}`
      ])
    }
  )
  console.log(table([['locale', 'keys', 'percent'], ...report], {
    columns: {
      0: {},
      1: { alignment: 'right' },
      2: { alignment: 'right' }
    },
    drawHorizontalLine: (index, size) => index === 0 || index === 1 || index === size
  }))
}

function reportUntranslatedKeys (normEnglishMessages, translatedMessagesPerLocale) {
  const untranslated = {}
  Object.keys(translatedMessagesPerLocale).forEach(locale => {
    untranslated[locale] = []
    const translated = translatedMessagesPerLocale[locale]
    Object.keys(normEnglishMessages).forEach(key => {
      if (!translated[key]) {
        untranslated[locale].push(key)
      }
    })
  })

  const untranslatedReport = []
  Object.keys(untranslated)
    .filter(locale => untranslated[locale].length > 0)
    .forEach(locale => {
      untranslatedReport.push([
        chalk`{blue ${locale}}`,
        untranslated[locale].sort().join('\n')
      ])
    })

  if (untranslatedReport.length === 0) {
    console.log(chalk`{green All keys for all locales are translated!}`)
  } else {
    console.log(table([ ['locale', 'keys'], ...untranslatedReport ]))
  }
}

const englishMessages = require('../src/intl/messages')
const normEnglishMessages = {}
Object.keys(englishMessages).forEach(key => {
  const { id, defaultMessage: value } = englishMessages[key]
  normEnglishMessages[id] = value
})

const translatedMessagesPerLocale = JSON.parse(fs.readFileSync(filename, 'utf8'))

console.log()
console.log('Untranslated keys per locale:')
reportUntranslatedKeys(normEnglishMessages, translatedMessagesPerLocale)

console.log()
console.log('Translation coverage report:')
reportCoverage(normEnglishMessages, translatedMessagesPerLocale)
