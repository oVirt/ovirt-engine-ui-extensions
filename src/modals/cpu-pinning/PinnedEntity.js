import { Topology } from './PinnedEntityTopology'

class PinnedEntity {
  constructor ({
    id,
    name,
    cpuCount,
    cpuPinningTopology,
    cpuPinningPolicy,
    cpuPinningString,
  }) {
    this.id = id
    this.name = name
    this.cpuCount = cpuCount || 0
    this.cpuPinningTopology = cpuPinningTopology || new Topology()
    this.cpuPinningPolicy = cpuPinningPolicy
    this.cpuPinningString = cpuPinningString
  }
}

export default PinnedEntity
