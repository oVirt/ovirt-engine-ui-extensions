import { expect } from 'chai'
import parser from 'intl-messageformat-parser'
import messageDescriptors from './intl/messages'
import translatedMessages from './intl/translations.json'

/*
 * Take a set of messages and generate a normalized object that can be deep compared
 * to another to see if the message structures match.
 *
 * To support how messages are defined in intl-messages.js, the __messages__ argument may
 * be formatted as follows:
 *    1. [ { id: '', defaultMessage: '' }, { id: '', defaultMessage: '' }, ... ]
 *    2. { '_name_': { id: '', defaultMessage: '' }, '_name_': { id: '', defaultMessage: '' }, ... }
 *
 * To support how messages are defined in 'translations.json', the __messages__ argument
 * may be formatted as follows:
 *    3. { '_id_': 'message text', '_id_': 'message text', ... }
 *
 * Regardless of input format, output will be normalized to look like:
 *    { '_id_': { msg: '', pattern: { type: 'argumentElement', id: ''argumentElement: '',  }}
 */
function normalizeMessagesForDiff (messages) {
  const normalForm = {}

  // normalize the key and message from any of the valid source formats
  if (Array.isArray(messages)) {
    messages.forEach(val => {
      const { id: name, defaultMessage: msg } = val
      normalForm[name] = { msg: msg }
    })
  } else {
    Object.keys(messages).forEach(key => {
      if (messages[key].id && messages[key].defaultMessage) {
        const { id: name, defaultMessage: msg } = messages[key]
        normalForm[name] = { msg: msg }
      } else if (typeof messages[key] === 'string') {
        const name = key
        const msg = messages[key]
        normalForm[name] = { msg: msg }
      }
    })
  }

  // extract the format arguments from the messages
  Object.keys(normalForm).forEach(name => {
    const parsed = normalForm[name].msg ? parser.parse(normalForm[name].msg) : { type: 'empty' }
    const args = normalForm[name].args = {}

    if (parsed.type === 'messageFormatPattern') {
      parsed.elements.forEach(element => {
        if (element.type === 'argumentElement') {
          args[element.id] = (element.format && element.format.type) || null
        }
      })
    }
  })

  return normalForm
}

describe('validate messageDescriptors from ./intl/messages.js', () => {
  it('every key has a non-empty id', () => {
    Object.keys(messageDescriptors).forEach(key => {
      expect(messageDescriptors[key], `key[${key}]`).to.have.property('id').that.is.a('string').and.is.not.empty
    })
  })

  it('every key has a non-empty defaultMessage', () => {
    Object.keys(messageDescriptors).forEach(key => {
      expect(messageDescriptors[key], `key[${key}]`).to.have.property('defaultMessage').that.is.a('string').and.is.not.empty
    })
  })

  it('every key has a non-empty description', () => {
    Object.keys(messageDescriptors).forEach(key => {
      expect(messageDescriptors[key], `key[${key}]`).to.have.property('description').that.is.a('string').and.is.not.empty
    })
  })

  it('every defaultMessage parses as an ICU message successfully', () => {
    const parseErrors = []
    for (const { id, defaultMessage } of Object.values(messageDescriptors)) {
      try {
        parser.parse(defaultMessage)
      } catch (e) {
        parseErrors.push({ id, error: e })
      }
    }

    console.log('parseErrors in intl/messages.js:', parseErrors)
    expect(parseErrors).to.be.empty
  })
})

describe('verify the content of each locale in translations.json', () => {
  const englishNormalForm = normalizeMessagesForDiff(messageDescriptors)

  Object.keys(translatedMessages).forEach(locale => {
    describe(`check ${locale}`, () => {
      it('translations parse as ICU messages', () => {
        const parseErrors = []
        for (const [ id, message ] of Object.entries(translatedMessages[locale])) {
          try {
            parser.parse(message)
          } catch (e) {
            parseErrors.push({ id, error: e })
          }
        }

        console.log(`parseErrors for locale[${locale}]:`, parseErrors)
        expect(parseErrors).to.be.empty
      })

      const localeNormalForm = normalizeMessagesForDiff(translatedMessages[locale])

      it('no unique message keys', () => {
        expect(englishNormalForm, `locale[${locale}]`).to.have.include.keys(localeNormalForm)
      })

      it('messages match ICU arguments', () => {
        Object.keys(localeNormalForm)
          .filter(name => englishNormalForm[name])
          .forEach(name => {
            expect(englishNormalForm, `message [${name}]`).to.have.property(name)
            expect(localeNormalForm[name].args, `message [${name}]`).to.deep.equal(englishNormalForm[name].args)
          })
      })
    })
  })
})
