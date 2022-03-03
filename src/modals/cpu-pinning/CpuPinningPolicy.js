import { msg } from '_/intl-messages'

const CpuPinningPolicy = {
  none: msg.cpuPinningModalVmPinningPolicyFieldNone(),
  manual: msg.cpuPinningModalVmPinningPolicyFieldManual(),
  resize_and_pin_numa: msg.cpuPinningModalVmPinningPolicyFieldResizeAndPin(),
  dedicated: msg.cpuPinningModalVmPinningPolicyFieldDedicated(),

  isManual (policy) {
    return policy === 'manual'
  },

  isNone (policy) {
    return policy === 'none'
  },

  isDynamic (policy) {
    return !this.isManual(policy) && !this.isNone(policy)
  },
}

Object.freeze(CpuPinningPolicy)
export default CpuPinningPolicy
