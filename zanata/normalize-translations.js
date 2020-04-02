#! /usr/bin/node
const stringify = require('json-stable-stringify')
const fs = require('fs')
const chalk = require('chalk')

const translatedFilename = [
  'src/intl/translations.json',
  '../src/intl/translations.json'
].find(filename => fs.existsSync(filename))
const translatedMessages = JSON.parse(fs.readFileSync(translatedFilename, 'utf8'))

console.log(chalk`removing empty translations from {green ${translatedFilename}}`)
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

console.log()
console.log(chalk`looking for keys that share English text in {green ${translatedFilename}}, they need to be expanded`)
const baseFilename = [
  'extra/messages/src/messages.json',
  '../extra/messages/src/messages.json'
].find(filename => fs.existsSync(filename))
const baseMessages = JSON.parse(fs.readFileSync(baseFilename, 'utf8'))

const byMessage = {}
baseMessages.forEach(message => {
  const byThisMessage = byMessage[message.defaultMessage] || []
  byThisMessage.push(message)
  byMessage[message.defaultMessage] = byThisMessage
})

Object.keys(byMessage)
  .filter(value => byMessage[value].length > 1)
  .forEach(defaultMessage => {
    const destKeys = byMessage[defaultMessage].map(message => message.id)
    console.log(chalk`  expanding translations for "{blue ${defaultMessage}}" ... [ ${destKeys.join(', ')} ]`)

    Object.keys(translatedMessages).forEach(locale => {
      const sourceKey = destKeys.find(key => translatedMessages[locale][key] && translatedMessages[locale][key].length > 0)
      if (sourceKey) {
        destKeys.filter(destKey => destKey !== sourceKey).forEach(destKey => {
          if (translatedMessages[locale][destKey]) {
            console.log(chalk`    locale {magenta ${locale}}, id "{magenta ${destKey}}" already exists, {yellow skipping}`)
          } else {
            console.log(chalk`    locale {magenta ${locale}}, source id "{magenta ${sourceKey}}" expanded to id "{magenta ${destKey}}"`)
            translatedMessages[locale][destKey] = translatedMessages[locale][sourceKey]
          }
        })
      } else {
        console.log(chalk`    locale {magenta ${locale}}, {yellow WARNING}: could not find the base translation!`)
      }
    })
  })

console.log()
console.log(chalk`normalizing translations in {green ${translatedFilename}}`)
const pretty = stringify(translatedMessages, {
  space: '  ',
  cmp: (a, b) => { return a.key > b.key ? 1 : -1 }
})

fs.writeFileSync(translatedFilename, pretty, 'utf8')
