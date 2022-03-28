class CompatibilityVersion {
  constructor (major, minor) {
    this.major = major + ''
    this.minor = minor + ''
  }

  valueOf () {
    return Number(this.major.padStart(3, 0) + this.minor.padStart(3, 0))
  }
}

CompatibilityVersion.VERSION_4_7 = new CompatibilityVersion(4, 7)

export default CompatibilityVersion
