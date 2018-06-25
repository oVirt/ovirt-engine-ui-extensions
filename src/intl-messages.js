import { formatMessage } from './utils/intl'
import messageDescriptors from './intl/messages'

function messageDescriptorsToFormatFunctions (descriptors) {
  const result = {}

  Object.keys(descriptors).forEach((key) => {
    const id = descriptors[key].id
    const defaultMessage = descriptors[key].defaultMessage

    result[key] = (values) => {
      return formatMessage(id, defaultMessage, values)
    }
  })

  return result
}

export const msg = messageDescriptorsToFormatFunctions(messageDescriptors)
