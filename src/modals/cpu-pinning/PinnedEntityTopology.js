class Topology {
  constructor () {
    this.sockets = new Map()
  }

  add (socketId, coreId, cpuId, pinnedEntities, exclusivelyPinned = false) {
    if (!this.sockets.has(socketId)) {
      this.sockets.set(socketId, new Socket(socketId))
    }
    this.sockets.get(socketId).add(coreId, cpuId, pinnedEntities, exclusivelyPinned)
  }

  numberOfSockets () {
    return this.sockets.size
  }

  toArray () {
    return [...this.sockets.values()].sort((a, b) => a.socketId - b.socketId)
  }
}

class Socket {
  constructor (socketId) {
    this.socketId = socketId
    this.cores = new Map()
  }

  add (coreId, cpuId, pinnedEntities, exclusivelyPinned) {
    if (!this.cores.has(coreId)) {
      this.cores.set(coreId, new Core(coreId))
    }
    this.cores.get(coreId).add(cpuId, pinnedEntities, exclusivelyPinned)
  }

  toArray () {
    return [...this.cores.values()].sort((a, b) => a.coreId - b.coreId)
  }
}

class Core {
  constructor (coreId) {
    this.coreId = coreId
    this.cpus = new Map()
  }

  add (cpuId, pinnedEntities, exclusivelyPinned) {
    this.cpus.set(cpuId, new Thread(cpuId, pinnedEntities, exclusivelyPinned))
  }

  toArray () {
    return [...this.cpus.values()].sort((a, b) => a.cpuId - b.cpuId)
  }
}

class Thread {
  constructor (cpuId, pinnedEntities, exclusivelyPinned) {
    this.cpuId = cpuId
    this.pinnedEntities = pinnedEntities || []
    this.exclusivelyPinned = exclusivelyPinned
  }
}

export { Topology, Socket, Core, Thread }
