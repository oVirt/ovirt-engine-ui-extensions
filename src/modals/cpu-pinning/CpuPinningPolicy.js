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
    return policy && !this.isManual(policy) && !this.isNone(policy)
  },

  isExclusive (policy) {
    return policy === 'dedicated'
  },
}

Object.freeze(CpuPinningPolicy)
export default CpuPinningPolicy
