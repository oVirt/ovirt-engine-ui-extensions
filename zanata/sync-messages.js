// helper script copied from ovirt-web-ui

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const stableStringify = require('json-stable-stringify-without-jsonify')
const englishMessages = require('../src/intl/messages')

const TRANSLATED_MESSAGES = path.join('src', 'intl', 'translations.json')

function main () {
  const stringContent = fs.readFileSync(TRANSLATED_MESSAGES, { encoding: 'utf8' })
  const parsedContent = JSON.parse(stringContent)
  removeNotExistedMessages(parsedContent)
  const serializedContent = stableStringify(parsedContent, { space: 2 }) + '\n'
  fs.writeFileSync(TRANSLATED_MESSAGES, serializedContent)
  console.log(chalk.green(`[sync-messages.js] ${TRANSLATED_MESSAGES} written ✔`))
}

/**
 * It may happen that some message will be deleted or renamed
 * in original (English) messages script and this function should
 * remove all translated messages that doesn't exist in original
 * file.
 *
 * @param translations object
 */
function removeNotExistedMessages (translations) {
  const idsOfEnglishMessages = new Set(Object.values(englishMessages).map(entry => entry.id))
  Object.keys(translations).forEach(langKey => {
    const languageMessages = translations[langKey]
    console.log(chalk.green(`[sync-messages.js] Checking language '${langKey}'`))
    Object.keys(languageMessages).forEach(messageKey => {
      if (!idsOfEnglishMessages.has(messageKey)) {
        console.log(chalk.yellow(`[sync-messages.js] Message '${messageKey}' will be removed`))
        delete languageMessages[messageKey]
      }
    })
  })
}

main()
