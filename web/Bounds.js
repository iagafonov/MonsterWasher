class Bounds {
  constructor(p0, p1) {
    this.p0 = p0
    this.p1 = p1
  }

  clone() {
    return new Bounds(this.p0.clone(), this.p1.clone())
  }

  toString() {
    return `{p0: ${this.p0}, p1: ${this.p1}}`
  }
}
