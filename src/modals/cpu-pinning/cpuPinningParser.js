// based on org.ovirt.engine.core.bll.scheduling.utils.CpuPinningHelper
import range from 'lodash/range'

export function parse ({ vcpu, cpuSet }) {
  const include = new Set()
  const exclude = new Set()

  cpuSet.split(',').forEach(section => {
    if (section.startsWith('^')) {
      // exclude
      exclude.add(+section.substring(1))
    } else if (section.includes('-')) {
      // include range
      const numbers = section.split('-')
      const start = +numbers[0]
      const end = +numbers[1] + 1
      range(start, end).forEach((item) => include.add(item))
    } else {
      // include one
      include.add(+section)
    }
  })

  exclude.forEach((item) => include.delete(item))

  return [+vcpu, include]
}
