class Transform {
  constructor(x, y, k) {
    this.x = 0
    this.y = 0
    this.k = 1
    this.z = 0
    this.set(x, y, k)
  }

  set(x, y, k) {
    if (x != null) this.x = x
    if (y != null) this.y = y
    if (k != null) {
      this.k = k
      this.z = Math.round(Math.log2(this.k))
    }
  }

  translate(x, y) {
    this.x += x
    this.y += y
  }

  scale(k) {
    this.k *= k
    this.z = Math.round(Math.log2(this.k))
  }

  apply(point) {
    point.x = point.x * this.k + this.x
    point.y = point.y * this.k + this.y
    return point
  }

  invert(point) {
    point.x = (point.x - this.x) / this.k
    point.y = (point.y - this.y) / this.k
    return point
  }

  toString() {
    return `{x: ${this.x}, y: ${this.y}, k: ${this.k}}`
  }
}
