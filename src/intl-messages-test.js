import parser from 'intl-messageformat-parser'
import messageDescriptors from './intl/messages'
import translatedMessages from './intl/translations.json'

describe('verify the content of [/src/intl/messages.js]', () => {
  describe.each(
    Object.entries(messageDescriptors).map(([ messageKey, descriptor ]) =>
      [ messageKey, descriptor.id, descriptor.defaultMessage, descriptor.description ]
    )
  )('validate messageDescriptor [%s]', (
    messageKey,
    id,
    defaultMessage,
    description
  ) => {
    it('message has a valid id', () => {
      expect(id).toMatch(/^[a-zA-Z]+(.[a-zA-Z]*)*$/)
    })

    it('message has a defaultMessage and it is a String', () => {
      expect(defaultMessage).toEqual(expect.any(String))
    })

    it('defaultMessage successfully parses as an ICU message', () => {
      expect(() => { parser.parse(defaultMessage) }).not.toThrow()
    })
  })
})

expect.extend({
  toBeSubsetOf (received, superset) {
    let failed = []

    for (const item of received) {
      if (!superset.includes(item)) {
        failed.push(item)
      }
    }

    if (failed.length === 0) {
      return {
        pass: true
      }
    } else {
      return {
        pass: false,
        message: () => `expected has values not part of the set [${failed.join(', ')}]`
      }
    }
  }
})

function parseIcuArgumentsForMessage (message) {
  if (!message) {
    return { type: 'empty' }
  }

  const args = {}

  try {
    const parsed = parser.parse(message)
    if (parsed.type === 'messageFormatPattern') {
      parsed.elements.forEach(element => {
        if (element.type === 'argumentElement') {
          args[element.id] = (element.format && element.format.type) || null
        }
      })
    }
  } catch (e) {
    return null
  }

  return args
}

describe('verify the content of [src/intl/translations.json]', () => {
  const englishIcuArguments = {}
  for (const { id, defaultMessage } of Object.values(messageDescriptors)) {
    englishIcuArguments[id] = parseIcuArgumentsForMessage(defaultMessage)
  }

  const englishKeys = Object.values(messageDescriptors).map(({ id }) => id)

  describe.each(
    Object.keys(translatedMessages)
  )('validate translations for locale [%s]', (locale) => {
    it('no unique message keys', () => {
      expect(Object.keys(translatedMessages[locale])).toBeSubsetOf(englishKeys)
    })

    describe.each(
      Object.entries(translatedMessages[locale])
    )('verify translation [%s]', (key, message) => {
      it('parses as an ICU message', () => {
        expect(() => { parser.parse(message) }).not.toThrow()
      })

      it('translation ICU arguments match English ICU arguments', () => {
        const englishArgs = englishIcuArguments[key]
        const localeArgs = parseIcuArgumentsForMessage(message)

        expect(localeArgs).toEqual(englishArgs)
      })
    })
  })
})
