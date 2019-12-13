import { msg } from '_/intl-messages'

export function handleNonAvailableValue (value) {
  return value === undefined ? msg.nonAvailableValue() : value
}
